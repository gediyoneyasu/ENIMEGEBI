import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email, password
      });

      if (response.data.token && response.data.role === 'admin') {
        localStorage.setItem('enimegebiToken', response.data.token);
        localStorage.setItem('enimegebiUser', JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
        navigate('/admin');
      } else {
        setError('Access denied. Admin only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-bg">
        <div className="admin-login-overlay"></div>
      </div>
      
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-logo">
            <i className="ri-shield-star-line"></i>
            <h2>Enimegebi Admin</h2>
          </div>
          <p>Secure Access Portal</p>
        </div>

        {error && (
          <div className="admin-error">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-group">
            <i className="ri-mail-line"></i>
            <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <i className="ri-lock-line"></i>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? 'Authenticating...' : 'Admin Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/auth">Back to User Login</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;