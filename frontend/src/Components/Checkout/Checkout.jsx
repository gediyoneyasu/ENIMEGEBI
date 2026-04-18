import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
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

  const calculateTotal = () => {
    if (!cart || cart.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.15;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const totals = calculateTotal();

  const generateOrderReference = () => {
    return 'ENM-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const createOrder = async (orderReference, paymentStatus = 'pending') => {
    const orderData = {
      orderReference: orderReference,
      items: cart.map(item => ({
        productId: item.id || item._id,
        productName: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.imageUrl || item.image
      })),
      totalAmount: totals.total,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus
    };

    const token = localStorage.getItem('enimegebiToken');
    const response = await axios.post('http://localhost:5001/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  };

  const handleChapaPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First create order with pending status
      const orderReference = generateOrderReference();
      await createOrder(orderReference, 'pending');
      
      // Initialize Chapa payment
      const token = localStorage.getItem('enimegebiToken');
      const paymentResponse = await axios.post('http://localhost:5001/api/payment/initialize', {
        orderId: orderReference,
        amount: totals.total,
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data.success && paymentResponse.data.checkout_url) {
        // Store order reference for later
        sessionStorage.setItem('pendingOrderRef', orderReference);
        // Redirect to Chapa payment page
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        throw new Error(paymentResponse.data.message || 'Payment initialization failed');
      }
    } catch (err) {
      console.error('Chapa payment error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Payment initialization failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError('');

    try {
      const orderReference = generateOrderReference();
      await createOrder(orderReference, 'pending');
      
      setOrderRef(orderReference);
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.phone) {
      setError('Please fill all shipping information');
      return;
    }
    
    if (paymentMethod === 'chapa') {
      await handleChapaPayment();
    } else {
      await handleCashOnDelivery();
    }
  };

  // Check for payment return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('order');
    
    if (paymentStatus === 'success' && orderId) {
      setOrderRef(orderId);
      setSuccess(true);
      clearCart();
      // Clean URL
      window.history.replaceState({}, document.title, '/checkout');
    } else if (paymentStatus === 'failed') {
      setError('Payment failed. Please try again or choose another payment method.');
      window.history.replaceState({}, document.title, '/checkout');
    }
  }, [clearCart]);

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
          <Link to={`/orders`} className="view-orders-btn">View My Orders</Link>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="checkout-wrapper">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2><i className="ri-user-line"></i> Personal Information</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h2><i className="ri-map-pin-line"></i> Shipping Information</h2>
            <div className="form-group">
              <label>Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h2><i className="ri-bank-card-line"></i> Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-cash-line"></i>
                <div>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when you receive your order</small>
                </div>
              </label>
              
              <label className="payment-option">
                <input type="radio" name="payment" value="chapa" checked={paymentMethod === 'chapa'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-bank-card-line"></i>
                <div>
                  <strong>Chapa Payment</strong>
                  <small>Pay with CBE, Awash, Dashen, Telebirr, Card</small>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Processing...' : `Place Order - ETB ${totals.total.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary-sidebar">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>ETB {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="total-row"><span>Subtotal:</span><span>ETB {totals.subtotal.toFixed(2)}</span></div>
            <div className="total-row"><span>Shipping:</span><span>ETB {totals.shipping.toFixed(2)}</span></div>
            <div className="total-row"><span>Tax (15%):</span><span>ETB {totals.tax.toFixed(2)}</span></div>
            <div className="total-row grand-total"><span>Total:</span><span>ETB {totals.total.toFixed(2)}</span></div>
          </div>
          
          <div className="payment-info">
            <i className="ri-shield-check-line"></i>
            <p>Your payment is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
