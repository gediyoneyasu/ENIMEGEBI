import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to Admin Dashboard!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div style={{ background: '#667eea', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ background: '#48c774', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ background: '#ff9800', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ background: '#f44336', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>Revenue</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>$0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
