import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import './Cart.css';

function Cart() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    setLoading(false);
  }, []);

  const translations = {
    en: {
      title: 'Your Shopping Cart',
      subtitle: 'Review and manage your items',
      emptyCart: 'Your cart is empty',
      emptyMessage: 'Looks like you haven\'t added any items to your cart yet.',
      startShopping: 'Start Shopping',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      remove: 'Remove',
      update: 'Update',
      subtotal: 'Subtotal',
      delivery: 'Delivery Fee',
      tax: 'Tax (10%)',
      orderTotal: 'Order Total',
      checkout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping',
      clearCart: 'Clear Cart',
      addedToCart: 'Added to cart',
      removedFromCart: 'Removed from cart',
      quantityUpdated: 'Quantity updated',
      free: 'Free',
      perKg: '/kg',
      perLiter: '/liter',
      unit: '/unit'
    },
    am: {
      title: 'የእርስዎ ጋሪ',
      subtitle: 'ምርቶችዎን ይገምግሙ እና ያስተዳድሩ',
      emptyCart: 'ጋሪዎ ባዶ ነው',
      emptyMessage: 'እስካሁን ምንም ምርቶች ወደ ጋሪዎ አልጨመሩም።',
      startShopping: 'ግዢ ይጀምሩ',
      product: 'ምርት',
      price: 'ዋጋ',
      quantity: 'ብዛት',
      total: 'ድምር',
      remove: 'አስወግድ',
      update: 'አዘምን',
      subtotal: 'ንኡስ ድምር',
      delivery: 'የመላኪያ ክፍያ',
      tax: 'ግብር (10%)',
      orderTotal: 'ጠቅላላ ድምር',
      checkout: 'ወደ መግዣ ቀጥል',
      continueShopping: 'ግዢ ቀጥል',
      clearCart: 'ጋሪ አጽዳ',
      addedToCart: 'ወደ ጋሪ ተጨምሯል',
      removedFromCart: 'ከጋሪ ተወግዷል',
      quantityUpdated: 'ብዛት ተዘምኗል',
      free: 'ነጻ',
      perKg: '/ኪግ',
      perLiter: '/ሊትር',
      unit: '/ክፍል'
    }
  };

  const t = translations[language];

  const getUnitLabel = (unit) => {
    if (unit === 'kg') return t.perKg;
    if (unit === 'liter') return t.perLiter;
    return t.unit;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  if (loading) {
    return (
      <div className="cart-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <i className="ri-shopping-cart-line"></i>
          <h2>{t.emptyCart}</h2>
          <p>{t.emptyMessage}</p>
          <Link to="/products" className="start-shopping-btn">
            <i className="ri-arrow-left-line"></i>
            {t.startShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="product-col">{t.product}</div>
              <div className="price-col">{t.price}</div>
              <div className="quantity-col">{t.quantity}</div>
              <div className="total-col">{t.total}</div>
              <div className="action-col"></div>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="product-col">
                    <div className="product-info">
                      <img src={item.image} alt={language === 'en' ? item.name : item.nameAm} />
                      <div>
                        <h3>{language === 'en' ? item.name : item.nameAm}</h3>
                        <p className="product-seller">
                          <i className="ri-store-line"></i> {item.seller}
                        </p>
                        <p className="product-unit">{getUnitLabel(item.unit)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="price-col">
                    <span className="item-price">ETB {item.price}</span>
                  </div>
                  <div className="quantity-col">
                    <div className="quantity-selector">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="total-col">
                    <span className="item-total">ETB {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="action-col">
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-actions">
              <Link to="/products" className="continue-shopping-btn">
                <i className="ri-arrow-left-line"></i>
                {t.continueShopping}
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>
                <i className="ri-delete-bin-line"></i>
                {t.clearCart}
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>{t.subtotal} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>ETB {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>{t.delivery}</span>
                <span>{deliveryFee === 0 ? t.free : `ETB ${deliveryFee}`}</span>
              </div>
              <div className="summary-row">
                <span>{t.tax}</span>
                <span>ETB {tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>{t.orderTotal}</span>
                <span>ETB {total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              {t.checkout} <i className="ri-arrow-right-line"></i>
            </button>
            <div className="secure-notice">
              <i className="ri-shield-check-line"></i>
              <span>Secure checkout. Your information is protected.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;