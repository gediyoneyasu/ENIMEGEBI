import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../main';
import './Checkout.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Checkout = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [user, setUser] = useState(null);
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
        setUser(parsed);
        setFormData({
          fullName: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
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

  const calculateTotal = () => {
    if (!cart || cart.length === 0) return { total: 0 };
    return { total: getCartTotal() };
  };

  const totals = calculateTotal();

  const handleChapaPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      // First create order
      const orderData = {
        items: cart.map(item => ({
          productId: item.id || item._id,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        totalAmount: totals.total,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          phone: formData.phone
        },
        paymentMethod: 'chapa',
        orderReference: 'ORD-' + Date.now().toString().slice(-8)
      };

      const orderResponse = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const order = orderResponse.data.order;
      
      // Initialize Chapa payment
      const paymentResponse = await axios.post(`${API_URL}/api/payment/initialize-order`, {
        orderId: order.orderReference,
        amount: totals.total,
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (paymentResponse.data.success) {
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        setError('Payment initialization failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.id || item._id,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        totalAmount: totals.total,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          phone: formData.phone
        },
        paymentMethod: 'cash',
        orderReference: 'ORD-' + Date.now().toString().slice(-8)
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrderRef(response.data.order.orderReference);
        setSuccess(true);
        clearCart();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.phone) {
      setError('Please fill all shipping information');
      return;
    }
    
    const paymentMethod = e.nativeEvent.submitter.value;
    if (paymentMethod === 'chapa') {
      handleChapaPayment();
    } else {
      handleCashOnDelivery();
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
          <p>Order ID: {orderRef}</p>
          <Link to="/orders" className="view-orders-btn">View Orders</Link>
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
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Information</h2>
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="payment-section">
            <h2>Payment Method</h2>
            <button type="submit" name="paymentMethod" value="cash" className="cash-btn" disabled={loading}>
              Cash on Delivery
            </button>
            <button type="submit" name="paymentMethod" value="chapa" className="chapa-btn" disabled={loading}>
              Pay with Chapa (Card, CBE, Awash, Dashen, Telebirr)
            </button>
          </div>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>ETB {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ETB {totals.total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
