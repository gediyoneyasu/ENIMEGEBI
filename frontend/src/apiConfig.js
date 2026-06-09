// API Configuration
// Change this to your backend URL
const getApiUrl = () => {
  // Use local backend if running locally
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5001';
  }
  // Use production backend
  return 'https://enimegebi-backend.onrender.com';
};

export const API_URL = getApiUrl();

console.log('API URL:', API_URL);
