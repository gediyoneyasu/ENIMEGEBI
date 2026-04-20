const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'enimegeb',
  api_key: '515252789124868',
  api_secret: 'YN9k3wUZEk832-aHAs11w9kBfRc'
});

// Create storage for products
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'enimegebi/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
