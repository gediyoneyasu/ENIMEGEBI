const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrderByReference,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');

// Protected routes
router.use(protect);

// Create order
router.post('/', createOrder);

// Get user orders
router.get('/my-orders', getUserOrders);

// Get order by reference
router.get('/reference/:reference', getOrderByReference);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Update payment status
router.put('/payment/:reference', updatePaymentStatus);

module.exports = router;
