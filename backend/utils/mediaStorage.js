const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.ENIMEGEBI_IMG_CLOUD_NAME ||
  process.env.ENIMEGEBI_IMG;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.ENIMEGEBI_IMG_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.ENIMEGEBI_IMG_API_SECRET;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

const uploadToGlobalStorage = async (localFilePath, options = {}) => {
  if (!localFilePath) return null;

  if (!isCloudinaryConfigured) {
    return null;
  }

  const uploadOptions = {
    folder: options.folder || 'enimegebi',
    resource_type: options.resourceType || 'auto'
  };

  const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);

  try {
    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.warn('Failed to remove local file after upload:', error.message);
  }

  return result.secure_url;
};

module.exports = {
  uploadToGlobalStorage,
  isCloudinaryConfigured
};
