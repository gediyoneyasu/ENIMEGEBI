const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith('http')) return imagePath;

  if (imagePath.startsWith('/uploads')) {
    const backendUrl = process.env.BACKEND_URL || 'https://enimegebi-backend.onrender.com';
    return `${backendUrl}${imagePath}`;
  }

  return imagePath;
};

module.exports = getImageUrl;
