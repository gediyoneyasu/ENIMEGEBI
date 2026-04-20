import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://enimegebi-backend.onrender.com';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    axios.get(`${API_URL}/api/test`)
      .then(res => setStatus('✅ Backend Connected: ' + res.data.message))
      .catch(err => setStatus('❌ Backend Error: ' + err.message));
  }, []);

  return <div style={{ padding: '20px', textAlign: 'center' }}>{status}</div>;
};

export default TestConnection;
