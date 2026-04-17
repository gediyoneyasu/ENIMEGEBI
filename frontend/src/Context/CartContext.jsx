import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('enimegebiCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setCartCount(cart.length);
    }
  }, []);

  const addToCart = (product) => {
    const existingCart = [...cartItems];
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    setCartItems(existingCart);
    setCartCount(existingCart.length);
    localStorage.setItem('enimegebiCart', JSON.stringify(existingCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('enimegebiCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('enimegebiCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.setItem('enimegebiCart', JSON.stringify([]));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};