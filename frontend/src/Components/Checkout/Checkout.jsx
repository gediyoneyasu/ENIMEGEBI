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
    if (!cart || cart.length === 0) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.15;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const totals = calculateTotal();

  const createOrder = async () => {
    const token = localStorage.getItem('enimegebiToken');
    const orderData = {
      items: cart.map(item => ({
        productId: item.id || item._id,
        productName: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0
      })),
      totalAmount: totals.total,
      shippingAddress: { street: formData.address, city: formData.city, phone: formData.phone },
      paymentMethod: paymentMethod,
      orderReference: 'ORD-' + Date.now().toString().slice(-8)
    };

    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.order;
  };

  const handleChapaPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const order = await createOrder();
      const token = localStorage.getItem('enimegebiToken');
      
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
        sessionStorage.setItem('pendingOrderRef', order.orderReference);
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        throw new Error(paymentResponse.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError('');
    
    try {
      await createOrder();
      clearCart();
      navigate('/orders?payment=success');
    } catch (err) {
      setError('Failed to place order');
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

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <i className="ri-shopping-cart-line"></i>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
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
            <h2>Personal Information</h2>
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-cash-line"></i>
                <div><strong>Cash on Delivery</strong><small>Pay when you receive</small></div>
              </label>
              <label className={`payment-option ${paymentMethod === 'chapa' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="chapa" checked={paymentMethod === 'chapa'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-bank-card-line"></i>
                <div><strong>Chapa Payment</strong><small>Pay with CBE, Awash, Dashen, Telebirr, Card</small></div>
              </label>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Processing...' : `Place Order - ETB ${totals.total.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary-sidebar">
          <h2>Order Summary</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>ETB {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-totals">
            <div className="total-row"><span>Subtotal:</span><span>ETB {totals.subtotal.toFixed(2)}</span></div>
            <div className="total-row"><span>Shipping:</span><span>ETB {totals.shipping.toFixed(2)}</span></div>
            <div className="total-row"><span>Tax (15%):</span><span>ETB {totals.tax.toFixed(2)}</span></div>
            <div className="total-row grand-total"><span>Total:</span><span>ETB {totals.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
