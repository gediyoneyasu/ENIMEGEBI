import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('enimegebiCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        const totalCount = parsedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalCount);
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('enimegebiCart', JSON.stringify(cart));
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalCount);
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => (item.id === product.id || item._id === product._id));
      
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id || item._id === product._id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { 
          ...product, 
          id: product.id || product._id,
          quantity: 1 
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => (item.id !== productId && item._id !== productId)));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id === productId || item._id === productId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
