const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Create temp directory for uploads
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
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

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload to ImgBB (free image hosting)
const uploadToImgBB = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));
    
    // Free ImgBB API (no key needed for basic upload)
    const response = await axios.post('https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5', formData, {
      headers: formData.getHeaders()
    });
    
    if (response.data && response.data.data) {
      return response.data.data.url;
    }
    return null;
  } catch (error) {
    console.error('ImgBB upload error:', error.message);
    return null;
  }
};

module.exports = { upload, uploadToImgBB };
