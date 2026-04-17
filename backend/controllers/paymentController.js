const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');

// Chapa API configuration
const CHAPA_API_KEY = 'CHASECK_TEST-YourTestKeyHere'; // Replace with your actual Chapa test key
const CHAPA_API_URL = 'https://api.chapa.co/v1';

// Initialize payment
const initializePayment = async (req, res) => {
  try {
    const { orderId, amount, email, name, phone } = req.body;
    
    const tx_ref = uuidv4();
    
    const paymentData = {
      amount: amount,
      currency: 'ETB',
      email: email,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ')[1] || 'Customer',
      tx_ref: tx_ref,
      callback_url: `http://localhost:5001/api/payment/verify/${tx_ref}`,
      return_url: 'http://localhost:5173/orders',
      customization: {
        title: 'Enimegebi Payment',
        description: `Payment for order ${orderId}`
      }
    };
    
    const response = await axios.post(`${CHAPA_API_URL}/transaction/initialize`, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.status === 'success') {
      // Save transaction reference to order
      await Order.findByIdAndUpdate(orderId, { 
        transactionRef: tx_ref,
        paymentStatus: 'pending'
      });
      
      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_API_KEY}`
      }
    });
    
    if (response.data.status === 'success') {
      // Update order payment status
      await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        { paymentStatus: 'paid', orderStatus: 'processing' }
      );
      
      res.redirect('http://localhost:5173/orders?payment=success');
    } else {
      res.redirect('http://localhost:5173/checkout?payment=failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.redirect('http://localhost:5173/checkout?payment=failed');
  }
};

// Webhook for Chapa
const webhook = async (req, res) => {
  try {
    const event = req.body;
    
    if (event.event === 'charge.success') {
      await Order.findOneAndUpdate(
        { transactionRef: event.data.tx_ref },
        { paymentStatus: 'paid', orderStatus: 'processing' }
      );
    }
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error' });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  webhook
};
