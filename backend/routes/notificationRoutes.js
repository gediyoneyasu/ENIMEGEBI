const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { notifyUser } = require('../utils/notificationHelper');

router.get('/', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? { recipientType: 'admin' }
      : { recipientType: 'user', userId: req.user.id };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/unread-count', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? { recipientType: 'admin', read: false }
      : { recipientType: 'user', userId: req.user.id, read: false };

    const count = await Notification.countDocuments(query);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const allowed = isAdmin
      ? notification.recipientType === 'admin'
      : notification.recipientType === 'user' && String(notification.userId) === String(req.user.id);

    if (!allowed) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    notification.read = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/read-all', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? { recipientType: 'admin', read: false }
      : { recipientType: 'user', userId: req.user.id, read: false };

    await Notification.updateMany(query, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { title, message, userId, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const notification = await notifyUser(userId, {
        title,
        message,
        type: 'broadcast',
        link: link || '/notifications'
      });
      return res.status(201).json({ success: true, notification });
    }

    const users = await User.find({ role: { $ne: 'admin' } }).select('_id');
    const notifications = await Promise.all(
      users.map((u) =>
        notifyUser(u._id, {
          title,
          message,
          type: 'broadcast',
          link: link || '/notifications'
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `Sent to ${notifications.length} users`,
      count: notifications.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
