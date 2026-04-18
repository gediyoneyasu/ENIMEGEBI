const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDirs = ['uploads', 'uploads/sliders', 'uploads/testimonials', 'uploads/avatars', 'uploads/products', 'uploads/team'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for different types
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folder}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Different upload handlers for different purposes
const uploadSlider = multer({
  storage: createStorage('sliders'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadTestimonial = multer({
  storage: createStorage('testimonials'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadProduct = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadTeam = multer({
  storage: createStorage('team'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = {
  uploadSlider,
  uploadTestimonial,
  uploadAvatar,
  uploadProduct,
  uploadTeam,
  upload: multer({ storage: createStorage('general'), fileFilter: fileFilter })
};
