const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Video = require('../models/Video');

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

module.exports = router;
