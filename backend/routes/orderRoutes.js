const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { orderReference, items, totalAmount, fullName, email, phone, address, city, paymentMethod } = req.body;
    
    const order = await Order.create({
      user: req.user.id,
      userEmail: email || req.user.email,
      userName: fullName || req.user.name,
      orderReference: orderReference,
      items: items,
      totalAmount: totalAmount,
      shippingAddress: { street: address, city, phone },
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'chapa' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully!',
      order 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order by reference
router.get('/:reference', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderReference: req.params.reference });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
