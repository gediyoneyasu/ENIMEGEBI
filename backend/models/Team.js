const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameAm: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true
  },
  roleAm: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  bioAm: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema);
