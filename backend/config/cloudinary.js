const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for different types
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `enimegebi/${folder}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
  });
};

// Different upload handlers for different purposes
const uploadProduct = multer({ storage: createStorage('products') });
const uploadSlider = multer({ storage: createStorage('sliders') });
const uploadTestimonial = multer({ storage: createStorage('testimonials') });
const uploadAvatar = multer({ storage: createStorage('avatars') });
const uploadTeam = multer({ storage: createStorage('team') });
const uploadProject = multer({ storage: createStorage('projects') });

module.exports = {
  uploadProduct,
  uploadSlider,
  uploadTestimonial,
  uploadAvatar,
  uploadTeam,
  uploadProject,
  cloudinary
};
