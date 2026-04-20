const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories
const dirs = ['uploads', 'uploads/products', 'uploads/sliders', 'uploads/testimonials', 'uploads/avatars', 'uploads/team'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = (folder) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const uploadProduct = multer({ storage: storage('products'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadSlider = multer({ storage: storage('sliders'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadTestimonial = multer({ storage: storage('testimonials'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: storage('avatars'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadTeam = multer({ storage: storage('team'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadProduct, uploadSlider, uploadTestimonial, uploadAvatar, uploadTeam };
