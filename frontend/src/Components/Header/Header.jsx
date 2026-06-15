import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useLanguage } from '../../main';
import { useCart } from '../../main';
import { API_URL } from '../../apiConfig';
import './Header.css';
import logoIcon from '../../assets/icon.png';

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
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
        fetchNotifCount(token);
      } catch {
        setIsLoggedIn(false);
        setNotifCount(0);
      }
    } else {
      setIsLoggedIn(false);
      setNotifCount(0);
    }
  }, [location.pathname]);

  const fetchNotifCount = async (token) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifCount(data.count || 0);
    } catch {
      setNotifCount(0);
    }
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setShowSearchDropdown(false);
    }
  };

  const toggleSearchDropdown = () => {
    setShowSearchDropdown((prev) => !prev);
    setShowLangDropdown(false);
    setShowUserDropdown(false);
  };

  const toggleLangDropdown = () => {
    setShowLangDropdown((prev) => !prev);
    setShowSearchDropdown(false);
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
    setShowSearchDropdown(false);
    setShowLangDropdown(false);
  };

  const langLabel = language === 'en' ? 'En' : 'Am';

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
      notifications: 'Notifications',
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
      notifications: 'ማሳወቂያዎች',
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
              <div className="ali-lang" onClick={toggleLangDropdown}>
                <span className="ali-lang-label">{langLabel}</span>
                <i className="ri-arrow-down-s-line"></i>
                {showLangDropdown && (
                  <div className="ali-lang-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => selectLanguage('en')}>English (En)</button>
                    <button onClick={() => selectLanguage('am')}>Amharic (Am)</button>
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
              {/* Logo with Icon PNG */}
              <Link to="/" className="ali-logo">
                <img src={logoIcon} alt="E-MARKATO" className="ali-logo-icon" />
                <span className="ali-logo-text">
                  <span className="ali-logo-e">E-</span>MARKATO
                </span>
              </Link>

              {/* Search - Desktop */}
              <form className="ali-search ali-search-desktop" onSubmit={handleSearchSubmit}>
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
                {/* Search Icon - Mobile */}
                <button
                  type="button"
                  className={`ali-action-search ${showSearchDropdown ? 'active' : ''}`}
                  onClick={toggleSearchDropdown}
                  aria-label={t.search}
                  aria-expanded={showSearchDropdown}
                >
                  <i className="ri-search-line"></i>
                </button>

                <Link
                  to={isLoggedIn ? '/notifications' : '/auth'}
                  className="ali-action-notif"
                  title={t.notifications}
                  onClick={() => { setShowSearchDropdown(false); setShowLangDropdown(false); setShowUserDropdown(false); }}
                >
                  <i className="ri-notification-3-line"></i>
                  {isLoggedIn && notifCount > 0 && (
                    <span className="ali-notif-badge">{notifCount > 9 ? '9+' : notifCount}</span>
                  )}
                </Link>

                {/* Cart with Badge */}
                <Link to="/cart" className="ali-action-cart">
                  <i className="ri-shopping-cart-line"></i>
                  {cartCount > 0 && <span className="ali-cart-badge">{cartCount}</span>}
                  <span className="cart-text">{t.cart}</span>
                </Link>

                {/* Language Icon - Mobile */}
                <button
                  type="button"
                  className={`ali-action-lang ${showLangDropdown ? 'active' : ''}`}
                  onClick={toggleLangDropdown}
                  aria-label="Language"
                  aria-expanded={showLangDropdown}
                >
                  <span className="ali-lang-label">{langLabel}</span>
                  <i className="ri-arrow-down-s-line ali-lang-arrow"></i>
                  {showLangDropdown && (
                    <div className="ali-mobile-lang-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => selectLanguage('en')}>English (En)</button>
                      <button type="button" onClick={() => selectLanguage('am')}>Amharic (Am)</button>
                    </div>
                  )}
                </button>

                {/* User Icon - Mobile */}
                {isLoggedIn ? (
                  <div className="ali-action-user-mobile" onClick={toggleUserDropdown}>
                    <i className="ri-user-line"></i>
                    {showUserDropdown && (
                      <div className="ali-mobile-user-dropdown">
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <Link to="/notifications" onClick={closeMenu}>Notifications</Link>
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
                  <div className="ali-action-user" onClick={toggleUserDropdown}>
                    <i className="ri-user-line"></i>
                    <span>{userName.split(' ')[0]}</span>
                    <i className="ri-arrow-down-s-line"></i>
                    {showUserDropdown && (
                      <div className="ali-user-dropdown">
                        <Link to="/profile">My Profile</Link>
                        <Link to="/notifications">Notifications {notifCount > 0 && `(${notifCount})`}</Link>
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

            {/* Mobile Search Panel - full width, not clipped */}
            {showSearchDropdown && (
              <div className="ali-mobile-search-panel" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="ali-mobile-search-box">
                    <input
                      type="text"
                      placeholder={t.search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" aria-label={t.search}>
                      <i className="ri-search-line"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}
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
            <div className="ali-sidebar-logo">
              <img src={logoIcon} alt="E-MARKATO" className="ali-sidebar-logo-img" />
              <span>E-MARKATO</span>
            </div>
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
                <li><Link to="/notifications" onClick={closeMenu}>Notifications</Link></li>
                <li><Link to="/orders" onClick={closeMenu}>My Orders</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
        {showMenu && <div className="ali-overlay" onClick={toggleMenu}></div>}
      </header>
      <div className={`ali-header-spacer ${showSearchDropdown ? 'search-open' : ''}`}></div>
    </>
  );
}

export default Header;
