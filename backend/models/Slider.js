const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleAm: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  subtitleAm: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonTextAm: {
    type: String,
    default: 'አሁን ይግዙ'
  },
  image: {
    type: String,
    default: ''
  },
  imageUrl: {
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

module.exports = mongoose.model('Slider', sliderSchema);
