import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const HomeSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('import.meta.env.VITE_API_URL/api/home/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put('import.meta.env.VITE_API_URL/api/home/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setAlert({ type: 'error', message: 'Failed to save settings' });
    }
  };

  if (loading) return <div className="loading-spinner">Loading settings...</div>;

  return (
    <div className="home-settings">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-settings-line"></i> Home Page Settings</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3><i className="ri-global-line"></i> Hero Section</h3>
          <div className="setting-item"><label>Hero Title (English)</label><input type="text" name="heroTitle" value={settings.heroTitle || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Hero Title (Amharic)</label><input type="text" name="heroTitleAm" value={settings.heroTitleAm || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Hero Subtitle (English)</label><input type="text" name="heroSubtitle" value={settings.heroSubtitle || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Hero Subtitle (Amharic)</label><input type="text" name="heroSubtitleAm" value={settings.heroSubtitleAm || ''} onChange={handleChange} /></div>
        </div>

        <div className="settings-section">
          <h3><i className="ri-mail-line"></i> Contact Information</h3>
          <div className="setting-item"><label>Phone Number</label><input type="text" name="phone" value={settings.phone || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Email</label><input type="email" name="email" value={settings.email || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Address (English)</label><input type="text" name="address" value={settings.address || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Address (Amharic)</label><input type="text" name="addressAm" value={settings.addressAm || ''} onChange={handleChange} /></div>
        </div>

        <div className="settings-section">
          <h3><i className="ri-share-line"></i> Social Media Links</h3>
          <div className="setting-item"><label>Facebook</label><input type="url" name="facebook" value={settings.facebook || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Twitter</label><input type="url" name="twitter" value={settings.twitter || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Instagram</label><input type="url" name="instagram" value={settings.instagram || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>Telegram</label><input type="url" name="telegram" value={settings.telegram || ''} onChange={handleChange} /></div>
        </div>

        <div className="settings-section">
          <h3><i className="ri-megaphone-line"></i> CTA Section</h3>
          <div className="setting-item"><label>CTA Title (English)</label><input type="text" name="ctaTitle" value={settings.ctaTitle || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>CTA Title (Amharic)</label><input type="text" name="ctaTitleAm" value={settings.ctaTitleAm || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>CTA Subtitle (English)</label><input type="text" name="ctaSubtitle" value={settings.ctaSubtitle || ''} onChange={handleChange} /></div>
          <div className="setting-item"><label>CTA Subtitle (Amharic)</label><input type="text" name="ctaSubtitleAm" value={settings.ctaSubtitleAm || ''} onChange={handleChange} /></div>
        </div>

        <div className="modal-actions">
          <button type="submit" className="btn-save">Save All Settings</button>
        </div>
      </form>
    </div>
  );
};

export default HomeSettings;
