import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put(`http://localhost:5001/api/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = { pending: '#ff9800', processing: '#2196f3', shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336' };
    return colors[status] || '#999';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>;

  return (
    <div>
      <h2>Order Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{order._id.slice(-8)}</td>
                <td style={{ padding: '12px' }}>{order.userName}<br/><small>{order.userEmail}</small></td>
                <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>${order.totalAmount}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: getStatusColor(order.orderStatus), color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '12px' }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order._id, e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
