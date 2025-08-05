const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const protect = require('../middlewares/authMiddleware');
const Video = require('../models/Video');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ytcreator_videos',
    resource_type: 'video',
    format: async () => 'mp4',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

router.post('/video', protect, upload.single('video'), async (req, res) => {
  try {
    console.log('✅ Cloudinary Upload File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // ✅ Save video details to MongoDB
    const newVideo = new Video({
      url: req.file.path,
      public_id: req.file.filename,
      uploadedBy: req.user.userId, // ✅ from token
      originalName: req.file.originalname,
    });

    await newVideo.save();

    res.json({
      message: 'Video uploaded successfully',
      video: newVideo,
    });
  } catch (err) {
    console.error('❌ Cloudinary Upload Error:', err);
    res.status(500).json({ message: 'Something went wrong with Cloudinary upload' });
  }
});

module.exports = router;
