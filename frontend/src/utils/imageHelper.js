const API_URL = 'https://enimegebi-backend.onrender.com';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full HTTPS URL
  if (imagePath.startsWith('https://')) return imagePath;
  
  // Skip localhost images (they won't work in production)
  if (imagePath.includes('localhost')) return null;
  
  // If it's a relative path, add the API URL
  if (imagePath.startsWith('/uploads')) {
    return `${API_URL}${imagePath}`;
  }
  
  // If it's just a filename
  if (!imagePath.startsWith('http')) {
    return `${API_URL}/uploads/${imagePath}`;
  }
  
  return null;
};

export default getImageUrl;
