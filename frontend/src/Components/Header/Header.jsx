import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import './Header.css';

function Header() {
  const { language, changeLanguage } = useLanguage();
  const { cartCount } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

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

  const toggleLangDropdown = () => setShowLangDropdown(!showLangDropdown);

  const translations = {
    en: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      projects: 'Projects',
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
      projects: 'ፕሮጀክቶች',
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
        <Link to="/"><span>Enimegebi</span></Link>
      </div>

      <ul className={showMenu ? "showNav" : ""} onClick={closeMenu}>
        <li><Link to="/">{t.home}</Link></li>
        <li><Link to="/products">{t.products}</Link></li>
        <li><Link to="/categories">{t.categories}</Link></li>
        <li><Link to="/projects">{t.projects}</Link></li>
        <li><Link to="/about">{t.about}</Link></li>
        <li><Link to="/contact">{t.contact}</Link></li>
        {isLoggedIn && userRole === 'admin' && <li><Link to="/admin">{t.admin}</Link></li>}
        {isLoggedIn && <li><button onClick={handleLogout} className="mobile-logout">{t.logout}</button></li>}
      </ul>

      <div className="nav_btn">
        <div className="language-dropdown">
          <button className="lang-btn" onClick={toggleLangDropdown}>
            <span>{language === 'en' ? 'EN' : 'አማ'}</span>
            <i className="ri-arrow-down-s-line"></i>
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown-menu">
              <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => selectLanguage('en')}>English (EN)</button>
              <button className={`lang-option ${language === 'am' ? 'active' : ''}`} onClick={() => selectLanguage('am')}>አማርኛ (AM)</button>
            </div>
          )}
        </div>

        <Link to="/cart" className="cart-btn" aria-label={t.cart}>
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-profile-icon"><i className="ri-user-line"></i></Link>
            <div className="user-menu">
              <Link to="/profile" className="user-btn"><i className="ri-user-line"></i><span>{userName.split(' ')[0]}</span></Link>
              <button type="button" onClick={handleLogout} className="logout-icon"><i className="ri-logout-box-line"></i></button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="auth-btn"><i className="ri-user-line"></i><span>{t.login}</span></Link>
        )}
        
        <i className="ri-menu-4-line" id="bars" onClick={toggleMenu}></i>
      </div>
    </header>
  );
}

export default Header;
