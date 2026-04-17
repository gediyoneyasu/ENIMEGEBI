import React, { useState } from 'react';
import './AdminPages.css';

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    email: 'info@enimegebi.com',
    phone: '+251-911-123456',
    whatsapp: '+251-911-123456',
    address: 'Addis Ababa, Ethiopia',
    workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    facebook: 'https://facebook.com/enimegebi',
    twitter: 'https://twitter.com/enimegebi',
    instagram: 'https://instagram.com/enimegebi'
  });
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
    setAlert({ type: 'success', message: 'Contact information updated successfully!' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="contact-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-mail-send-line"></i> Contact Information</h2>
        {!editing && (
          <button className="add-btn" onClick={() => setEditing(true)}>
            <i className="ri-edit-line"></i> Edit Information
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="contact-form-section">
            <h3><i className="ri-mail-line"></i> Contact Details</h3>
            <div className="contact-form">
              <div className="form-group"><label>Email Address</label><input type="email" name="email" value={contactInfo.email} onChange={handleChange} required /></div>
              <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={contactInfo.phone} onChange={handleChange} required /></div>
              <div className="form-group"><label>WhatsApp</label><input type="text" name="whatsapp" value={contactInfo.whatsapp} onChange={handleChange} /></div>
              <div className="form-group"><label>Address</label><input type="text" name="address" value={contactInfo.address} onChange={handleChange} required /></div>
              <div className="form-group"><label>Working Hours</label><input type="text" name="workingHours" value={contactInfo.workingHours} onChange={handleChange} required /></div>
            </div>
          </div>

          <div className="contact-form-section">
            <h3><i className="ri-global-line"></i> Social Media Links</h3>
            <div className="contact-form">
              <div className="form-group"><label>Facebook</label><input type="url" name="facebook" value={contactInfo.facebook} onChange={handleChange} /></div>
              <div className="form-group"><label>Twitter</label><input type="url" name="twitter" value={contactInfo.twitter} onChange={handleChange} /></div>
              <div className="form-group"><label>Instagram</label><input type="url" name="instagram" value={contactInfo.instagram} onChange={handleChange} /></div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      ) : (
        <>
          <div className="contact-info-grid">
            <div className="contact-card">
              <h3><i className="ri-mail-line"></i> Contact Details</h3>
              <div className="contact-detail"><i className="ri-mail-line"></i><div><strong>Email</strong><br/>{contactInfo.email}</div></div>
              <div className="contact-detail"><i className="ri-phone-line"></i><div><strong>Phone</strong><br/>{contactInfo.phone}</div></div>
              <div className="contact-detail"><i className="ri-whatsapp-line"></i><div><strong>WhatsApp</strong><br/>{contactInfo.whatsapp}</div></div>
              <div className="contact-detail"><i className="ri-map-pin-line"></i><div><strong>Address</strong><br/>{contactInfo.address}</div></div>
              <div className="contact-detail"><i className="ri-time-line"></i><div><strong>Working Hours</strong><br/>{contactInfo.workingHours}</div></div>
            </div>

            <div className="contact-card">
              <h3><i className="ri-global-line"></i> Social Media</h3>
              <div className="contact-detail"><i className="ri-facebook-line"></i><div><strong>Facebook</strong><br/><a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">{contactInfo.facebook}</a></div></div>
              <div className="contact-detail"><i className="ri-twitter-line"></i><div><strong>Twitter</strong><br/><a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">{contactInfo.twitter}</a></div></div>
              <div className="contact-detail"><i className="ri-instagram-line"></i><div><strong>Instagram</strong><br/><a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">{contactInfo.instagram}</a></div></div>
            </div>
          </div>

          <div className="contact-form-section">
            <h3><i className="ri-question-line"></i> Need Help?</h3>
            <p>For any inquiries or support, please contact us using the information above. We typically respond within 24 hours.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactInfo;
