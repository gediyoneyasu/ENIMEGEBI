import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../main';
import axios from 'axios';
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
      const response = await axios.get('https://enimegebi-backend.onrender.com/api/home/public-data');
      if (response.data.success) {
        setSettings(response.data.settings || {});
        const categoryList = (response.data.categories || []).slice(0, 6);
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const translations = {
    en: {
      aboutUs: 'About E-MARKATO',
      aboutText: 'E-MARKATO is Ethiopia\'s premier online marketplace connecting buyers and sellers. Shop smart, shop local.',
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
      login: 'Sign In',
      contactUs: 'Contact Us',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      helpCenter: 'Help Center',
      paymentMethods: 'Payment Methods',
      shippingInfo: 'Shipping Info',
      returns: 'Returns & Refunds',
      faq: 'FAQ',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      newsletterText: 'Subscribe to get special offers and updates',
      subscribe: 'Subscribe',
      yourEmail: 'Your Email',
      rights: 'All Rights Reserved',
      developedBy: 'Developed by',
      downloadApp: 'Download App',
      comingSoon: 'Coming Soon'
    },
    am: {
      aboutUs: 'ስለ ኢ-ማርካቶ',
      aboutText: 'ኢ-ማርካቶ የኢትዮጵያ ቀዳሚ የመስመር ላይ ገበያ ነው ገዢዎችን እና ሻጮችን የሚያገናኝ። ስማርት ይግዙ፣ አገር በቀል ይግዙ።',
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
      helpCenter: 'የእርዳታ ማዕከል',
      paymentMethods: 'የክፍያ መንገዶች',
      shippingInfo: 'የአቅርቦት መረጃ',
      returns: 'መመለስ እና ተመላሽ',
      faq: 'ተደጋጋሚ ጥያቄዎች',
      followUs: 'ተከተሉን',
      newsletter: 'ጋዜጣ',
      newsletterText: 'ልዩ ቅናሾችን እና ዝማኔዎችን ለማግኘት ይመዝገቡ',
      subscribe: 'ይመዝገቡ',
      yourEmail: 'ኢሜይልዎ',
      rights: 'መብቱ በህግ የተጠበቀ ነው',
      developedBy: 'የተገነባው በ',
      downloadApp: 'አፕል ያውርዱ',
      comingSoon: 'በቅርቡ'
    }
  };

  const t = translations[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ae-footer">
      <div className="ae-footer-container">
        {/* About Section */}
        <div className="ae-footer-col">
          <div className="ae-footer-logo">
            <span className="ae-footer-logo-e">E</span>
            <span className="ae-footer-logo-text">MARKATO</span>
          </div>
          <p className="ae-footer-about">{t.aboutText}</p>
          <div className="ae-social-links">
            <a href={settings.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="ae-social-icon">
              <i className="ri-facebook-line"></i>
            </a>
            <a href={settings.twitter || 'https://twitter.com'} target="_blank" rel="noopener noreferrer" className="ae-social-icon">
              <i className="ri-twitter-x-line"></i>
            </a>
            <a href={settings.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="ae-social-icon">
              <i className="ri-instagram-line"></i>
            </a>
            <a href={settings.telegram || 'https://t.me'} target="_blank" rel="noopener noreferrer" className="ae-social-icon">
              <i className="ri-telegram-line"></i>
            </a>
            <a href={settings.youtube || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="ae-social-icon">
              <i className="ri-youtube-line"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="ae-footer-col">
          <h3 className="ae-footer-title">{t.quickLinks}</h3>
          <ul className="ae-footer-links">
            <li><Link to="/">{t.home}</Link></li>
            <li><Link to="/products">{t.products}</Link></li>
            <li><Link to="/categories">{t.categories}</Link></li>
            <li><Link to="/about">{t.about}</Link></li>
            <li><Link to="/contact">{t.contact}</Link></li>
          </ul>
        </div>

        {/* My Account */}
        <div className="ae-footer-col">
          <h3 className="ae-footer-title">{t.myAccount}</h3>
          <ul className="ae-footer-links">
            <li><Link to="/profile">{t.profile}</Link></li>
            <li><Link to="/orders">{t.orders}</Link></li>
            <li><Link to="/auth">{t.login}</Link></li>
          </ul>
        </div>

        {/* Help Center */}
        <div className="ae-footer-col">
          <h3 className="ae-footer-title">{t.helpCenter}</h3>
          <ul className="ae-footer-links">
            <li><Link to="/faq">{t.faq}</Link></li>
            <li><Link to="/shipping">{t.shippingInfo}</Link></li>
            <li><Link to="/returns">{t.returns}</Link></li>
            <li><Link to="/payment">{t.paymentMethods}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="ae-footer-col">
          <h3 className="ae-footer-title">{t.contactUs}</h3>
          <ul className="ae-footer-contact">
            <li>
              <i className="ri-phone-line"></i>
              <span>{settings.phone || '+251 972 383 620'}</span>
            </li>
            <li>
              <i className="ri-mail-line"></i>
              <span>{settings.email || 'info@emarkato.com'}</span>
            </li>
            <li>
              <i className="ri-map-pin-line"></i>
              <span>{language === 'en' ? (settings.address || 'Addis Ababa, Ethiopia') : (settings.addressAm || 'አዲስ አበባ፣ ኢትዮጵያ')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="ae-footer-newsletter">
        <div className="ae-footer-container">
          <div className="ae-newsletter-wrapper">
            <div className="ae-newsletter-text">
              <i className="ri-mail-send-line"></i>
              <div>
                <h4>{t.newsletter}</h4>
                <p>{t.newsletterText}</p>
              </div>
            </div>
            <form className="ae-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t.yourEmail} />
              <button type="submit">{t.subscribe} <i className="ri-arrow-right-line"></i></button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="ae-footer-payment">
        <div className="ae-footer-container">
          <div className="ae-payment-wrapper">
            <span>{t.paymentMethods}:</span>
            <div className="ae-payment-icons">
              <i className="ri-bank-card-line"></i>
              <i className="ri-smartphone-line"></i>
              <i className="ri-wallet-line"></i>
              <span className="ae-payment-text">Chapa</span>
              <span className="ae-payment-text">CBE Birr</span>
              <span className="ae-payment-text">TeleBirr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="ae-footer-bottom">
        <div className="ae-footer-container">
          <div className="ae-bottom-wrapper">
            <p>&copy; {currentYear} E-MARKATO. {t.rights}.</p>
            <p>{t.developedBy} <strong>Gediyon Eyasu & Bereket Gelane</strong></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;