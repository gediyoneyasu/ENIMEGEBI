const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, address, city, pickupPoint, paymentMethod, notes } = req.body;
    
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.id);
      if (product) {
        orderItems.push({
          product: product._id,
          name: product.name,
          nameAm: product.nameAm,
          price: product.price,
          quantity: item.quantity,
          unit: product.unit,
          image: product.image
        });
        subtotal += product.price * item.quantity;
      }
    }
    
    const deliveryFee = deliveryMethod === 'delivery' ? (subtotal > 500 ? 0 : 50) : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;
    
    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod,
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : '',
      city: deliveryMethod === 'delivery' ? city : '',
      pickupPoint: deliveryMethod === 'pickup' ? pickupPoint : '',
      notes,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };