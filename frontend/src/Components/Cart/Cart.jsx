import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../main';
import './Cart.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  const calculateItemTotal = (item) => {
    return (item.price || 0) * (item.quantity || 1);
  };

  const cartTotal = getCartTotal();

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty">
        <i className="ri-shopping-cart-line"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="continue-shopping-btn">
          <i className="ri-arrow-left-line"></i>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>
          
          {cart.map((item) => (
            <div key={item.id || item._id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-image">
                  {item.imageUrl || item.image ? (
                    <img 
                      src={getImageUrl(item.imageUrl || item.image)} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="no-image" style={{ display: (item.imageUrl || item.image) ? 'none' : 'flex' }}>
                    <i className="ri-image-line"></i>
                  </div>
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {item.category && <p className="item-category">{item.category}</p>}
                </div>
              </div>
              
              <div className="cart-item-price">
                ETB {(item.price || 0).toLocaleString()}
              </div>
              
              <div className="cart-item-quantity">
                <button 
                  onClick={() => handleQuantityChange(item.id || item._id, (item.quantity || 1) - 1)} 
                  className="qty-btn"
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="qty-value">{item.quantity || 1}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id || item._id, (item.quantity || 1) + 1)} 
                  className="qty-btn"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
              
              <div className="cart-item-total">
                ETB {calculateItemTotal(item).toLocaleString()}
              </div>
              
              <div className="cart-item-remove">
                <button onClick={() => removeFromCart(item.id || item._id)} className="remove-btn">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))}
          
          <div className="cart-actions">
            <Link to="/products" className="continue-shopping">
              <i className="ri-arrow-left-line"></i>
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="clear-cart-btn">
              <i className="ri-delete-bin-line"></i>
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>ETB {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>ETB {cartTotal.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;