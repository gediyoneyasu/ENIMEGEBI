import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart, useLanguage } from '../../main';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://enimegebi-backend.onrender.com';

const Checkout = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  // Translations
  const translations = {
    en: {
      title: 'Checkout',
      subtitle: 'Complete your order',
      shippingInfo: 'Shipping Information',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      city: 'City',
      address: 'Street Address',
      orderNotes: 'Order Notes (Optional)',
      notesPlaceholder: 'Special delivery instructions or notes',
      paymentMethod: 'Payment Method',
      cashOnDelivery: 'Cash on Delivery',
      cashDesc: 'Pay when you receive your order',
      chapaPayment: 'Chapa Payment',
      chapaDesc: 'Pay with CBE, Awash, Dashen, Telebirr, Credit Card',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax (15%)',
      total: 'Total',
      free: 'Free',
      securePayment: 'Secure payment protected by encryption',
      yourInfoSecure: 'Your payment info is secure',
      emptyCartTitle: 'Your cart is empty',
      emptyCartMsg: 'Looks like you haven\'t added any items to your cart yet.',
      shopNow: 'Shop Now',
      orderSuccess: 'Order Successful!',
      orderPlaced: 'Your order has been placed successfully.',
      confirmationEmail: 'You will receive a confirmation email shortly.',
      viewOrders: 'View Orders',
      continueShopping: 'Continue Shopping',
      verifyingPayment: 'Verifying payment...',
      pleaseFillShipping: 'Please fill all shipping information',
      paymentFailed: 'Payment failed. Please try again.',
      orderFailed: 'Failed to place order. Please try again.',
      fullNamePlaceholder: 'Enter your full name',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+251 XXX XXX XXX',
      cityPlaceholder: 'City',
      addressPlaceholder: 'House number, street name'
    },
    am: {
      title: 'ትዕዛዝ ያስገቡ',
      subtitle: 'ትዕዛዝዎን ያጠናቅቁ',
      shippingInfo: 'የማጓጓዣ መረጃ',
      fullName: 'ሙሉ ስም',
      email: 'ኢሜይል',
      phone: 'ስልክ ቁጥር',
      city: 'ከተማ',
      address: 'አድራሻ',
      orderNotes: 'ማስታወሻ (አማራጭ)',
      notesPlaceholder: 'ልዩ የማድረሻ መመሪያዎች ወይም ማስታወሻዎች',
      paymentMethod: 'የክፍያ መንገድ',
      cashOnDelivery: 'በደረሰኝ ክፍያ',
      cashDesc: 'ምርቱ ሲደርስ ይክፈሉ',
      chapaPayment: 'ቻፓ ክፍያ',
      chapaDesc: 'በሲቢኢ፣ አዋሽ፣ ዳሼን፣ ቴሌብር፣ ካርድ ይክፈሉ',
      placeOrder: 'ትዕዛዝ አስገባ',
      processing: 'በማቀናበር ላይ...',
      orderSummary: 'የትዕዛዝ ማጠቃለያ',
      subtotal: 'ንዑስ ድምር',
      shipping: 'የማጓጓዣ ወጪ',
      tax: 'ግብር (15%)',
      total: 'ጠቅላላ',
      free: 'ነጻ',
      securePayment: 'ክፍያ በምስጠራ የተጠበቀ ነው',
      yourInfoSecure: 'የክፍያ መረጃዎ ደህንነቱ የተጠበቀ ነው',
      emptyCartTitle: 'የእርስዎ ጋሪ ባዶ ነው',
      emptyCartMsg: 'እስካሁን ምንም እቃዎች ወደ ጋሪዎ አልጨመሩም።',
      shopNow: 'አሁን ይግዙ',
      orderSuccess: 'ትዕዛዝ ተሳክቷል!',
      orderPlaced: 'ትዕዛዝዎ በተሳካ ሁኔታ ተመዝግቧል።',
      confirmationEmail: 'የማረጋገጫ ኢሜይል በቅርቡ ይደርስዎታል።',
      viewOrders: 'ትዕዛዞችን ይመልከቱ',
      continueShopping: 'ግዢዎን ይቀጥሉ',
      verifyingPayment: 'ክፍያ በማረጋገጥ ላይ...',
      pleaseFillShipping: 'እባክዎ ሁሉንም የማጓጓዣ መረጃ ይሙሉ',
      paymentFailed: 'ክፍያ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
      orderFailed: 'ትዕዛዝ ማስገባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
      fullNamePlaceholder: 'ሙሉ ስምዎን ያስገቡ',
      emailPlaceholder: 'ኢሜይልዎ',
      phonePlaceholder: '+251 XXX XXX XXX',
      cityPlaceholder: 'ከተማ',
      addressPlaceholder: 'የቤት ቁጥር፣ የመንገድ ስም'
    }
  };

  const t = translations[language];

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
          city: '',
          notes: ''
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
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      totalAmount: totals.total,
      shippingAddress: { 
        street: formData.address, 
        city: formData.city, 
        phone: formData.phone,
        fullName: formData.fullName
      },
      paymentMethod: paymentMethod,
      notes: formData.notes,
      orderReference: 'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase()
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
      const token = localStorage.getItem('enimegebiToken');
      const order = await createOrder();
      
      const paymentResponse = await axios.post(`${API_URL}/api/payment/initialize-order`, {
        orderId: order.orderReference,
        amount: Number(totals.total),
        email: formData.email || user?.email,
        name: formData.fullName || user?.name,
        phone: formData.phone || user?.phone || '',
        returnUrl: `${window.location.origin}/checkout`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (paymentResponse.data.success && paymentResponse.data.checkout_url) {
        window.location.assign(paymentResponse.data.checkout_url);
      } else {
        setError(paymentResponse.data.message || t.paymentFailed);
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || t.paymentFailed);
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError('');
    
    try {
      await createOrder();
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.message || t.orderFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.phone) {
      setError(t.pleaseFillShipping);
      return;
    }
    
    if (paymentMethod === 'chapa') {
      await handleChapaPayment();
    } else {
      await handleCashOnDelivery();
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const txRef = urlParams.get('tx_ref');

    const verifyReturnedPayment = async () => {
      if (!txRef || paymentStatus !== 'pending') return;
      setVerifyingPayment(true);

      try {
        const token = localStorage.getItem('enimegebiToken');
        const verifyResponse = await axios.get(`${API_URL}/api/payment/verify-order-status/${txRef}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (verifyResponse.data.success) {
          setSuccess(true);
          clearCart();
          window.history.replaceState({}, document.title, '/checkout');
        } else {
          setError(t.paymentFailed);
          window.history.replaceState({}, document.title, '/checkout');
        }
      } catch (verifyError) {
        setError(verifyError.response?.data?.message || t.paymentFailed);
      } finally {
        setVerifyingPayment(false);
      }
    };

    if (paymentStatus === 'success') {
      setSuccess(true);
      clearCart();
      window.history.replaceState({}, document.title, '/checkout');
    } else if (paymentStatus === 'failed') {
      setError(t.paymentFailed);
      window.history.replaceState({}, document.title, '/checkout');
    } else if (paymentStatus === 'pending' && txRef) {
      verifyReturnedPayment();
    }
  }, [clearCart, t]);

  if (verifyingPayment) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{t.verifyingPayment}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <i className="ri-checkbox-circle-fill"></i>
          <h1>{t.orderSuccess}</h1>
          <p>{t.orderPlaced}</p>
          <p className="order-message">{t.confirmationEmail}</p>
          <Link to="/orders" className="view-orders-btn">{t.viewOrders}</Link>
          <Link to="/" className="continue-shopping-btn">{t.continueShopping}</Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <i className="ri-shopping-cart-line"></i>
        <h2>{t.emptyCartTitle}</h2>
        <p>{t.emptyCartMsg}</p>
        <Link to="/products" className="shop-now-btn">{t.shopNow}</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1 className="checkout-title">{t.title}</h1>
        <p className="checkout-subtitle">{t.subtitle}</p>
      </div>
      
      {error && <div className="error-alert"><i className="ri-error-warning-line"></i>{error}</div>}
      
      <div className="checkout-wrapper">
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Shipping Information */}
          <div className="form-section">
            <h2><i className="ri-truck-line"></i> {t.shippingInfo}</h2>
            <div className="form-row">
              <div className="form-group">
                <label><i className="ri-user-line"></i> {t.fullName} *</label>
                <input type="text" name="fullName" placeholder={t.fullNamePlaceholder} value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><i className="ri-mail-line"></i> {t.email} *</label>
                <input type="email" name="email" placeholder={t.emailPlaceholder} value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><i className="ri-phone-line"></i> {t.phone} *</label>
                <input type="tel" name="phone" placeholder={t.phonePlaceholder} value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><i className="ri-map-pin-line"></i> {t.city} *</label>
                <input type="text" name="city" placeholder={t.cityPlaceholder} value={formData.city} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label><i className="ri-home-line"></i> {t.address} *</label>
              <input type="text" name="address" placeholder={t.addressPlaceholder} value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><i className="ri-file-text-line"></i> {t.orderNotes}</label>
              <textarea name="notes" placeholder={t.notesPlaceholder} value={formData.notes} onChange={handleChange} rows="3"></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <h2><i className="ri-bank-card-line"></i> {t.paymentMethod}</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-cash-line"></i>
                <div>
                  <strong>{t.cashOnDelivery}</strong>
                  <small>{t.cashDesc}</small>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === 'chapa' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="chapa" checked={paymentMethod === 'chapa'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <i className="ri-bank-card-line"></i>
                <div>
                  <strong>{t.chapaPayment}</strong>
                  <small>{t.chapaDesc}</small>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? <><i className="ri-loader-4-line ri-spin"></i> {t.processing}</> : <>{t.placeOrder} - ETB {totals.total.toFixed(2)} <i className="ri-arrow-right-line"></i></>}
          </button>
          
          <div className="secure-payment">
            <i className="ri-shield-check-line"></i>
            <span>{t.securePayment}</span>
          </div>
        </form>

        {/* Order Summary */}
        <div className="order-summary-sidebar">
          <h2><i className="ri-shopping-bag-line"></i> {t.orderSummary}</h2>
          
          <div className="summary-items">
            {cart.map((item, idx) => (
              <div key={idx} className="summary-item">
                <div className="summary-item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">ETB {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-row">
              <span>{t.subtotal}</span>
              <span>ETB {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>{t.shipping}</span>
              <span>{totals.shipping === 0 ? t.free : `ETB ${totals.shipping.toFixed(2)}`}</span>
            </div>
            <div className="total-row">
              <span>{t.tax}</span>
              <span>ETB {totals.tax.toFixed(2)}</span>
            </div>
            <div className="total-divider"></div>
            <div className="total-row grand-total">
              <span>{t.total}</span>
              <span>ETB {totals.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="payment-info">
            <i className="ri-lock-line"></i>
            <span>{t.yourInfoSecure}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;