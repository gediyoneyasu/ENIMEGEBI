import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalFarmers: 0,
    pendingOrders: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#667eea' },
    { title: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#48c774' },
    { title: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: '#ff9800' },
    { title: 'Revenue', value: `$${stats.totalRevenue}`, icon: '💰', color: '#ff5722' },
    { title: 'Farmers', value: stats.totalFarmers, icon: '🌾', color: '#4caf50' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#f44336' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: '📧', color: '#2196f3' },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {statCards.map((stat, index) => (
          <div key={index} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderTop: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '30px' }}>{stat.icon}</div>
            <h3>{stat.title}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0' }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
