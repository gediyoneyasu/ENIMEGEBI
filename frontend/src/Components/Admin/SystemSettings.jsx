import React, { useState } from 'react';
import './AdminPages.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Enimegebi',
    siteDescription: 'Ethiopian Organic Products Marketplace',
    adminEmail: 'admin@enimegebi.com',
    currency: 'USD',
    taxRate: 15,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    enableUserRegistration: true,
    enableGuestCheckout: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({ type: 'success', message: 'Settings saved successfully!' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleReset = () => {
    setSettings({
      siteName: 'Enimegebi',
      siteDescription: 'Ethiopian Organic Products Marketplace',
      adminEmail: 'admin@enimegebi.com',
      currency: 'USD',
      taxRate: 15,
      shippingFee: 5.99,
      freeShippingThreshold: 50,
      enableUserRegistration: true,
      enableGuestCheckout: true,
      emailNotifications: true,
      smsNotifications: false,
      maintenanceMode: false
    });
    setAlert({ type: 'warning', message: 'Settings reset to default!' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="settings-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-settings-3-line"></i> System Settings</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3><i className="ri-global-line"></i> General Settings</h3>
          <div className="setting-item"><label>Site Name</label><input type="text" name="siteName" value={settings.siteName} onChange={handleChange} /></div>
          <div className="setting-item"><label>Site Description</label><textarea name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows="2"></textarea></div>
          <div className="setting-item"><label>Admin Email</label><input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} /></div>
          <div className="setting-item"><label>Currency</label><select name="currency" value={settings.currency} onChange={handleChange}><option>USD</option><option>ETB</option><option>EUR</option></select></div>
        </div>

        <div className="settings-section">
          <h3><i className="ri-money-dollar-circle-line"></i> Pricing Settings</h3>
          <div className="setting-item"><label>Tax Rate (%)</label><input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} step="0.5" /></div>
          <div className="setting-item"><label>Shipping Fee ($)</label><input type="number" name="shippingFee" value={settings.shippingFee} onChange={handleChange} step="0.01" /></div>
          <div className="setting-item"><label>Free Shipping Threshold ($)</label><input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} /></div>
        </div>

        <div className="settings-section">
          <h3><i className="ri-toggle-line"></i> System Features</h3>
          <div className="setting-item"><label>Enable User Registration</label><label className="switch"><input type="checkbox" name="enableUserRegistration" checked={settings.enableUserRegistration} onChange={handleChange} /><span className="slider"></span></label></div>
          <div className="setting-item"><label>Enable Guest Checkout</label><label className="switch"><input type="checkbox" name="enableGuestCheckout" checked={settings.enableGuestCheckout} onChange={handleChange} /><span className="slider"></span></label></div>
          <div className="setting-item"><label>Email Notifications</label><label className="switch"><input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} /><span className="slider"></span></label></div>
          <div className="setting-item"><label>SMS Notifications</label><label className="switch"><input type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange} /><span className="slider"></span></label></div>
          <div className="setting-item"><label>Maintenance Mode</label><label className="switch"><input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} /><span className="slider"></span></label></div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn-reset" onClick={handleReset}>Reset to Default</button>
          <button type="submit" className="btn-save-settings">Save All Settings</button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
