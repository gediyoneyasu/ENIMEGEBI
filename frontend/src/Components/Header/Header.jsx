import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useLanguage();
  const { cartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    const user = localStorage.getItem('enimegebiUser');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name || '');
        setUserRole(userData.role || 'user');
      } catch {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('enimegebiToken');
    localStorage.removeItem('enimegebiUser');
    setIsLoggedIn(false);
    navigate('/');
    closeMenu();
  };

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setShowLangDropdown(false);
  };

  const toggleLangDropdown = () => {
    setShowLangDropdown(!showLangDropdown);
  };

  const translations = {
    en: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      orders: 'Orders',
      about: 'About',
      contact: 'Contact',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      cart: 'Cart',
      admin: 'Admin Panel'
    },
    am: {
      home: 'መነሻ',
      products: 'ምርቶች',
      categories: 'ምድቦች',
      orders: 'ትዕዛዞች',
      about: 'ስለእኛ',
      contact: 'ያግኙን',
      profile: 'መገለጫ',
      logout: 'ውጣ',
      login: 'ግባ',
      cart: 'ጋሪ',
      admin: 'አስተዳዳሪ ፓነል'
    }
  };

  const t = translations[language];

  return (
    <header className="nav_wrapper">
      <div className="nav_logo">
        <Link to="/">
          <span>Enimegebi</span>
        </Link>
      </div>

      <ul className={showMenu ? "showNav" : ""} onClick={closeMenu}>
        <li><Link to="/">{t.home}</Link></li>
        <li><Link to="/products">{t.products}</Link></li>
        <li><Link to="/categories">{t.categories}</Link></li>
        <li><Link to="/orders">{t.orders}</Link></li>
        <li><Link to="/about">{t.about}</Link></li>
        <li><Link to="/contact">{t.contact}</Link></li>
        
        {/* Show Admin Panel link only for admin users */}
        {isLoggedIn && userRole === 'admin' && (
          <li><Link to="/admin" className="admin-nav-link">{t.admin}</Link></li>
        )}
        
        {isLoggedIn && (
          <>
            <li><Link to="/profile" className="mobile-profile">{t.profile}</Link></li>
            <li><button onClick={handleLogout} className="mobile-logout">{t.logout}</button></li>
          </>
        )}
      </ul>

      <div className="nav_btn">
        {/* Language Dropdown */}
        <div className="language-dropdown">
          <button className="lang-btn" onClick={toggleLangDropdown}>
            <span>{language === 'en' ? 'EN' : 'አማ'}</span>
            <i className="ri-arrow-down-s-line"></i>
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown-menu">
              <button 
                className={`lang-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => selectLanguage('en')}
              >
                English (EN)
              </button>
              <button 
                className={`lang-option ${language === 'am' ? 'active' : ''}`}
                onClick={() => selectLanguage('am')}
              >
                አማርኛ (AM)
              </button>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="cart-btn" aria-label={t.cart}>
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        {isLoggedIn ? (
          <>
            {/* Admin Icon for admin users */}
            {userRole === 'admin' && (
              <Link to="/admin" className="admin-icon" aria-label={t.admin}>
                <i className="ri-shield-star-line"></i>
              </Link>
            )}
            
            <Link to="/profile" className="nav-profile-icon" aria-label={t.profile}>
              <i className="ri-user-line"></i>
            </Link>
            <div className="user-menu">
              <Link to="/profile" className="user-btn">
                <i className="ri-user-line"></i>
                <span>{userName.split(' ')[0]}</span>
              </Link>
              <button type="button" onClick={handleLogout} className="logout-icon">
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="auth-btn">
            <i className="ri-user-line"></i>
            <span>{t.login}</span>
          </Link>
        )}
        
        <i className="ri-menu-4-line" id="bars" onClick={toggleMenu}></i>
      </div>
    </header>
  );
}

export default Header;
