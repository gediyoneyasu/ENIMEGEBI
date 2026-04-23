const API_URL = 'https://enimegebi-backend.onrender.com';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a local path from uploads
  if (imagePath.startsWith('/uploads')) {
    return `${API_URL}${imagePath}`;
  }
  
  return imagePath;
};

export default getImageUrl;
