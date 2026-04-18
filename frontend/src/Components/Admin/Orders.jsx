import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>Order Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Order ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Customer</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{order.orderReference}</td>
              <td style={{ padding: '10px' }}>{order.userName}</td>
              <td style={{ padding: '10px' }}>${order.totalAmount}</td>
              <td style={{ padding: '10px' }}>{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
