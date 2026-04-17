import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const userData = localStorage.getItem('enimegebiUser');
    
    if (!token) {
      navigate('/auth');
      return;
    }
    
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || ''
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.15;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax
    };
  };

  const createOrder = async (paymentStatus = 'pending') => {
    const totals = calculateTotal();
    
    const orderData = {
      items: cart.map(item => ({
        productId: item.id || item._id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totals.total,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        phone: formData.phone
      },
      paymentMethod: formData.paymentMethod,
      paymentStatus: paymentStatus,
      orderStatus: paymentStatus === 'paid' ? 'processing' : 'pending'
    };

    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.post('http://localhost:5001/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.order;
    } catch (err) {
      console.error('Order creation error:', err);
      throw err;
    }
  };

  const handleChapaPayment = async () => {
    setProcessingPayment(true);
    setError('');

    try {
      // First create order with pending payment
      const order = await createOrder('pending');
      
      // Initialize Chapa payment
      const token = localStorage.getItem('enimegebiToken');
      const paymentResponse = await axios.post('http://localhost:5001/api/payment/initialize', {
        orderId: order._id,
        amount: calculateTotal().total,
        email: formData.email,
        name: formData.name,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (paymentResponse.data.success) {
        // Redirect to Chapa checkout
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        setError('Payment initialization failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong with payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError('');

    try {
      const order = await createOrder('pending');
      clearCart();
      navigate('/orders', { state: { success: true, orderId: order._id } });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'chapa') {
      await handleChapaPayment();
    } else {
      await handleCashOnDelivery();
    }
  };

  const totals = calculateTotal();

  if (cart.length === 0) {
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
      <h1>Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <h2>Shipping Information</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-method">
                <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} />
                <i className="ri-cash-line"></i>
                <span>Cash on Delivery</span>
              </label>
              
              <label className="payment-method">
                <input type="radio" name="paymentMethod" value="chapa" checked={formData.paymentMethod === 'chapa'} onChange={handleChange} />
                <i className="ri-bank-card-line"></i>
                <span>Chapa (Card / Bank / Telebirr)</span>
              </label>
            </div>
            
            <button type="submit" className="place-order-btn" disabled={loading || processingPayment}>
              {loading ? 'Placing Order...' : processingPayment ? 'Redirecting to Payment...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>ETB {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>ETB {totals.shipping.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax (15%):</span>
              <span>ETB {totals.tax.toFixed(2)}</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>ETB {totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
