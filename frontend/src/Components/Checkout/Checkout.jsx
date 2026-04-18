import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../main';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const userData = localStorage.getItem('enimegebiUser');
    
    if (!token) {
      navigate('/auth');
      return;
    }
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setFormData({
          fullName: parsed.name || '',
          email: parsed.email || '',
          phone: '',
          address: '',
          city: ''
        });
      } catch (e) {
        console.error('Error:', e);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totals = getCartTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.phone) {
      setError('Please fill all shipping information');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('enimegebiToken');
      const orderReference = 'ORD-' + Date.now();
      
      const orderData = {
        orderReference: orderReference,
        items: cart.map(item => ({
          productId: item.id || item._id,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        totalAmount: totals,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod: 'cash'
      };

      await axios.post('import.meta.env.VITE_API_URL/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrderRef(orderReference);
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order error:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <i className="ri-shopping-cart-line"></i>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <i className="ri-checkbox-circle-fill"></i>
          <h1>Order Successful!</h1>
          <p>Your order has been placed successfully.</p>
          <p className="order-ref">Order ID: {orderRef}</p>
          <Link to="/orders" className="view-orders-btn">View My Orders</Link>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-alert">{error}</div>}
      <div className="checkout-wrapper">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          </div>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order - $${totals.toFixed(2)}`}
          </button>
        </form>
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ${totals.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
