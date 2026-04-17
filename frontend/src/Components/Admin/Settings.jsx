import React from 'react';

const Settings = () => {
  return (
    <div className="settings-management">
      <h2>System Settings</h2>
      
      <div className="settings-section">
        <h3>General Settings</h3>
        <div className="setting-item">
          <label>Site Name</label>
          <input type="text" defaultValue="Enimegebi" />
        </div>
        <div className="setting-item">
          <label>Site Email</label>
          <input type="email" defaultValue="admin@enimegebi.com" />
        </div>
        <div className="setting-item">
          <label>Currency</label>
          <select>
            <option>USD ($)</option>
            <option>ETB (Br)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notification Settings</h3>
        <div className="setting-item">
          <label>
            <input type="checkbox" /> Email notifications for new orders
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" /> SMS for critical alerts
          </label>
        </div>
      </div>

      <button className="save-btn">Save Changes</button>
    </div>
  );
};

export default Settings;
