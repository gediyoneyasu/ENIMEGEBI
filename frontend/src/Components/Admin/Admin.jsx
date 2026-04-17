import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Products from './Products';
import Orders from './Orders';
import Farmers from './Farmers';
import ContactMessages from './ContactMessages';
import SystemSettings from './SystemSettings';

const Admin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const userData = localStorage.getItem('enimegebiUser');
    
    if (!token || !userData) {
      navigate('/admin-login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/admin-login');
    } else {
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('enimegebiToken');
    localStorage.removeItem('enimegebiUser');
    navigate('/admin-login');
  };

  if (!user) return <div>Loading...</div>;

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: '📊' },
    { path: '/admin/users', name: 'Users', icon: '👥' },
    { path: '/admin/products', name: 'Products', icon: '📦' },
    { path: '/admin/orders', name: 'Orders', icon: '🛒' },
    { path: '/admin/farmers', name: 'Farmers', icon: '🌾' },
    { path: '/admin/messages', name: 'Messages', icon: '📧' },
    { path: '/admin/settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1a1a2e', color: 'white', padding: '20px' }}>
        <h2>Enimegebi Admin</h2>
        <hr style={{ borderColor: '#333' }} />
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', marginBottom: '5px', background: location.pathname === item.path ? '#ff9800' : 'transparent', borderRadius: '5px' }}>
            {item.icon} {item.name}
          </Link>
        ))}
        <button onClick={handleLogout} style={{ marginTop: '50px', width: '100%', padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/messages" element={<ContactMessages />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
