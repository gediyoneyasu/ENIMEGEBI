const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// Create order (protected - user must be logged in)
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || 'cash'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully!',
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders (protected)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
