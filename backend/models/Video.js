const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  originalName: { type: String },
  status: {
    type: String,
    enum: ['pending', 'edited', 'approved'],
    default: 'pending',
  },
  uploadedAt: { type: Date, default: Date.now },
  assignedEditors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Video', videoSchema);
