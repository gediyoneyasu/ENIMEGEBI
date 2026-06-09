import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const API_URL = 'http://localhost:5001';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@enimegebi.com');
  const [password, setPassword] = useState('enimegebi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Connecting to:', `${API_URL}/api/auth/login`);
      console.log('Email:', email);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      console.log('Response:', response.data);

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
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>E-MARKATO Admin</h2>
        <p>Secure Access Portal</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Admin Login'}
          </button>
        </form>

        <a href="/auth">Back to User Login</a>
        
        <div className="admin-demo">
          <p>Admin Credentials:</p>
          <p>Email: <strong>admin@enimegebi.com</strong></p>
          <p>Password: <strong>enimegebi</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
