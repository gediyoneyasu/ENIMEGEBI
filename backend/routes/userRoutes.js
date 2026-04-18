const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../config/upload');
const User = require('../models/User');
const Order = require('../models/Order');

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone, location, bio } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    
    await user.save();
    
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload avatar
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const user = await User.findById(req.user.id);
    user.avatar = avatarUrl;
    await user.save();
    
    res.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update notification settings
router.put('/settings', protect, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, orderUpdates, promotionalEmails } = req.body;
    
    const user = await User.findById(req.user.id);
    user.settings = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
      orderUpdates: orderUpdates !== undefined ? orderUpdates : true,
      promotionalEmails: promotionalEmails !== undefined ? promotionalEmails : false
    };
    await user.save();
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete account
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user orders
router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
