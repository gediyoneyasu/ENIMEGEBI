import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import './AdminPages.css';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('enimegebiToken')}`
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/admin/orders`, { headers: getHeaders() });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${orderId}`, { status }, { headers: getHeaders() });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  if (loading) {
    return <div className="admin-page-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2><i className="ri-shopping-cart-2-line"></i> Order Management</h2>
        <button className="admin-btn secondary" onClick={fetchOrders}>
          <i className="ri-refresh-line"></i> Refresh
        </button>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      {orders.length === 0 ? (
        <div className="admin-empty">No orders yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><strong>{order.orderReference}</strong></td>
                  <td>
                    <div>{order.userName}</div>
                    <small>{order.userEmail}</small>
                  </td>
                  <td>{order.items?.length || 0}</td>
                  <td>ETB {Number(order.totalAmount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${order.paymentStatus}`}>{order.paymentStatus}</span>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
