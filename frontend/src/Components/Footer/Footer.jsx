import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './Footer.css';

const Footer = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/home/public-data');
      if (response.data.success) {
        setSettings(response.data.settings || {});
        const categoryList = (response.data.categories || []).slice(0, 6).map(cat => cat._id);
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const translations = {
    en: {
      aboutUs: 'About Us',
      aboutText: 'Enimegebi is Ethiopia\'s premier online marketplace for fresh, organic, and locally sourced products. We connect farmers directly with consumers.',
      quickLinks: 'Quick Links',
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
      myAccount: 'My Account',
      profile: 'My Profile',
      orders: 'My Orders',
      wishlist: 'Wishlist',
      login: 'Login',
      contactUs: 'Contact Us',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      workingHours: 'Working Hours',
      monFri: 'Mon - Fri: 9:00 AM - 6:00 PM',
      sat: 'Saturday: 10:00 AM - 4:00 PM',
      sun: 'Sunday: Closed',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      newsletterText: 'Subscribe to get special offers and updates',
      subscribe: 'Subscribe',
      yourEmail: 'Your Email',
      rights: 'All Rights Reserved',
      developedBy: 'Developed by'
    },
    am: {
      aboutUs: 'ስለእኛ',
      aboutText: 'እንመገቢ የኢትዮጵያ ቀዳሚ የመስመር ላይ ገበያ ነው ለትኩስ፣ ኦርጋኒክ እና የአገር ውስጥ ምርቶች። አርሶ አደሮችን በቀጥታ ከደንበኞች ጋር እናገናኛለን።',
      quickLinks: 'ፈጣን አገናኞች',
      home: 'መነሻ',
      products: 'ምርቶች',
      categories: 'ምድቦች',
      about: 'ስለእኛ',
      contact: 'ያግኙን',
      myAccount: 'መለያዬ',
      profile: 'መገለጫዬ',
      orders: 'ትዕዛዞቼ',
      wishlist: 'የምኞት ዝርዝር',
      login: 'ግባ',
      contactUs: 'ያግኙን',
      phone: 'ስልክ',
      email: 'ኢሜይል',
      address: 'አድራሻ',
      workingHours: 'የስራ ሰዓት',
      monFri: 'ሰኞ - አርብ: 9:00 ጠዋት - 6:00 ማታ',
      sat: 'ቅዳሜ: 10:00 ጠዋት - 4:00 ማታ',
      sun: 'እሁድ: ዝግ ነው',
      followUs: 'ተከተሉን',
      newsletter: 'ጋዜጣ',
      newsletterText: 'ልዩ ቅናሾችን እና ዝማኔዎችን ለማግኘት ይመዝገቡ',
      subscribe: 'ይመዝገቡ',
      yourEmail: 'ኢሜይልዎ',
      rights: 'መብቱ በህግ የተጠበቀ ነው',
      developedBy: 'የተገነባው በ'
    }
  };

  const t = translations[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>Enimegebi</h3>
          <p>{t.aboutText}</p>
          <div className="social-links">
            <a href={settings.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-facebook-line"></i></a>
            <a href={settings.twitter || 'https://twitter.com'} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-twitter-line"></i></a>
            <a href={settings.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-instagram-line"></i></a>
            <a href={settings.telegram || 'https://t.me'} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-telegram-line"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>{t.quickLinks}</h3>
          <ul>
            <li><Link to="/">{t.home}</Link></li>
            <li><Link to="/products">{t.products}</Link></li>
            <li><Link to="/categories">{t.categories}</Link></li>
            <li><Link to="/about">{t.about}</Link></li>
            <li><Link to="/contact">{t.contact}</Link></li>
          </ul>
        </div>

        {/* My Account Links */}
        <div className="footer-section">
          <h3>{t.myAccount}</h3>
          <ul>
            <li><Link to="/profile">{t.profile}</Link></li>
            <li><Link to="/orders">{t.orders}</Link></li>
            <li><Link to="/wishlist">{t.wishlist}</Link></li>
            <li><Link to="/auth">{t.login}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>{t.contactUs}</h3>
          <div className="contact-info">
            <p><i className="ri-phone-line"></i> {settings.phone || '+251 96 411 3416'}</p>
            <p><i className="ri-mail-line"></i> {settings.email || 'info@enimegebi.com'}</p>
            <p><i className="ri-map-pin-line"></i> {language === 'en' ? (settings.address || 'Addis Ababa, Ethiopia') : (settings.addressAm || 'አዲስ አበባ፣ ኢትዮጵያ')}</p>
          </div>
          <div className="working-hours">
            <p><i className="ri-time-line"></i> {t.monFri}</p>
            <p>{t.sat}</p>
            <p>{t.sun}</p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>{t.newsletter}</h3>
          <p>{t.newsletterText}</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t.yourEmail} />
            <button type="submit">{t.subscribe} <i className="ri-arrow-right-line"></i></button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {currentYear} Enimegebi. {t.rights}.</p>
          <p>{t.developedBy} <strong>Gediyon Eyasu</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
