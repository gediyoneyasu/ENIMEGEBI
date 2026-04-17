import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      setMessage('Access denied. Admin only.');
    } else {
      setMessage('Welcome to Admin Panel');
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>
      <p>{message}</p>
      <div>
        <h2>Dashboard</h2>
        <ul>
          <li>Manage Users</li>
          <li>View Reports</li>
          <li>System Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;