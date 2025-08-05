// routes/videoRoutes.js
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

module.exports = router;
