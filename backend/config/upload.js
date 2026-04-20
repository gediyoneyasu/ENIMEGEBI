const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories
const dirs = ['uploads', 'uploads/products', 'uploads/sliders', 'uploads/testimonials', 'uploads/avatars', 'uploads/team', 'uploads/projects'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage for different types
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDF, and video files are allowed'));
  }
};

const uploadProduct = multer({ storage: createStorage('products'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadSlider = multer({ storage: createStorage('sliders'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadTestimonial = multer({ storage: createStorage('testimonials'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: createStorage('avatars'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadTeam = multer({ storage: createStorage('team'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProject = multer({ storage: createStorage('projects'), fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

module.exports = { uploadProduct, uploadSlider, uploadTestimonial, uploadAvatar, uploadTeam, uploadProject };
