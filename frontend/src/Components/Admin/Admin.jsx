import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import './Admin.css';

import Dashboard from './Dashboard';
import Users from './Users';
import Products from './Products';
import Orders from './Orders';
import Farmers from './Farmers';
import ContactMessages from './ContactMessages';
import SystemSettings from './SystemSettings';
import SliderManagement from './HomeControl/SliderManagement';
import TestimonialManagement from './HomeControl/TestimonialManagement';
import HomeSettings from './HomeControl/HomeSettings';
import TeamManagement from './TeamManagement/TeamManagement';
import ContactInfo from './ContactInfo';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('enimegebiToken')}`
  });

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const userData = localStorage.getItem('enimegebiUser');
    
    if (!token || !userData) {
      navigate('/admin-login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/admin-login');
      } else {
        setUser(parsedUser);
      }
    } catch (error) {
      navigate('/admin-login');
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        axios.get(`${API_URL}/api/notifications`, { headers: getHeaders() }),
        axios.get(`${API_URL}/api/notifications/unread-count`, { headers: getHeaders() })
      ]);
      setNotifications(listRes.data.notifications || []);
      setUnreadCount(countRes.data.count || 0);
    } catch (err) {
      console.error('Admin notifications error:', err);
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      try {
        await axios.put(`${API_URL}/api/notifications/${notif._id}/read`, {}, { headers: getHeaders() });
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
    setShowNotifDropdown(false);
    if (notif.link) navigate(notif.link);
  };

  const handleLogout = () => {
    localStorage.removeItem('enimegebiToken');
    localStorage.removeItem('enimegebiUser');
    navigate('/admin-login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) return <div className="admin-loading">Loading Admin Panel...</div>;

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/admin/users', name: 'Users', icon: 'ri-user-settings-line' },
    { path: '/admin/products', name: 'Products', icon: 'ri-shopping-bag-3-line' },
    { path: '/admin/orders', name: 'Orders', icon: 'ri-shopping-cart-2-line' },
    { path: '/admin/farmers', name: 'Farmers', icon: 'ri-plant-line' },
    { path: '/admin/messages', name: 'Messages', icon: 'ri-mail-line' },
    { path: '/admin/sliders', name: 'Home Sliders', icon: 'ri-image-line' },
    { path: '/admin/testimonials', name: 'Testimonials', icon: 'ri-star-line' },
    { path: '/admin/team', name: 'Team Members', icon: 'ri-team-line' },
    { path: '/admin/home-settings', name: 'Home Settings', icon: 'ri-home-settings-line' },
    { path: '/admin/contact', name: 'Contact Info', icon: 'ri-mail-send-line' },
    { path: '/admin/settings', name: 'Settings', icon: 'ri-settings-3-line' },
  ];

  const getPageTitle = (path) => {
    const titles = {
      '/admin': 'Dashboard',
      '/admin/users': 'Users Management',
      '/admin/products': 'Products Management',
      '/admin/orders': 'Orders Management',
      '/admin/farmers': 'Farmers Management',
      '/admin/messages': 'Contact Messages',
      '/admin/sliders': 'Home Sliders',
      '/admin/testimonials': 'Testimonials',
      '/admin/team': 'Team Members',
      '/admin/home-settings': 'Home Settings',
      '/admin/contact': 'Contact Information',
      '/admin/settings': 'System Settings'
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="admin-panel">
      {/* Mobile Menu Overlay */}
      {isMobile && sidebarOpen && (
        <div className="mobile-overlay" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="ri-shield-star-line"></i>
            {sidebarOpen && <span>E-MARKATO Admin</span>}
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
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
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
      
      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          {/* Mobile Menu Button (☰) */}
          {isMobile && !sidebarOpen && (
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <i className="ri-menu-line"></i>
            </button>
          )}
          <h1>{getPageTitle(location.pathname)}</h1>
          <div className="header-actions">
            <div
              className="notifications"
              ref={notifRef}
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            >
              <i className="ri-notification-3-line"></i>
              {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              {showNotifDropdown && (
                <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="notif-dropdown-header">
                    <strong>Notifications</strong>
                    {unreadCount > 0 && (
                      <button onClick={async () => {
                        await axios.put(`${API_URL}/api/notifications/read-all`, {}, { headers: getHeaders() });
                        fetchNotifications();
                      }}>Mark all read</button>
                    )}
                  </div>
                  <div className="notif-dropdown-list">
                    {notifications.length === 0 ? (
                      <p className="notif-dropdown-empty">No notifications</p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n._id}
                          className={`notif-dropdown-item ${n.read ? '' : 'unread'}`}
                          onClick={() => handleNotifClick(n)}
                        >
                          <strong>{n.title}</strong>
                          <span>{n.message}</span>
                          <small>{new Date(n.createdAt).toLocaleString()}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-user">
              <i className="ri-user-line"></i>
              <span>{user.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/messages" element={<ContactMessages />} />
            <Route path="/sliders" element={<SliderManagement />} />
            <Route path="/testimonials" element={<TestimonialManagement />} />
            <Route path="/team" element={<TeamManagement />} />
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
