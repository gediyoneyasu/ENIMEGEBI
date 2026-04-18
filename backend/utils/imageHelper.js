const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a local path and in development
  if (process.env.NODE_ENV !== 'production') {
    return `http://localhost:5001${imagePath}`;
  }
  
  return null;
};

module.exports = getImageUrl;
