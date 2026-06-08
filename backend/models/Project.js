const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAm: { type: String },
  description: { type: String },
  descriptionAm: { type: String },
  image: { type: String },
  imageUrl: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Use the correct model name - NOT 'Product'
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);