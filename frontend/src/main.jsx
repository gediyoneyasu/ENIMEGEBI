import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Create contexts directly here to avoid import issues
const LanguageContext = React.createContext();
const CartContext = React.createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = React.useState('en');
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('enimegebiLanguage', lang);
  };
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = React.useState([]);
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('enimegebiCart');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCart(parsed);
      setCartCount(parsed.reduce((s, i) => s + (i.quantity || 1), 0));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('enimegebiCart', JSON.stringify(cart));
    setCartCount(cart.reduce((s, i) => s + (i.quantity || 1), 0));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => (i.id === product.id || i._id === product._id));
      if (existing) {
        return prev.map(i => (i.id === product.id || i._id === product._id) 
          ? { ...i, quantity: (i.quantity || 1) + 1 } 
          : i);
      }
      return [...prev, { ...product, id: product.id || product._id, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => (i.id !== id && i._id !== id)));
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((t, i) => t + ((i.price || 0) * (i.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

const useLanguage = () => React.useContext(LanguageContext);
const useCart = () => React.useContext(CartContext);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>
);

export { useLanguage, useCart };
