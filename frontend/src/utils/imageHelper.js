const API_URL = import.meta.env.VITE_API_URL || 'https://enimegebi-backend.onrender.com';

export const getImageUrl = (imagePath, placeholder = null) => {
  if (!imagePath) return placeholder;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
  return `${API_URL}/uploads/${imagePath}`;
};

export const getProductImages = (product, placeholder = null) => {
  if (!product) return placeholder ? [placeholder] : [];

  const seen = new Set();
  const images = [];

  const add = (path) => {
    const url = getImageUrl(path);
    if (url && !seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  };

  if (product.images && product.images.length > 0) {
    product.images.forEach(add);
  } else {
    if (product.image) add(product.image);
    else if (product.imageUrl) add(product.imageUrl);
  }

  if (images.length === 0 && placeholder) {
    images.push(placeholder);
  }

  return images;
};

export const getProductImage = (product, placeholder = null) => {
  const images = getProductImages(product);
  return images[0] || placeholder;
};

export default getImageUrl;
