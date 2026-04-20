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

// Storage for different types
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const sliderStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/sliders'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const testimonialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/testimonials'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'testimonial-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const teamStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/team'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
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

const uploadProduct = multer({ storage: productStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadSlider = multer({ storage: sliderStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadTestimonial = multer({ storage: testimonialStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadTeam = multer({ storage: teamStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadProduct, uploadSlider, uploadTestimonial, uploadTeam };
