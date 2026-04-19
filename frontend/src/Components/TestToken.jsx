import React, { useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://enimegebi-backend.onrender.com';

const TestToken = () => {
  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    console.log('Current token:', token);
    
    const testAPI = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API response:', response.data);
      } catch (error) {
        console.error('API error:', error.response?.status, error.response?.data);
      }
    };
    
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Token Test Page</h2>
      <p>Open console (F12) to see results</p>
      <button onClick={() => {
        localStorage.removeItem('enimegebiToken');
        localStorage.removeItem('enimegebiUser');
        window.location.href = '/auth';
      }}>Logout</button>
    </div>
  );
};

export default TestToken;
