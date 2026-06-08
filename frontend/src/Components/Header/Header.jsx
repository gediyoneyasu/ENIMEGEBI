import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import './Header.css';

function Header() {
  const { language, changeLanguage } = useLanguage();
  const { cartCount } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log cartCount changes
  useEffect(() => {
    console.log('Header cartCount updated:', cartCount);
  }, [cartCount]);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const translations = {
    en: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
      profile: 'My Profile',
      orders: 'My Orders',
      wishlist: 'Wishlist',
      logout: 'Logout',
      login: 'Sign In',
      register: 'Register',
      cart: 'Cart',
      admin: 'Admin',
      search: 'Search products...',
      sell: 'Sell on E-MARKATO'
    },
    am: {
      home: 'መነሻ',
      products: 'ምርቶች',
      categories: 'ምድቦች',
      about: 'ስለእኛ',
      contact: 'ያግኙን',
      profile: 'መገለጫ',
      orders: 'ትዕዛዞች',
      wishlist: 'የምኞት ዝርዝር',
      logout: 'ውጣ',
      login: 'ግባ',
      register: 'ተመዝገብ',
      cart: 'ጋሪ',
      admin: 'አስተዳዳሪ',
      search: 'ምርቶችን ይፈልጉ...',
      sell: 'በኢ-ማርካቶ ሽጡ'
    }
  };

  const t = translations[language];

  return (
    <>
      <header className={`ali-header ${scrolled ? 'scrolled' : ''}`}>
        {/* Top Bar - Desktop only */}
        <div className="ali-topbar">
          <div className="ali-container">
            <div className="ali-topbar-right">
              <Link to="/sell" className="ali-sell-link">
                <i className="ri-store-line"></i> {t.sell}
              </Link>
              <div className="ali-lang" onClick={() => setShowLangDropdown(!showLangDropdown)}>
                <i className="ri-global-line"></i>
                <span>{language === 'en' ? 'EN' : 'አማ'}</span>
                <i className="ri-arrow-down-s-line"></i>
                {showLangDropdown && (
                  <div className="ali-lang-dropdown">
                    <button onClick={() => selectLanguage('en')}>English (EN)</button>
                    <button onClick={() => selectLanguage('am')}>አማርኛ (AM)</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="ali-main-header">
          <div className="ali-container">
            <div className="ali-header-content">
              {/* Logo */}
              <Link to="/" className="ali-logo">
                <i className="ri-shopping-cart-line"></i>
                <span className="ali-logo-text">
                  <span className="ali-logo-e">E-</span>MARKATO
                </span>
              </Link>

              {/* Search */}
              <form className="ali-search" onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) navigate(`/products?search=${searchTerm}`);
              }}>
                <div className="ali-search-box">
                  <input 
                    type="text" 
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">
                    <i className="ri-search-line"></i>
                  </button>
                </div>
              </form>

              {/* Right Actions */}
              <div className="ali-actions">
                {/* Cart with Badge */}
                <Link to="/cart" className="ali-action-cart">
                  <i className="ri-shopping-cart-line"></i>
                  {cartCount > 0 && <span className="ali-cart-badge">{cartCount}</span>}
                  <span className="cart-text">{t.cart}</span>
                </Link>

                {/* Language Icon - Mobile */}
                <div className="ali-action-lang" onClick={() => setShowLangDropdown(!showLangDropdown)}>
                  <i className="ri-global-line"></i>
                  {showLangDropdown && (
                    <div className="ali-mobile-lang-dropdown">
                      <button onClick={() => selectLanguage('en')}>English</button>
                      <button onClick={() => selectLanguage('am')}>አማርኛ</button>
                    </div>
                  )}
                </div>

                {/* User Icon - Mobile */}
                {isLoggedIn ? (
                  <div className="ali-action-user-mobile" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                    <i className="ri-user-line"></i>
                    {showUserDropdown && (
                      <div className="ali-mobile-user-dropdown">
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <Link to="/orders" onClick={closeMenu}>Orders</Link>
                        {userRole === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/auth" className="ali-action-login-mobile">
                    <i className="ri-user-line"></i>
                  </Link>
                )}

                {/* Desktop User Menu */}
                {isLoggedIn ? (
                  <div className="ali-action-user" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                    <i className="ri-user-line"></i>
                    <span>{userName.split(' ')[0]}</span>
                    <i className="ri-arrow-down-s-line"></i>
                    {showUserDropdown && (
                      <div className="ali-user-dropdown">
                        <Link to="/profile">My Profile</Link>
                        <Link to="/orders">My Orders</Link>
                        <Link to="/wishlist">Wishlist</Link>
                        {userRole === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/auth" className="ali-action-login">
                    <i className="ri-user-line"></i>
                    <span>{t.login}</span>
                  </Link>
                )}

                {/* Menu Icon */}
                <div className="ali-action-menu" onClick={toggleMenu}>
                  <i className="ri-menu-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="ali-nav">
          <div className="ali-container">
            <ul className="ali-nav-list">
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t.home}</Link></li>
              <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>{t.products}</Link></li>
              <li><Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>{t.categories}</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>{t.about}</Link></li>
              <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t.contact}</Link></li>
            </ul>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`ali-sidebar ${showMenu ? 'open' : ''}`}>
          <div className="ali-sidebar-header">
            <span className="ali-sidebar-logo">E-MARKATO</span>
            <i className="ri-close-line" onClick={toggleMenu}></i>
          </div>
          <ul className="ali-sidebar-nav">
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
            <li><Link to="/categories" onClick={closeMenu}>Categories</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            <li><Link to="/sell" onClick={closeMenu}>Sell on E-MARKATO</Link></li>
            {!isLoggedIn && <li><Link to="/auth" onClick={closeMenu} className="ali-sidebar-login">Login / Register</Link></li>}
            {isLoggedIn && (
              <>
                <li><Link to="/profile" onClick={closeMenu}>My Profile</Link></li>
                <li><Link to="/orders" onClick={closeMenu}>My Orders</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
        {showMenu && <div className="ali-overlay" onClick={toggleMenu}></div>}
      </header>
      <div className="ali-header-spacer"></div>
    </>
  );
}

export default Header;