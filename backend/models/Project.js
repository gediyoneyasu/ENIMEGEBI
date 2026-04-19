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
    required: true
  },
  descriptionAm: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    default: 'general'
  },
  status: {
    type: String,
    enum: ['locked', 'available', 'completed'],
    default: 'locked'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  paidBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    paidAt: Date
  }],
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
