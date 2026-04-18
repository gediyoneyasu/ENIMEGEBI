import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './Profile.css';

function Profile() {
  const { language, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

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
      confirmDelete: 'Confirm Delete',
      profileUpdated: 'Profile updated successfully!',
      passwordUpdated: 'Password updated successfully!',
      passwordMismatch: 'New passwords do not match!',
      wrongPassword: 'Current password is incorrect!',
      uploadPhoto: 'Upload Photo',
      changePhoto: 'Change Photo',
      orderId: 'Order ID',
      date: 'Date',
      total: 'Total',
      status: 'Status',
      viewDetails: 'View Details',
      close: 'Close',
      remove: 'Remove',
      addToCart: 'Add to Cart',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings saved successfully!',
      deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
      accountDeleted: 'Account deleted successfully',
      loading: 'Loading...',
      profileUpdateSuccess: 'Profile updated successfully!',
      profileUpdateError: 'Failed to update profile',
      imageUploadSuccess: 'Profile picture updated successfully!',
      imageUploadError: 'Failed to upload image'
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
      confirmDelete: 'መሰረዝ አረጋግጥ',
      profileUpdated: 'መገለጫ በተሳካ ሁኔታ ዘምኗል!',
      passwordUpdated: 'የይለፍ ቃል በተሳካ ሁኔታ ተለውጧል!',
      passwordMismatch: 'አዲሶቹ የይለፍ ቃላት አይዛመዱም!',
      wrongPassword: 'አሁን ያለው የይለፍ ቃል ትክክል አይደለም!',
      uploadPhoto: 'ስዕል ስቀል',
      changePhoto: 'ስዕል ቀይር',
      orderId: 'የትዕዛዝ መለያ',
      date: 'ቀን',
      total: 'ጠቅላላ',
      status: 'ሁኔታ',
      viewDetails: 'ዝርዝር ይመልከቱ',
      close: 'ዝጋ',
      remove: 'አስወግድ',
      addToCart: 'ወደ ጋሪ ጨምር',
      saveSettings: 'ቅንብሮችን አስቀምጥ',
      settingsSaved: 'ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል!',
      deleteConfirm: 'መለያዎን መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት? ይህ ተግባር ሊቀለበስ አይችልም።',
      accountDeleted: 'መለያ በተሳካ ሁኔታ ተሰርዟል',
      loading: 'በመጫን ላይ...',
      profileUpdateSuccess: 'መገለጫ በተሳካ ሁኔታ ዘምኗል!',
      profileUpdateError: 'መገለጫ ማዘመን አልተሳካም',
      imageUploadSuccess: 'የመገለጫ ስዕል በተሳካ ሁኔታ ተለውጧል!',
      imageUploadError: 'ስዕል መስቀል አልተሳካም'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          location: response.data.user.location || '',
          bio: response.data.user.bio || ''
        });
        if (response.data.user.settings) {
          setNotificationSettings(response.data.user.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback to localStorage
      const userData = localStorage.getItem('enimegebiUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          location: parsedUser.location || '',
          bio: parsedUser.bio || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/users/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataImg = new FormData();
    formDataImg.append('avatar', file);

    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.post('http://localhost:5001/api/users/avatar', formDataImg, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setUser({ ...user, avatar: response.data.avatar });
        alert(t.imageUploadSuccess);
        fetchUserData();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(t.imageUploadError);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.put('http://localhost:5001/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('enimegebiUser', JSON.stringify(response.data.user));
        setIsEditing(false);
        alert(t.profileUpdateSuccess);
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t.profileUpdateError);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put('http://localhost:5001/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordSuccess(t.passwordUpdated);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || t.wrongPassword);
      setTimeout(() => setPasswordError(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete('http://localhost:5001/api/users/account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.removeItem('enimegebiToken');
        localStorage.removeItem('enimegebiUser');
        alert(t.accountDeleted);
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put('http://localhost:5001/api/users/settings', notificationSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(t.settingsSaved);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>{t.loading}</p>
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

        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <i className="ri-user-line"></i> {t.profile}
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <i className="ri-shopping-bag-line"></i> {t.orders}
          </button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <i className="ri-settings-line"></i> {t.settings}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <img src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={user?.name} />
                  <label className="avatar-upload">
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    <i className="ri-camera-line"></i>
                  </label>
                </div>
                {uploadingImage && <p className="uploading-text">Uploading...</p>}
              </div>
              
              <div className="profile-info">
                {!isEditing ? (
                  <>
                    <h2>{user?.name}</h2>
                    <p><i className="ri-mail-line"></i> {user?.email}</p>
                    <p><i className="ri-phone-line"></i> {user?.phone || 'Not set'}</p>
                    <p><i className="ri-map-pin-line"></i> {user?.location || 'Not set'}</p>
                    <p><i className="ri-information-line"></i> {user?.bio || 'No bio yet'}</p>
                    <p className="member-since"><i className="ri-calendar-line"></i> {t.memberSince}: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <i className="ri-edit-line"></i> {t.editProfile}
                    </button>
                  </>
                ) : (
                  <div className="edit-form">
                    <div className="form-group"><label>{t.fullName}</label><input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="form-group"><label>{t.email}</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
                    <div className="form-group"><label>{t.phone}</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div>
                    <div className="form-group"><label>{t.location}</label><input type="text" name="location" value={formData.location} onChange={handleChange} /></div>
                    <div className="form-group"><label>{t.bio}</label><textarea name="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea></div>
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleSaveProfile}>{t.saveChanges}</button>
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
            {orders.length === 0 ? (
              <div className="empty-orders">
                <i className="ri-shopping-bag-line"></i>
                <h3>{t.noOrders}</h3>
                <Link to="/products" className="shop-btn">{t.startShopping}</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item-card">
                    <div className="order-header-info">
                      <span className="order-ref">{order.orderReference}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>{getStatusText(order.orderStatus)}</span>
                    </div>
                    <div className="order-items-preview">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="order-preview-item">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && <div className="more-items">+{order.items.length - 2} more</div>}
                    </div>
                    <div className="order-footer-info">
                      <div className="order-total"><strong>{t.total}:</strong> ETB {order.totalAmount.toFixed(2)}</div>
                      <Link to={`/orders/${order.orderReference}`} className="view-order-btn">{t.viewDetails}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="settings-card">
              <h3><i className="ri-notification-line"></i> {t.notifications}</h3>
              <label className="toggle-switch">
                <input type="checkbox" checked={notificationSettings.emailNotifications} onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})} />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.emailNotifications}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" checked={notificationSettings.smsNotifications} onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})} />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.smsNotifications}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" checked={notificationSettings.orderUpdates} onChange={(e) => setNotificationSettings({...notificationSettings, orderUpdates: e.target.checked})} />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.orderUpdates}</span>
              </label>
              <label className="toggle-switch">
                <input type="checkbox" checked={notificationSettings.promotionalEmails} onChange={(e) => setNotificationSettings({...notificationSettings, promotionalEmails: e.target.checked})} />
                <span className="toggle-slider"></span>
                <span className="toggle-label">{t.promotionalEmails}</span>
              </label>
              <button className="save-settings-btn" onClick={handleSaveSettings}>{t.saveSettings}</button>
            </div>

            <div className="settings-card">
              <h3><i className="ri-global-line"></i> {t.language}</h3>
              <div className="language-options">
                <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>{t.english}</button>
                <button className={`lang-option ${language === 'am' ? 'active' : ''}`} onClick={() => handleLanguageChange('am')}>{t.amharic}</button>
              </div>
            </div>

            <div className="settings-card">
              <h3><i className="ri-lock-line"></i> {t.changePassword}</h3>
              {passwordError && <div className="password-error">{passwordError}</div>}
              {passwordSuccess && <div className="password-success">{passwordSuccess}</div>}
              <div className="form-group"><input type="password" name="currentPassword" placeholder={t.currentPassword} value={passwordData.currentPassword} onChange={handlePasswordChange} /></div>
              <div className="form-group"><input type="password" name="newPassword" placeholder={t.newPassword} value={passwordData.newPassword} onChange={handlePasswordChange} /></div>
              <div className="form-group"><input type="password" name="confirmPassword" placeholder={t.confirmPassword} value={passwordData.confirmPassword} onChange={handlePasswordChange} /></div>
              <button className="update-password-btn" onClick={handleUpdatePassword}>{t.updatePassword}</button>
            </div>

            <div className="settings-card danger-zone">
              <h3><i className="ri-delete-bin-line"></i> {t.deleteAccount}</h3>
              <p>{t.deleteWarning}</p>
              <button className="delete-btn" onClick={handleDeleteAccount}>{t.confirmDelete}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
