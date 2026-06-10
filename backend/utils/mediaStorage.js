const fs = require('fs');
const path = require('path');
const axios = require('axios');
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

const TEMP_DIR = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const isCloudinaryUrl = (url) =>
  Boolean(url && typeof url === 'string' && url.includes('res.cloudinary.com'));

const getCloudinaryPublicId = (url) => {
  if (!isCloudinaryUrl(url)) return null;
  const afterUpload = url.split('/upload/')[1];
  if (!afterUpload) return null;
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  return withoutVersion.replace(/\.[^/.]+$/, '');
};

const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn('Failed to remove file:', error.message);
  }
};

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
  safeUnlink(localFilePath);
  return result.secure_url;
};

const downloadImageToTemp = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'image/*,*/*'
    },
    maxRedirects: 5
  });

  const contentType = response.headers['content-type'] || 'image/jpeg';
  const ext = contentType.includes('png')
    ? '.png'
    : contentType.includes('webp')
      ? '.webp'
      : contentType.includes('gif')
        ? '.gif'
        : '.jpg';

  const filename = `url-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, response.data);
  return filepath;
};

const uploadUrlToGlobalStorage = async (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.startsWith('http')) return null;
  if (isCloudinaryUrl(imageUrl)) return imageUrl;

  const backendHost = process.env.BACKEND_URL || '';
  if (
    imageUrl.includes('/uploads/') &&
    (imageUrl.includes('localhost') || (backendHost && imageUrl.includes(backendHost)))
  ) {
    const match = imageUrl.match(/\/uploads\/[^?#]+/);
    return match ? match[0] : imageUrl;
  }

  try {
    const localPath = await downloadImageToTemp(imageUrl);
    const cloudUrl = await uploadToGlobalStorage(localPath, options);
    safeUnlink(localPath);
    return cloudUrl;
  } catch (error) {
    console.error('Failed to persist URL image:', imageUrl, error.message);
    return null;
  }
};

const deleteFromGlobalStorage = async (url) => {
  if (!url) return;

  if (isCloudinaryUrl(url) && isCloudinaryConfigured) {
    const publicId = getCloudinaryPublicId(url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.warn('Cloudinary delete failed:', error.message);
      }
    }
    return;
  }

  if (url.startsWith('/uploads')) {
    safeUnlink(path.join(__dirname, '..', url));
  }
};

const isProduction = () =>
  process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

module.exports = {
  uploadToGlobalStorage,
  uploadUrlToGlobalStorage,
  deleteFromGlobalStorage,
  isCloudinaryConfigured,
  isCloudinaryUrl,
  isProduction
};
