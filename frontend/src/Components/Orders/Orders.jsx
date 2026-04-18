import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {error && <div className="error-message">{error}</div>}
      {orders.length === 0 ? (
        <div className="no-orders">
          <i className="ri-shopping-bag-line"></i>
          <h2>No orders yet</h2>
          <Link to="/products" className="start-shopping-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-ref">{order.orderReference}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-status">{order.orderStatus}</span>
              </div>
              <div className="order-total">Total: ${order.totalAmount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
