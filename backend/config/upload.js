const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { upload: cloudinaryUpload } = require('./cloudinary');

// Create local upload directories as fallback
const uploadDirs = ['uploads', 'uploads/sliders', 'uploads/testimonials', 'uploads/avatars', 'uploads/products', 'uploads/team'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Local storage (fallback)
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
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Use Cloudinary for production, local for development
const useCloudinary = process.env.NODE_ENV === 'production';

const uploadSlider = useCloudinary ? cloudinaryUpload : multer({ storage: createStorage('sliders'), fileFilter });
const uploadTestimonial = useCloudinary ? cloudinaryUpload : multer({ storage: createStorage('testimonials'), fileFilter });
const uploadAvatar = useCloudinary ? cloudinaryUpload : multer({ storage: createStorage('avatars'), fileFilter });
const uploadProduct = useCloudinary ? cloudinaryUpload : multer({ storage: createStorage('products'), fileFilter });
const uploadTeam = useCloudinary ? cloudinaryUpload : multer({ storage: createStorage('team'), fileFilter });

module.exports = {
  uploadSlider,
  uploadTestimonial,
  uploadAvatar,
  uploadProduct,
  uploadTeam,
  upload: multer({ storage: createStorage('general'), fileFilter })
};
