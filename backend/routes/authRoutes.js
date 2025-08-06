const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authControllers');
const protect = require('../middlewares/authMiddleware');
const { oauth2Client, getAuthUrl } = require('../utils/google');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video'); // your video model

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

// Start OAuth flow
router.get('/google', (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ message: 'Missing videoId' });

  req.session.videoId = videoId; // Store video ID in session
  const url = getAuthUrl(); // Get Google auth URL
  res.redirect(url);
});

// OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;

    const videoId = req.session.videoId;
    if (!videoId) return res.status(400).send('Missing video ID in session');

    // 1. Fetch video from DB
    const Video = require('../models/Video'); // your MongoDB model
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).send('Video not found');

    // 2. Download video from Cloudinary
    const axios = require('axios');
    const tmp = require('tmp');
    const fs = require('fs');
    const { google } = require('googleapis');

    const tmpFile = tmp.fileSync({ postfix: '.mp4' });
    const response = await axios({ url: video.url, responseType: 'stream' });
    const writer = fs.createWriteStream(tmpFile.name);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // 3. Upload to YouTube
    const authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    authClient.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: authClient });
    const fileSize = fs.statSync(tmpFile.name).size;

    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: video.originalName || 'Untitled',
          description: 'Uploaded via Creator Dashboard',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      media: {
        body: fs.createReadStream(tmpFile.name),
      },
    }, {
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSize) * 100;
        console.log(`Uploading: ${Math.round(progress)}%`);
      }
    });

    tmpFile.removeCallback();

    const youtubeId = uploadResponse.data.id;
    video.youtubeVideoId = youtubeId;
    await video.save();
    res.redirect(`http://localhost:5173/creator-dashboard?uploaded=true`);

  } catch (err) {
    console.error('OAuth Callback Error:', err);
    res.status(500).json({ message: 'YouTube upload failed' });
  }
});

// Upload video to YouTube
router.post('/upload-to-youtube', async (req, res) => {
  try {
    const tokens = req.session.tokens;
    const videoId = req.session.videoId;

    if (!tokens || !videoId) {
      return res.status(401).json({ message: 'Not authenticated or video missing' });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Set OAuth credentials
    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Download video from Cloudinary
    const { default: axios } = await import('axios');
    const response = await axios({ url: video.url, responseType: 'stream' });

    // Upload to YouTube
    const youtubeRes = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: `Edited Video - ${video.originalName}`,
          description: 'Uploaded from Creator Dashboard',
        },
        status: { privacyStatus: 'unlisted' },
      },
      media: {
        body: response.data,
      },
    });

    res.json({
      message: 'Video uploaded to YouTube',
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeRes.data.id}`,
    });
  } catch (err) {
    console.error('YouTube upload error:', err);
    res.status(500).json({ message: 'YouTube upload failed' });
  }
});

module.exports = router;
