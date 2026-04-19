const Order = require('../models/Order');
const User = require('../models/User');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
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
      orderReference: 'ORD-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by reference
const getOrderByReference = async (req, res) => {
  try {
    const order = await Order.findOne({ orderReference: req.params.reference });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.orderStatus = req.body.status;
    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ orderReference: req.params.reference });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.paymentStatus = req.body.paymentStatus;
    if (req.body.paymentStatus === 'paid') {
      order.orderStatus = 'processing';
      order.paidAt = new Date();
    }
    await order.save();
    res.json({ success: true, message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderByReference,
  updateOrderStatus,
  updatePaymentStatus
};
