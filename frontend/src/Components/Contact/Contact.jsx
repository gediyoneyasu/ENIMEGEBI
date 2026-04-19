import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../main';
import './Contact.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

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
      const response = await axios.post(`${API_URL}/api/admin/contacts`, formData);
      setSuccess('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'Have questions? We\'d love to hear from you.',
      name: 'Your Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...'
    },
    am: {
      title: 'ያግኙን',
      subtitle: 'ጥያቄዎች አሉዎት? ከእኛ ጋር መገናኘት እንወዳለን።',
      name: 'ስምዎ',
      email: 'ኢሜይል',
      subject: 'ርዕስ',
      message: 'መልእክት',
      send: 'መልእክት ላክ',
      sending: 'በመላክ ላይ...'
    }
  };

  const t = translations[language];

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <div className="contact-detail"><i className="ri-map-pin-line"></i><div><strong>Address</strong><p>Addis Ababa, Ethiopia</p></div></div>
          <div className="contact-detail"><i className="ri-phone-line"></i><div><strong>Phone</strong><p>+251-911-123456</p></div></div>
          <div className="contact-detail"><i className="ri-mail-line"></i><div><strong>Email</strong><p>info@enimegebi.com</p></div></div>
        </div>

        <div className="contact-form-card">
          <h2>Send us a Message</h2>
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group"><input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><input type="email" name="email" placeholder={t.email} value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><input type="text" name="subject" placeholder={t.subject} value={formData.subject} onChange={handleChange} required /></div>
            <div className="form-group"><textarea name="message" placeholder={t.message} rows="5" value={formData.message} onChange={handleChange} required></textarea></div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? t.sending : t.send}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
