import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:5001';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('enimegebiToken');
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch users count
      let usersCount = 0;
      try {
        const usersRes = await axios.get(`${API_URL}/api/users/admin/all`, { headers });
        if (usersRes.data.success && usersRes.data.users) {
          usersCount = usersRes.data.users.length;
        }
      } catch (err) {
        console.log('Users API error:', err.message);
      }

      // Fetch products count
      let productsCount = 0;
      try {
        const productsRes = await axios.get(`${API_URL}/api/admin/public-products`);
        if (Array.isArray(productsRes.data)) {
          productsCount = productsRes.data.length;
        } else if (productsRes.data && productsRes.data.products) {
          productsCount = productsRes.data.products.length;
        }
      } catch (err) {
        console.log('Products API error:', err.message);
      }

      // Fetch orders
      let ordersCount = 0;
      let totalRevenue = 0;
      try {
        const ordersRes = await axios.get(`${API_URL}/api/orders`, { headers });
        if (ordersRes.data.success && ordersRes.data.orders) {
          ordersCount = ordersRes.data.orders.length;
          totalRevenue = ordersRes.data.orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
        }
      } catch (err) {
        console.log('Orders API not available');
      }

      // Fetch messages count
      let messagesCount = 0;
      let unreadCount = 0;
      try {
        const messagesRes = await axios.get(`${API_URL}/api/contact/messages`, { headers });
        if (messagesRes.data.success && messagesRes.data.messages) {
          messagesCount = messagesRes.data.messages.length;
          unreadCount = messagesRes.data.messages.filter(m => m.status === 'unread').length;
        }
      } catch (err) {
        console.log('Messages API error:', err.message);
      }

      setStats({
        totalUsers: usersCount,
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalRevenue: totalRevenue,
        totalMessages: messagesCount,
        unreadMessages: unreadCount
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <i className="ri-dashboard-line"></i>
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-actions">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <i className="ri-refresh-line"></i> Refresh
          </button>
          {lastUpdated && <span className="last-updated">Updated: {lastUpdated}</span>}
        </div>
      </div>
      
      <p className="dashboard-welcome">Welcome to E-MARKATO Admin Dashboard</p>
      
      {error && (
        <div className="dashboard-error">
          <span>{error}</span>
          <button className="retry-btn" onClick={fetchDashboardData}>Retry</button>
        </div>
      )}
      
      <div className="stats-grid">
        {/* Users Card */}
        <div className="stat-card users">
          <div className="stat-icon">
            <i className="ri-user-line"></i>
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-label">Registered users</span>
          </div>
        </div>
        
        {/* Products Card */}
        <div className="stat-card products">
          <div className="stat-icon">
            <i className="ri-shopping-bag-line"></i>
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts.toLocaleString()}</p>
            <span className="stat-label">Active products</span>
          </div>
        </div>
        
        {/* Orders Card */}
        <div className="stat-card orders">
          <div className="stat-icon">
            <i className="ri-shopping-cart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
            <span className="stat-label">Completed orders</span>
          </div>
        </div>
        
        {/* Revenue Card */}
        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">ETB {stats.totalRevenue.toLocaleString()}</p>
            <span className="stat-label">Lifetime sales</span>
          </div>
        </div>
        
        {/* Messages Card - NEW */}
        <div className="stat-card messages">
          <div className="stat-icon">
            <i className="ri-mail-line"></i>
          </div>
          <div className="stat-info">
            <h3>Contact Messages</h3>
            <p className="stat-number">{stats.totalMessages.toLocaleString()}</p>
            <span className="stat-label">
              {stats.unreadMessages > 0 && (
                <span className="unread-badge">{stats.unreadMessages} unread</span>
              )}
              {stats.unreadMessages === 0 && 'All messages read'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        <h3><i className="ri-rocket-line"></i> Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <i className="ri-add-line"></i>
            <span>Add Product</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <i className="ri-eye-line"></i>
            <span>View Orders</span>
          </Link>
          <Link to="/admin/users" className="action-card">
            <i className="ri-user-add-line"></i>
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/messages" className="action-card">
            <i className="ri-mail-line"></i>
            <span>View Messages</span>
          </Link>
          <button className="action-card" onClick={fetchDashboardData}>
            <i className="ri-refresh-line"></i>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
      
      {/* System Status */}
      <div className="recent-section">
        <h3><i className="ri-history-line"></i> System Status</h3>
        <div className="status-grid">
          <div className="status-item success">
            <i className="ri-checkbox-circle-line"></i>
            <div>
              <strong>Backend Connection</strong>
              <p>Connected to {API_URL}</p>
            </div>
          </div>
          <div className="status-item info">
            <i className="ri-database-line"></i>
            <div>
              <strong>Database Status</strong>
              <p>{stats.totalUsers} users, {stats.totalProducts} products</p>
            </div>
          </div>
          <div className="status-item warning">
            <i className="ri-mail-line"></i>
            <div>
              <strong>Contact Messages</strong>
              <p>{stats.totalMessages} total, {stats.unreadMessages} unread</p>
            </div>
          </div>
          <div className="status-item success">
            <i className="ri-shield-check-line"></i>
            <div>
              <strong>Admin Session</strong>
              <p>Logged in and active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
