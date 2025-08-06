const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const router = express.Router();
const { oauth2Client } = require('../utils/google');

router.post('/upload/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const tokens = req.session.tokens; // From OAuth callback

  if (!tokens) return res.status(401).send('Not authenticated');

  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const videoPath = 'path_to_video_file'; // e.g., from Cloudinary download

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: 'Edited Video Upload',
        description: 'Uploaded via Creator Dashboard',
      },
      status: {
        privacyStatus: 'unlisted',
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  res.json({ message: 'Uploaded to YouTube', youtubeUrl: `https://www.youtube.com/watch?v=${response.data.id}` });
});
