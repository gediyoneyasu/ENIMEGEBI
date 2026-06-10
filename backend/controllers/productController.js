const Product = require('../models/Product');
const getImageUrl = require('../utils/imageHelper');
const {
  uploadToGlobalStorage,
  uploadUrlToGlobalStorage,
  deleteFromGlobalStorage,
  isCloudinaryConfigured,
  isProduction
} = require('../utils/mediaStorage');
const { persistImageRef } = require('../utils/migrateProductImages');

const formatProduct = (product) => {
  if (!product) return null;
  const p = product._doc || product;
  const rawImages =
    p.images && p.images.length > 0
      ? p.images
      : [p.image || p.imageUrl].filter(Boolean);

  const images = rawImages.map((img) => getImageUrl(img)).filter(Boolean);
  const primary = images[0] || getImageUrl(p.imageUrl || p.image) || '';

  return {
    ...p,
    images,
    imageUrl: primary,
    image: primary
  };
};

const collectImageSources = (product) => {
  const sources = new Set();
  if (product.image) sources.add(product.image);
  if (product.imageUrl) sources.add(product.imageUrl);
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => sources.add(img));
  }
  return [...sources];
};

const normalizeImageRef = (url) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) return url.split('?')[0];
  const match = String(url).match(/\/uploads\/[^?#]+/);
  return match ? match[0] : url.split('?')[0];
};

const imagesMatch = (a, b) => normalizeImageRef(a) === normalizeImageRef(b);

const dedupeImages = (images) => {
  const result = [];
  for (const img of images) {
    if (!img) continue;
    if (!result.some((existing) => imagesMatch(existing, img))) {
      result.push(img);
    }
  }
  return result;
};

const canonicalizeImageRef = (url) => {
  if (!url) return null;
  if (url.includes('res.cloudinary.com')) return url.split('?')[0];
  const match = String(url).match(/\/uploads\/[^?#]+/);
  if (match) return match[0];
  if (url.startsWith('/uploads')) return url.split('?')[0];
  return url.split('?')[0];
};

const normalizeStoredImages = (images) =>
  dedupeImages(images.map(canonicalizeImageRef).filter(Boolean));

const normalizeBodyImageUrls = (body) => {
  if (!body.imageUrls) return [];
  return Array.isArray(body.imageUrls) ? body.imageUrls : [body.imageUrls];
};

const processUploadedFiles = async (files = []) => {
  const urls = [];

  for (const file of files) {
    const cloudUrl = await uploadToGlobalStorage(file.path, { folder: 'enimegebi/products' });

    if (cloudUrl) {
      urls.push(cloudUrl);
      continue;
    }

    if (isProduction()) {
      throw new Error(
        'Permanent image storage failed. Add Cloudinary env vars on Render: ENIMEGEBI_IMG_CLOUD_NAME, ENIMEGEBI_IMG_API_KEY, ENIMEGEBI_IMG_API_SECRET'
      );
    }

    const normalized = file.path.replace(/\\/g, '/');
    const uploadIndex = normalized.indexOf('/uploads/');
    if (uploadIndex !== -1) urls.push(normalized.slice(uploadIndex));
    else urls.push(`/uploads/products/${file.filename}`);
  }

  return urls;
};

const processExternalUrls = async (urls = []) => {
  const stored = [];

  for (const url of urls) {
    if (!url || !url.startsWith('http')) continue;
    const permanentUrl = await uploadUrlToGlobalStorage(url, { folder: 'enimegebi/products' });
    if (permanentUrl) stored.push(permanentUrl);
  }

  return stored;
};

const deleteRemovedImages = async (oldImages, newImages) => {
  for (const img of oldImages) {
    const stillUsed = newImages.some((next) => imagesMatch(img, next));
    if (!stillUsed) {
      await deleteFromGlobalStorage(img);
    }
  }
};

const deleteAllProductImages = async (product) => {
  const images = collectImageSources(product);
  for (const img of images) {
    await deleteFromGlobalStorage(img);
  }
};

const test = (req, res) => {
  res.json({ message: 'Product controller works!', cloudinary: isCloudinaryConfigured });
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products.map(formatProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productListFields =
  'name nameAm category price stock image imageUrl images unit seller status createdAt rating description';

const buildPublicFilter = (query) => {
  const filter = { status: 'active' };
  const { category, search, minPrice, maxPrice } = query;

  if (category && category !== 'all') {
    const escaped = String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.category = { $regex: new RegExp(`^${escaped}$`, 'i') };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { nameAm: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return filter;
};

const getSortOption = (sort) => {
  if (sort === 'price_asc') return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  return { createdAt: -1 };
};

const getPublicProducts = async (req, res) => {
  try {
    const { page, limit, category, search, sort, minPrice, maxPrice } = req.query;
    const isPaginated = Boolean(page || limit || category || search || minPrice || maxPrice || sort);

    if (!isPaginated) {
      const products = await Product.find({ status: 'active' })
        .select(productListFields)
        .sort({ createdAt: -1 })
        .lean();
      return res.json(products.map(formatProduct));
    }

    const filter = buildPublicFilter(req.query);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(40, Math.max(1, parseInt(limit, 10) || 20));
    const sortOption = getSortOption(sort);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(productListFields)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      products: products.map(formatProduct),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHomeData = async (req, res) => {
  try {
    const [products, totalProducts] = await Promise.all([
      Product.find({ status: 'active' })
        .select(productListFields)
        .sort({ createdAt: -1 })
        .limit(24)
        .lean(),
      Product.countDocuments({ status: 'active' })
    ]);

    const formatted = products.map(formatProduct);
    const categoryMap = new Map();

    products.forEach((product) => {
      if (!product.category) return;
      const key = product.category.toUpperCase();
      categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
    });

    res.json({
      flashDeals: formatted.slice(0, 8),
      bestSellers: formatted.slice(4, 14),
      featured: formatted.slice(0, 12),
      categories: Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .slice(0, 8),
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: 'active' }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      status: 'active',
      _id: { $ne: product._id }
    })
      .select('name nameAm category price stock image imageUrl images unit seller status createdAt rating')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      product: formatProduct(product),
      related: related.map(formatProduct)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    let productData;
    if (req.body.product) {
      productData = JSON.parse(req.body.product);
    } else {
      productData = req.body;
    }

    const fileImages = await processUploadedFiles(req.files || []);
    const urlImages = await processExternalUrls(normalizeBodyImageUrls(req.body));
    const allImages = normalizeStoredImages([...fileImages, ...urlImages]);

    if (allImages.length === 0) {
      return res.status(400).json({ error: 'At least one product image is required' });
    }

    const product = new Product({
      name: productData.name,
      nameAm: productData.nameAm || '',
      category: productData.category,
      price: Number(productData.price),
      stock: Number(productData.stock) || 0,
      description: productData.description || '',
      descriptionAm: productData.descriptionAm || '',
      unit: productData.unit || 'kg',
      seller: productData.seller || '',
      sellerAm: productData.sellerAm || '',
      status: productData.status || 'active',
      images: allImages,
      imageUrl: allImages[0],
      image: allImages[0]
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, product: formatProduct(savedProduct) });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let productData;
    if (req.body.product) {
      productData = JSON.parse(req.body.product);
    } else {
      productData = req.body;
    }

    const oldImages = collectImageSources(product);
    let finalImages = Array.isArray(productData.existingImages) ? [...productData.existingImages] : oldImages;

    const fileImages = await processUploadedFiles(req.files || []);
    const urlImages = await processExternalUrls(normalizeBodyImageUrls(req.body));
    finalImages = normalizeStoredImages([...finalImages, ...fileImages, ...urlImages]);

    if (finalImages.length === 0) {
      return res.status(400).json({ error: 'At least one product image is required' });
    }

    await deleteRemovedImages(oldImages, finalImages);

    product.name = productData.name;
    product.nameAm = productData.nameAm || '';
    product.category = productData.category;
    product.price = Number(productData.price);
    product.stock = Number(productData.stock);
    product.description = productData.description || '';
    product.descriptionAm = productData.descriptionAm || '';
    product.unit = productData.unit || 'kg';
    product.seller = productData.seller || '';
    product.sellerAm = productData.sellerAm || '';
    product.status = productData.status || 'active';
    product.images = finalImages;
    product.imageUrl = finalImages[0];
    product.image = finalImages[0];

    await product.save();
    res.json({ success: true, product: formatProduct(product) });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

const repairProductImages = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        error: 'Cloudinary not configured. Add ENIMEGEBI_IMG_CLOUD_NAME, ENIMEGEBI_IMG_API_KEY, ENIMEGEBI_IMG_API_SECRET to Render.'
      });
    }

    const products = await Product.find({});
    let repaired = 0;
    let failed = 0;

    for (const product of products) {
      const sources = collectImageSources(product);
      const fixedImages = [];

      for (const img of sources) {
        if (!img) continue;
        if (img.includes('res.cloudinary.com')) {
          fixedImages.push(canonicalizeImageRef(img));
          continue;
        }

        const stored = await persistImageRef(img);
        if (stored) fixedImages.push(canonicalizeImageRef(stored));
      }

      const normalized = normalizeStoredImages(fixedImages);
      if (normalized.length === 0) {
        failed += 1;
        continue;
      }

      const changed =
        normalized.length !== sources.length ||
        normalized.some((img, i) => !imagesMatch(img, sources[i]));

      if (changed) {
        product.images = normalized;
        product.image = normalized[0];
        product.imageUrl = normalized[0];
        await product.save();
        repaired += 1;
      }
    }

    res.json({ success: true, repaired, failed, cloudinary: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await deleteAllProductImages(product);
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  test,
  getProducts,
  getPublicProducts,
  getHomeData,
  getPublicProductById,
  createProduct,
  updateProduct,
  repairProductImages,
  deleteProduct
};
