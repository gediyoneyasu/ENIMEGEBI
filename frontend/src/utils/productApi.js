import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://enimegebi-backend.onrender.com';
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_PREFIX = 'ae_v2_';

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.time > CACHE_TTL) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ time: Date.now(), data }));
  } catch {
    /* ignore quota errors */
  }
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.products && Array.isArray(data.products)) return data.products;
  return [];
};

const categoryMatches = (productCategory, filterCategory) => {
  if (!filterCategory || filterCategory === 'all') return true;
  const pc = String(productCategory || '').toUpperCase().trim();
  const fc = String(filterCategory).toUpperCase().trim();
  return pc === fc || pc.includes(fc) || fc.includes(pc);
};

const filterProductsClient = (products, params = {}) => {
  let list = products.filter((p) => p && (p.status === 'active' || !p.status));

  if (params.category && params.category !== 'all') {
    list = list.filter((p) => categoryMatches(p.category, params.category));
  }

  if (params.search) {
    const q = String(params.search).toLowerCase();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.nameAm?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
    list = list.filter((p) => (p.price || 0) >= Number(params.minPrice));
  }
  if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
    list = list.filter((p) => (p.price || 0) <= Number(params.maxPrice));
  }

  if (params.sort === 'price_asc') {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (params.sort === 'price_desc') {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return list;
};

const paginateProducts = (products, params = {}) => {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 20);
  const filtered = filterProductsClient(products, params);
  const total = filtered.length;

  return {
    products: filtered.slice((page - 1) * limit, page * limit),
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1
  };
};

const buildHomeData = (products) => {
  const active = products.filter((p) => p && (p.status === 'active' || !p.status));
  const categoryMap = new Map();

  active.forEach((product) => {
    if (!product.category) return;
    const key = product.category.toUpperCase();
    categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
  });

  return {
    flashDeals: active.slice(0, 8),
    bestSellers: active.slice(0, 10),
    featured: active.slice(0, 12),
    categories: Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .slice(0, 8),
    totalProducts: active.length
  };
};

export const fetchAllProducts = async () => {
  const cacheKey = 'ae_all_products';
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${API_URL}/api/admin/public-products`);
  const products = normalizeList(data);
  writeCache(cacheKey, products);
  return products;
};

export const fetchHomeData = async () => {
  const cacheKey = 'ae_home_data';
  const cached = readCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${API_URL}/api/admin/home-data`);
    writeCache(cacheKey, data);
    return data;
  } catch {
    const products = await fetchAllProducts();
    const homeData = buildHomeData(products);
    writeCache(cacheKey, homeData);
    return homeData;
  }
};

export const fetchProductsPage = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'category' && value === 'all') return;
    if (key === 'sort' && value === 'match') return;
    query.set(key, value);
  });

  const cacheKey = `ae_products_${query.toString() || 'all'}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(
    `${API_URL}/api/admin/public-products${query.toString() ? `?${query.toString()}` : ''}`
  );

  let result;
  if (Array.isArray(data)) {
    result = paginateProducts(data, params);
  } else if (data?.products) {
    result = data;
  } else {
    result = { products: [], total: 0, page: 1, totalPages: 1 };
  }

  writeCache(cacheKey, result);
  return result;
};

export const fetchProductById = async (id) => {
  if (!id) return { product: null, related: [] };

  const cacheKey = `product_${id}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${API_URL}/api/admin/public-products/${id}`);
    if (data?.product) {
      writeCache(cacheKey, data);
      return data;
    }
  } catch {
    /* try fallbacks */
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/products/${id}`);
    if (data && data._id) {
      const products = await fetchAllProducts();
      const related = products
        .filter((p) => p.category === data.category && p._id !== id)
        .slice(0, 6);
      const result = { product: data, related };
      writeCache(cacheKey, result);
      return result;
    }
  } catch {
    /* try list fallback */
  }

  const products = await fetchAllProducts();
  const product = products.find((p) => p._id === id) || null;
  const result = {
    product,
    related: product
      ? products.filter((p) => p.category === product.category && p._id !== id).slice(0, 6)
      : []
  };
  writeCache(cacheKey, result);
  return result;
};

export const invalidateProductCache = () => {
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith(CACHE_PREFIX) || key.startsWith('ae_')) sessionStorage.removeItem(key);
  });
};
