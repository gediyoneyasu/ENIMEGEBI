const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { notifyAdmin, notifyUser } = require('../utils/notificationHelper');

// Public route - Save contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });
    
    await contact.save();

    await notifyAdmin({
      title: 'New Contact Message',
      message: `${name}: ${subject}`,
      type: 'message',
      link: '/admin/messages',
      meta: { contactId: contact._id, email }
    });
    
    console.log('Contact message saved:', contact);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: contact
    });
    
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
});

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Auth header:', req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    console.log('Decoded token:', decoded);
    
    // Check if user is admin (role can be 'admin' or from database)
    if (decoded.role !== 'admin') {
      const user = await User.findById(decoded.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get all messages (Admin only)
router.get('/messages', verifyAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages`);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single message
router.get('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update message (status, reply)
router.put('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, reply } = req.body;
    const updateData = { status };
    if (reply) updateData.reply = reply;
    if (reply) updateData.repliedAt = new Date();
    
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (reply) {
      const user = await User.findOne({ email: message.email });
      if (user) {
        await notifyUser(user._id, {
          title: 'Reply to your message',
          message: reply.substring(0, 120),
          type: 'reply',
          link: '/notifications',
          meta: { contactId: message._id }
        });
      }
    }
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete message
router.delete('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
