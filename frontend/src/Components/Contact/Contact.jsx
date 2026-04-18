import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../main'
import './Contact.css';

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

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      getInTouch: 'Get in Touch',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      workingHours: 'Working Hours',
      monFri: 'Monday - Friday: 9:00 AM - 6:00 PM',
      sat: 'Saturday: 10:00 AM - 4:00 PM',
      sun: 'Sunday: Closed',
      sendMessage: 'Send us a Message',
      yourName: 'Your Name',
      yourEmail: 'Email Address',
      subject: 'Subject',
      yourMessage: 'Your Message',
      sendBtn: 'Send Message',
      sending: 'Sending...',
      successMsg: 'Message sent successfully! We will contact you soon.',
      errorMsg: 'Failed to send message. Please try again.',
      placeholder: 'Write your message here...',
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email address',
      subjectPlaceholder: 'What is this regarding?'
    },
    am: {
      title: 'ያግኙን',
      subtitle: 'ጥያቄዎች አሉዎት? ከእኛ ጋር መገናኘት እንወዳለን። መልእክት ይላኩልን በተቻለ ፍጥነት ምላሽ እንሰጣለን።',
      getInTouch: 'ያግኙን',
      address: 'አድራሻ',
      phone: 'ስልክ',
      email: 'ኢሜይል',
      workingHours: 'የስራ ሰዓት',
      monFri: 'ሰኞ - አርብ: 9:00 ጠዋት - 6:00 ማታ',
      sat: 'ቅዳሜ: 10:00 ጠዋት - 4:00 ማታ',
      sun: 'እሁድ: ዝግ ነው',
      sendMessage: '��ልእክት ይላኩልን',
      yourName: 'ሙሉ ስም',
      yourEmail: 'ኢሜይል አድራሻ',
      subject: 'ርዕስ',
      yourMessage: 'መልእክት',
      sendBtn: 'መልእክት ላክ',
      sending: 'በመላክ ላይ...',
      successMsg: 'መልእክትዎ በተሳካ ሁኔታ ተልኳል! በቅርቡ እናገኝዎታለን።',
      errorMsg: 'መልእክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
      placeholder: 'መልእክትዎን እዚህ ይጻፉ...',
      namePlaceholder: 'ሙሉ ስምዎን ያስገቡ',
      emailPlaceholder: 'ኢሜይል አድራሻዎን ያስገቡ',
      subjectPlaceholder: 'ይህ ምንን ይመለከታል?'
    }
  };

  const t = translations[language];

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
      const response = await axios.post('import.meta.env.VITE_API_URL/api/admin/contacts', formData);
      setSuccess(t.successMsg);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error:', err);
      setError(t.errorMsg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h2><i className="ri-information-line"></i>{t.getInTouch}</h2>
          
          <div className="contact-detail">
            <i className="ri-map-pin-line"></i>
            <div><strong>{t.address}</strong><p>Addis Ababa, Ethiopia</p></div>
          </div>
          
          <div className="contact-detail">
            <i className="ri-phone-line"></i>
            <div><strong>{t.phone}</strong><p>+251-911-123456</p></div>
          </div>
          
          <div className="contact-detail">
            <i className="ri-mail-line"></i>
            <div><strong>{t.email}</strong><p>info@enimegebi.com</p></div>
          </div>
          
          <div className="contact-detail">
            <i className="ri-time-line"></i>
            <div>
              <strong>{t.workingHours}</strong>
              <p>{t.monFri}</p>
              <p>{t.sat}</p>
              <p>{t.sun}</p>
            </div>
          </div>

          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="ri-facebook-line"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="ri-twitter-line"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="ri-instagram-line"></i></a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link"><i className="ri-telegram-line"></i></a>
          </div>
        </div>

        <div className="contact-form-card">
          <h2><i className="ri-mail-send-line"></i>{t.sendMessage}</h2>
          
          {success && <div className="success-message"><i className="ri-checkbox-circle-line"></i><span>{success}</span></div>}
          {error && <div className="error-message"><i className="ri-error-warning-line"></i><span>{error}</span></div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><i className="ri-user-line"></i>{t.yourName}</label>
              <input type="text" name="name" placeholder={t.namePlaceholder} value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label><i className="ri-mail-line"></i>{t.yourEmail}</label>
              <input type="email" name="email" placeholder={t.emailPlaceholder} value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label><i className="ri-chat-1-line"></i>{t.subject}</label>
              <input type="text" name="subject" placeholder={t.subjectPlaceholder} value={formData.subject} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label><i className="ri-message-line"></i>{t.yourMessage}</label>
              <textarea name="message" placeholder={t.placeholder} value={formData.message} onChange={handleChange} required rows="5" />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><i className="ri-loader-4-line ri-spin"></i>{t.sending}</> : <>{t.sendBtn}<i className="ri-arrow-right-line"></i></>}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.442543441805!2d38.757889!3d9.030000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85e3b8b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" allowFullScreen="" loading="lazy" title="Enimegebi Location"></iframe>
      </div>
    </div>
  );
};

export default Contact;
