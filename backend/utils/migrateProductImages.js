const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const {
  uploadToGlobalStorage,
  uploadUrlToGlobalStorage,
  isCloudinaryConfigured,
  isCloudinaryUrl
} = require('./mediaStorage');

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;

const resolveLocalPath = (imageRef) => {
  if (!imageRef) return null;
  const normalized = imageRef.startsWith('/') ? imageRef.slice(1) : imageRef;
  if (!normalized.startsWith('uploads/')) return null;
  return path.join(__dirname, '..', normalized);
};

const persistImageRef = async (imageRef) => {
  if (!imageRef) return null;
  if (isCloudinaryUrl(imageRef)) return imageRef.split('?')[0];

  const localPath = resolveLocalPath(imageRef);
  if (localPath && fs.existsSync(localPath)) {
    const cloudUrl = await uploadToGlobalStorage(localPath, { folder: 'enimegebi/products' });
    if (cloudUrl) return cloudUrl;
  }

  const backendUrl = process.env.BACKEND_URL || '';
  if (imageRef.startsWith('/uploads') && backendUrl) {
    const remoteUrl = `${backendUrl}${imageRef}`;
    return uploadUrlToGlobalStorage(remoteUrl, { folder: 'enimegebi/products' });
  }

  if (imageRef.startsWith('http')) {
    return uploadUrlToGlobalStorage(imageRef, { folder: 'enimegebi/products' });
  }

  return null;
};

const migrateProductImages = async () => {
  if (!isCloudinaryConfigured) {
    console.warn(
      isProduction
        ? 'WARNING: Cloudinary is NOT configured on production. Images will disappear after server restart!'
        : 'Cloudinary not configured. Using local uploads in development only.'
    );
    return { migrated: 0, skipped: 0, failed: 0 };
  }

  const products = await Product.find({
    $or: [
      { image: { $regex: /^\/uploads\// } },
      { imageUrl: { $regex: /^\/uploads\// } },
      { images: { $regex: /^\/uploads\// } }
    ]
  });

  let migrated = 0;
  let failed = 0;

  for (const product of products) {
    const sources = new Set();
    if (product.image) sources.add(product.image);
    if (product.imageUrl) sources.add(product.imageUrl);
    (product.images || []).forEach((img) => sources.add(img));

    const fixed = [];
    for (const img of sources) {
      if (isCloudinaryUrl(img)) {
        fixed.push(img.split('?')[0]);
        continue;
      }
      const stored = await persistImageRef(img);
      if (stored) fixed.push(stored);
    }

    const unique = [...new Set(fixed)];
    if (unique.length === 0) {
      failed += 1;
      console.warn(`Could not migrate images for product ${product._id} - re-upload required`);
      continue;
    }

    product.images = unique;
    product.image = unique[0];
    product.imageUrl = unique[0];
    await product.save();
    migrated += 1;
  }

  if (migrated > 0) {
    console.log(`Migrated ${migrated} product(s) to permanent Cloudinary storage`);
  }
  if (failed > 0) {
    console.warn(`${failed} product(s) still have missing images - edit and re-upload in admin`);
  }

  return { migrated, failed, total: products.length };
};

module.exports = { migrateProductImages, persistImageRef };
