const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { initializePayment, verifyPayment, webhook } = require('../controllers/paymentController');

router.post('/initialize', protect, initializePayment);
router.get('/verify/:tx_ref', verifyPayment);
router.post('/webhook', webhook);

module.exports = router;
