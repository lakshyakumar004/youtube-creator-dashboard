const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Video = require('../models/Video');

// For upload route
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ytcreator-edits',
    resource_type: 'video',
    format: async () => 'mp4',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// @desc    Get all videos uploaded by the logged-in creator
// @route   GET /api/videos/mine
// @access  Private
router.get('/mine', protect, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
});

// @desc    Assign an editor to a video
// @route   POST /api/videos/:videoId/assign-editor
// @access  Creator only
router.post('/:videoId/assign-editor', protect, async (req, res) => {
  try {
    const { editorId } = req.body;
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to assign editors to this video' });
    }

    if (!video.assignedEditors.includes(editorId)) {
      video.assignedEditors.push(editorId);
      if (!video.uploadedFor) {
        video.uploadedFor = video.uploadedBy;
      }
      await video.save();
    }

    res.json({ message: 'Editor assigned successfully' });
  } catch (err) {
    console.error('Error assigning editor:', err);
    res.status(500).json({ message: 'Server error assigning editor' });
  }
});

// @desc    Get all videos assigned to the logged-in editor
// @route   GET /api/videos/to-edit
// @access  Private (Editors)
router.get('/to-edit', protect, async (req, res) => {
  try {
    const videos = await Video.find({ assignedEditors: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch assigned videos:', err);
    res.status(500).json({ message: 'Server error fetching assigned videos' });
  }
});

// @desc    Get all videos assigned to the logged-in editor
// @route   GET /api/videos/assigned
// @access  Private (Editor)
router.get('/assigned', protect, async (req, res) => {
  try {
    const videos = await Video.find({ assignedEditors: req.user.userId })
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'name email'); // optional: show creator details

    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch assigned videos:', err);
    res.status(500).json({ message: 'Server error fetching assigned videos' });
  }
});

// @desc    Editor uploads edited video for a creator
// @route   POST /api/videos/upload-for-creator
// @access  Private (Editor)
router.post('/upload-for-creator', protect, upload.single('video'), async (req, res) => {
  try {
    const { creatorId } = req.body;

    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== 'creator') {
      return res.status(400).json({ message: 'Invalid creator ID' });
    }

    const video = new Video({
      url: req.file.path,
      public_id: req.file.filename || req.file.public_id,
      uploadedBy: req.user.userId,
      uploadedFor: creatorId,
      originalName: req.file.originalname,
      status: 'edited',
    });

    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ message: 'Server error uploading video' });
  }
});

// @desc    Get all creators (for editor to choose by name)
// @route   GET /api/videos/creators
// @access  Private (Editor)
router.get('/creators', protect, async (req, res) => {
  try {
    const creators = await User.find({ role: 'creator' }).select('_id name email');
    res.json(creators);
  } catch (err) {
    console.error('Failed to fetch creators:', err);
    res.status(500).json({ message: 'Server error fetching creators' });
  }
});

// @desc    Creator uploads a video for a specific editor
// @route   POST /api/videos/upload-for-editor
// @access  Private (Creator)
router.post('/upload-for-editor', protect, upload.single('video'), async (req, res) => {
  try {
    const { editorId } = req.body;

    const editor = await User.findById(editorId);
    if (!editor || editor.role !== 'editor') {
      return res.status(400).json({ message: 'Invalid editor ID' });
    }

    const video = new Video({
      url: req.file.path,
      public_id: req.file.filename || req.file.public_id,
      uploadedBy: req.user.userId,
      originalName: req.file.originalname,
      status: 'pending',
      assignedEditors: [editorId],  // assign to selected editor
    });

    await video.save();
    res.status(201).json({ message: 'Video uploaded and assigned to editor', video });
  } catch (err) {
    console.error('Error uploading video for editor:', err);
    res.status(500).json({ message: 'Server error uploading video' });
  }
});

// @desc    Get all editors (for creator to choose by name/email)
// @route   GET /api/videos/editors
// @access  Private (Creator)
router.get('/editors', protect, async (req, res) => {
  try {
    const editors = await User.find({ role: 'editor' }).select('_id name email');
    res.json(editors);
  } catch (err) {
    console.error('Failed to fetch editors:', err);
    res.status(500).json({ message: 'Server error fetching editors' });
  }
});

router.get('/for-me', protect, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedFor: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Failed to fetch editor videos for creator:', err);
    res.status(500).json({ message: 'Server error fetching editor videos' });
  }
});

// @desc    Delete a video (creator only)
// @route   DELETE /api/videos/:videoId
// @access  Private
router.delete('/:videoId', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Only the user who uploaded it can delete
    if (video.uploadedBy.toString() !== req.user.userId && video.uploadedFor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // Delete from Cloudinary
    if (video.public_id) {
      await cloudinary.uploader.destroy(video.public_id, {
        resource_type: 'video',
      });
    }

    // Delete from MongoDB
    await video.deleteOne();

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ message: 'Server error deleting video' });
  }
});

module.exports = router;
