export function getProductName(product, language) {
  if (!product) return '';
  if (language === 'am' && product.nameAm) return product.nameAm;
  return product.name || '';
}

export function getProductDescription(product, language, fallback = '') {
  if (!product) return fallback;
  if (language === 'am' && product.descriptionAm) return product.descriptionAm;
  if (product.description) return product.description;
  return fallback;
}
