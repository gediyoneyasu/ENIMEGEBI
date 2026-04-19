const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleAm: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  descriptionAm: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  // Content options
  contentType: {
    type: String,
    enum: ['image', 'pdf', 'video', 'youtube', 'link'],
    default: 'image'
  },
  contentUrl: {
    type: String,
    default: ''
  },
  youtubeId: {
    type: String,
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked'],
    default: 'locked'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  purchasedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    purchasedAt: Date,
    isUnlocked: { type: Boolean, default: false },
    approvedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
