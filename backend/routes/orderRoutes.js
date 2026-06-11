const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const { notifyAdmin, notifyUser } = require('../utils/notificationHelper');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, orderReference } = req.body;
    
    const order = await Order.create({
      user: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      items: items,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      orderReference: orderReference || 'ORD-' + Date.now().toString().slice(-8)
    });

    await notifyAdmin({
      title: 'New Order',
      message: `${req.user.name} placed order ${order.orderReference} — ETB ${totalAmount}`,
      type: 'order',
      link: '/admin/orders',
      meta: { orderId: order._id }
    });

    await notifyUser(req.user.id, {
      title: 'Order Placed',
      message: `Your order ${order.orderReference} was received.`,
      type: 'order',
      link: '/orders',
      meta: { orderId: order._id }
    });
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
