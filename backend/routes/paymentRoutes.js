const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  initializePayment, 
  verifyPayment, 
  webhook,
  getPaymentStatus 
} = require('../controllers/paymentController');

// Public webhook endpoint (no auth needed)
router.post('/webhook', webhook);

// Protected routes
router.post('/initialize', protect, initializePayment);
router.get('/verify/:tx_ref', verifyPayment);
router.get('/status/:orderId', protect, getPaymentStatus);

module.exports = router;
