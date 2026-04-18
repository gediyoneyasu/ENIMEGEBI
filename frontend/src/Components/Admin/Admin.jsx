import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import './Admin.css';

// Admin Components
import Dashboard from './Dashboard';
import Users from './Users';
import Products from './Products';
import Orders from './Orders';
import Farmers from './Farmers';
import ContactInfo from './ContactInfo';
import SystemSettings from './SystemSettings';
import SliderManagement from './HomeControl/SliderManagement';
import TestimonialManagement from './HomeControl/TestimonialManagement';
import HomeSettings from './HomeControl/HomeSettings';
import TeamManagement from './TeamManagement/TeamManagement';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const userData = localStorage.getItem('enimegebiUser');
    
    console.log('Admin check - Token:', !!token);
    console.log('Admin check - UserData:', userData);
    
    if (!token || !userData) {
      console.log('No token or user data, redirecting to admin-login');
      navigate('/admin-login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user role:', parsedUser.role);
      
      if (parsedUser.role !== 'admin') {
        console.log('User is not admin, redirecting');
        navigate('/admin-login');
      } else {
        console.log('Admin user verified:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('enimegebiToken');
    localStorage.removeItem('enimegebiUser');
    navigate('/admin-login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) {
    return <div className="admin-loading">Loading Admin Panel...</div>;
  }

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/admin/users', name: 'Users', icon: 'ri-user-settings-line' },
    { path: '/admin/products', name: 'Products', icon: 'ri-shopping-bag-3-line' },
    { path: '/admin/orders', name: 'Orders', icon: 'ri-shopping-cart-2-line' },
    { path: '/admin/farmers', name: 'Farmers', icon: 'ri-plant-line' },
    { path: '/admin/team', name: 'Team Members', icon: 'ri-team-line' },
    { path: '/admin/sliders', name: 'Home Sliders', icon: 'ri-image-line' },
    { path: '/admin/testimonials', name: 'Testimonials', icon: 'ri-star-line' },
    { path: '/admin/home-settings', name: 'Home Settings', icon: 'ri-home-settings-line' },
    { path: '/admin/contact', name: 'Contact', icon: 'ri-mail-send-line' },
    { path: '/admin/settings', name: 'Settings', icon: 'ri-settings-3-line' },
  ];

  const getPageTitle = (path) => {
    const titles = {
      '/admin': 'Dashboard',
      '/admin/users': 'Users Management',
      '/admin/products': 'Products Management',
      '/admin/orders': 'Orders Management',
      '/admin/farmers': 'Farmers Management',
      '/admin/team': 'Team Management',
      '/admin/sliders': 'Home Slider Management',
      '/admin/testimonials': 'Testimonial Management',
      '/admin/home-settings': 'Home Page Settings',
      '/admin/contact': 'Contact Information',
      '/admin/settings': 'System Settings'
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="admin-panel">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="ri-shield-star-line"></i>
            {sidebarOpen && <span>Enimegebi Admin</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`ri-arrow-left-s-line ${!sidebarOpen ? 'rotate' : ''}`}></i>
          </button>
        </div>

        <div className="admin-info">
          <div className="admin-avatar"><i className="ri-admin-line"></i></div>
          {sidebarOpen && (
            <div className="admin-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className="admin-badge">Administrator</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <i className={item.icon}></i>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
          <button onClick={handleLogout} className="nav-item logout-btn">
            <i className="ri-logout-box-line"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <h1>{getPageTitle(location.pathname)}</h1>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/sliders" element={<SliderManagement />} />
            <Route path="/testimonials" element={<TestimonialManagement />} />
            <Route path="/home-settings" element={<HomeSettings />} />
            <Route path="/contact" element={<ContactInfo />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
