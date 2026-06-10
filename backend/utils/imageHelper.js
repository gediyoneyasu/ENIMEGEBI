const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
  if (imagePath.startsWith('/uploads')) return `${backendUrl}${imagePath}`;
  return `${backendUrl}/uploads/${imagePath}`;
};

module.exports = getImageUrl;
