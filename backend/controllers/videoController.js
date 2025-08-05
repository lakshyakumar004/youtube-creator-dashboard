// controllers/videoController.js
const Video = require('../models/Video');
const User = require('../models/User');

const assignEditorToVideo = async (req, res) => {
  const { videoId } = req.params;
  const { editorId } = req.body;

  try {
    // Make sure editor exists
    const editor = await User.findById(editorId);
    if (!editor || editor.role !== 'editor') {
      return res.status(404).json({ message: 'Editor not found' });
    }

    // Only creator who uploaded it can assign
    const video = await Video.findById(videoId);
    if (!video || video.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Avoid duplicates
    if (!video.assignedEditors.includes(editorId)) {
      video.assignedEditors.push(editorId);
      await video.save();
    }

    res.json({ message: 'Editor assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
