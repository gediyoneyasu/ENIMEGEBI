const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAm: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' },
  descriptionAm: { type: String, default: '' },
  // Single image fields (backward compatibility)
  image: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  // Multiple images support
  images: { type: [String], default: [] },
  unit: { type: String, enum: ['kg', 'liter', 'piece'], default: 'kg' },
  seller: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);