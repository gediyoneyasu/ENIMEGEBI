import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('Using API_URL:', API_URL);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const url = isLogin 
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;
      
      const dataToSend = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      console.log('Sending request to:', url);
      
      const response = await axios.post(url, dataToSend);
      
      console.log('Response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('enimegebiToken', response.data.token);
        localStorage.setItem('enimegebiUser', JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
        
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      role: 'user'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          {isLogin ? 'Login to your account' : 'Register to get started'}
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            </>
          )}
          
          <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} required />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        <p onClick={toggleMode}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
