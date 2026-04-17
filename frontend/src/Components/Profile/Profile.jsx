import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Profile.css';

function Profile() {
  const { language, changeLanguage } = useLanguage();  // Use context instead of local state
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    // Mock user data - in production, fetch from API
    const userData = {
      name: 'Gedu',
      email: 'gediyoneyasu54@gmail.com',
      phone: '+251 96 411 3416',
      location: 'Hawassa, Ethiopia',
      bio: 'Food lover and local produce enthusiast. Supporting Ethiopian farmers!',
      memberSince: '2024-01-15',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    };
    
    setUser(userData);
    setFormData(userData);
    setLoading(false);
  }, []);

  const translations = {
    en: {
      title: 'My Profile',
      subtitle: 'Manage your account information',
      profile: 'Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      settings: 'Settings',
      personalInfo: 'Personal Information',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      location: 'Location',
      bio: 'Bio',
      memberSince: 'Member since',
      orderHistory: 'Order History',
      noOrders: 'No orders yet',
      startShopping: 'Start Shopping',
      wishlistEmpty: 'Your wishlist is empty',
      browseProducts: 'Browse Products',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      smsNotifications: 'SMS Notifications',
      orderUpdates: 'Order Updates',
      promotionalEmails: 'Promotional Emails',
      language: 'Language',
      english: 'English',
      amharic: 'Amharic',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updatePassword: 'Update Password',
      deleteAccount: 'Delete Account',
      deleteWarning: 'Once you delete your account, there is no going back.',
      confirmDelete: 'Confirm Delete'
    },
    am: {
      title: 'መገለጫዬ',
      subtitle: 'የመለያ መረጃዎን ያስተዳድሩ',
      profile: 'መገለጫ',
      orders: 'ትዕዛዞች',
      wishlist: 'የምኞት ዝርዝር',
      settings: 'ቅንብሮች',
      personalInfo: 'የግል መረጃ',
      editProfile: 'መገለጫ አርትዕ',
      saveChanges: 'ለውጦችን አስቀምጥ',
      cancel: 'ሰርዝ',
      fullName: 'ሙሉ ስም',
      email: 'ኢሜይል',
      phone: 'ስልክ ቁጥር',
      location: 'አድራሻ',
      bio: 'ስለእኔ',
      memberSince: 'አባል የሆንከው',
      orderHistory: 'የትዕዛዝ ታሪክ',
      noOrders: 'እስካሁን ምንም ትዕዛዝ የለም',
      startShopping: 'ግዢ ይጀምሩ',
      wishlistEmpty: 'የምኞት ዝርዝርዎ ባዶ ነው',
      browseProducts: 'ምርቶችን ይመልከቱ',
      notifications: 'ማሳወቂያዎች',
      emailNotifications: 'የኢሜይል ማሳወቂያዎች',
      smsNotifications: 'የኤስኤምኤስ ማሳወቂያዎች',
      orderUpdates: 'የትዕዛዝ ማዘመኛዎች',
      promotionalEmails: 'የማስተዋወቂያ ኢሜይሎች',
      language: 'ቋንቋ',
      english: 'እንግሊዝኛ',
      amharic: 'አማርኛ',
      changePassword: 'የይለፍ ቃል ቀይር',
      currentPassword: 'አሁን ያለው የይለፍ ቃል',
      newPassword: 'አዲስ የይለፍ ቃል',
      confirmPassword: 'አዲስ የይለፍ ቃል አረጋግጥ',
      updatePassword: 'የይለፍ ቃል አዘምን',
      deleteAccount: 'መለያ ሰርዝ',
      deleteWarning: 'መለያዎን ከሰረዙ በኋላ ወደ ነበረበት መመለስ አይቻልም።',
      confirmDelete: 'መሰረዝ አረጋግጥ'
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);  // Use context function instead of local
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <i className="ri-user-line"></i> {t.profile}
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <i className="ri-shopping-bag-line"></i> {t.orders}
          </button>
          <button className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
            <i className="ri-heart-line"></i> {t.wishlist}
          </button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <i className="ri-settings-line"></i> {t.settings}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <img src={user?.avatar} alt={user?.name} />
              </div>
              <div className="profile-info">
                {!isEditing ? (
                  <>
                    <h2>{user?.name}</h2>
                    <p><i className="ri-mail-line"></i> {user?.email}</p>
                    <p><i className="ri-phone-line"></i> {user?.phone}</p>
                    <p><i className="ri-map-pin-line"></i> {user?.location}</p>
                    <p><i className="ri-information-line"></i> {user?.bio}</p>
                    <p className="member-since"><i className="ri-calendar-line"></i> {t.memberSince}: {new Date(user?.memberSince).toLocaleDateString()}</p>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <i className="ri-edit-line"></i> {t.editProfile}
                    </button>
                  </>
                ) : (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>{t.fullName}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>{t.email}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>{t.phone}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>{t.location}</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>{t.bio}</label>
                      <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea>
                    </div>
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleSave}>{t.saveChanges}</button>
                      <button className="cancel-btn" onClick={() => setIsEditing(false)}>{t.cancel}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="empty-orders">
              <i className="ri-shopping-bag-line"></i>
              <h3>{t.noOrders}</h3>
              <Link to="/products" className="shop-btn">{t.startShopping}</Link>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="wishlist-content">
            <div className="empty-wishlist">
              <i className="ri-heart-line"></i>
              <h3>{t.wishlistEmpty}</h3>
              <Link to="/products" className="browse-btn">{t.browseProducts}</Link>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="settings-card">
              <h3>{t.notifications}</h3>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.emailNotifications}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.smsNotifications}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.orderUpdates}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.promotionalEmails}</span>
              </label>
            </div>

            <div className="settings-card">
              <h3>{t.language}</h3>
              <div className="language-options">
                <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>
                  {t.english}
                </button>
                <button className={`lang-option ${language === 'am' ? 'active' : ''}`} onClick={() => handleLanguageChange('am')}>
                  {t.amharic}
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h3>{t.changePassword}</h3>
              <div className="form-group">
                <input type="password" placeholder={t.currentPassword} />
              </div>
              <div className="form-group">
                <input type="password" placeholder={t.newPassword} />
              </div>
              <div className="form-group">
                <input type="password" placeholder={t.confirmPassword} />
              </div>
              <button className="update-password-btn">{t.updatePassword}</button>
            </div>

            <div className="settings-card danger-zone">
              <h3>{t.deleteAccount}</h3>
              <p>{t.deleteWarning}</p>
              <button className="delete-btn">{t.confirmDelete}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;