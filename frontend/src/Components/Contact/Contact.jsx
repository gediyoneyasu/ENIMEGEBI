import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../main';
import { Link } from 'react-router-dom';
import './Contact.css';

const API_URL = 'http://localhost:5001';

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/home/public-data`);
      if (response.data && response.data.success) {
        setSettings(response.data.settings || {});
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // FIXED: Changed from /api/admin/contacts to /api/contact
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      
      console.log('Response:', response.data);
      
      if (response.data.success || response.status === 200) {
        setSuccess('Message sent successfully! We will contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error details:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'We\'re here to help you',
      name: 'Your Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      address: 'Address',
      phone: 'Phone',
      emailUs: 'Email',
      workingHours: 'Working Hours',
      monFri: 'Mon - Fri: 9:00 AM - 6:00 PM',
      sat: 'Saturday: 10:00 AM - 4:00 PM',
      sun: 'Sunday: Closed',
      getInTouch: 'Get in Touch',
      sendMessage: 'Send us a Message'
    },
    am: {
      title: 'ያግኙን',
      subtitle: 'እርዳታ ለማግኘት እዚህ ነን',
      name: 'ስምዎ',
      email: 'ኢሜይል',
      subject: 'ርዕስ',
      message: 'መልእክትዎ',
      send: 'መልእክት ላክ',
      sending: 'በመላክ ላይ...',
      address: 'አድራሻ',
      phone: 'ስልክ',
      emailUs: 'ኢሜይል',
      workingHours: 'የስራ ሰዓት',
      monFri: 'ሰኞ - አርብ: 9:00 - 18:00',
      sat: 'ቅዳሜ: 10:00 - 16:00',
      sun: 'እሁድ: ዝግ ነው',
      getInTouch: 'ያግኙን',
      sendMessage: 'መልእክት ይላኩልን'
    }
  };

  const t = translations[language];

  const contactInfo = [
    { icon: 'ri-map-pin-line', title: t.address, value: settings.address || 'Addis Ababa, Ethiopia' },
    { icon: 'ri-phone-line', title: t.phone, value: settings.phone || '+251 972 383 620' },
    { icon: 'ri-mail-line', title: t.emailUs, value: settings.email || 'info@emarkato.com' }
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Content Grid */}
        <div className="contact-grid">
          {/* Left Side - Contact Info */}
          <div className="contact-info">
            <h2>{t.getInTouch}</h2>
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-item">
                <div className="contact-info-icon">
                  <i className={info.icon}></i>
                </div>
                <div className="contact-info-text">
                  <strong>{info.title}</strong>
                  <p>{info.value}</p>
                </div>
              </div>
            ))}

            {/* Working Hours */}
            <div className="contact-hours">
              <h3>{t.workingHours}</h3>
              <p><i className="ri-time-line"></i> {t.monFri}</p>
              <p><i className="ri-time-line"></i> {t.sat}</p>
              <p><i className="ri-close-circle-line"></i> {t.sun}</p>
            </div>

            {/* Social Links */}
            <div className="contact-social">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="ri-facebook-line"></i></a>
                <a href="https://telegram.me" target="_blank" rel="noopener noreferrer"><i className="ri-telegram-line"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="ri-instagram-line"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="ri-twitter-line"></i></a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form">
            <h2>{t.sendMessage}</h2>
            
            {success && <div className="alert-success">{success}</div>}
            {error && <div className="alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder={t.name} 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder={t.email} 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="subject" 
                  placeholder={t.subject} 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <textarea 
                  name="message" 
                  placeholder={t.message} 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? t.sending : t.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
