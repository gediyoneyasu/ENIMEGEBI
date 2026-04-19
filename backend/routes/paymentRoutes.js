const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  initializeOrderPayment,
  initializeProjectPayment,
  verifyOrderPayment,
  verifyProjectPayment,
  webhook
} = require('../controllers/paymentController');

// Webhook (public)
router.post('/webhook', webhook);

// Protected routes
router.post('/initialize-order', protect, initializeOrderPayment);
router.post('/initialize-project', protect, initializeProjectPayment);
router.get('/verify-order/:tx_ref', verifyOrderPayment);
router.get('/verify-project/:tx_ref', verifyProjectPayment);

module.exports = router;
