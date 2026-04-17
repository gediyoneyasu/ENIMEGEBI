import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // This endpoint is now PUBLIC - no token needed
      const response = await axios.post('http://localhost:5001/api/admin/contacts', formData);
      setSuccess('✅ Message sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || '❌ Failed to send message. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container" style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Contact Us</h2>
      <p>Have questions? Send us a message and we'll get back to you!</p>
      
      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
          {success}
        </div>
      )}
      
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Your Full Name *" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Your Email Address *" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          name="subject" 
          placeholder="Subject *" 
          value={formData.subject} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <textarea 
          name="message" 
          placeholder="Your Message *" 
          rows="5" 
          value={formData.message} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
        ></textarea>
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            background: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            padding: '12px 30px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
