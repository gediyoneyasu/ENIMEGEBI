const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');

// Chapa API configuration
const CHAPA_API_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Initialize payment with Chapa
const initializePayment = async (req, res) => {
  try {
    console.log('Payment initialization request received:', req.body);
    
    const { orderId, amount, email, name, phone } = req.body;
    
    // Generate unique transaction reference
    const tx_ref = 'CHAPA-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    const paymentData = {
      amount: amount,
      currency: 'ETB',
      email: email,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ')[1] || 'Customer',
      phone_number: phone,
      tx_ref: tx_ref,
      callback_url: `http://localhost:5001/api/payment/verify/${tx_ref}`,
      return_url: `http://localhost:5173/orders?payment=success&order=${orderId}`,
      customization: {
        title: 'Enimegebi Pay',  // Shortened to 14 characters (was 16+)
        description: `Order ${orderId.slice(-8)}`
      }
    };
    
    console.log('Sending payment request to Chapa:', paymentData);
    
    const response = await axios.post(`${CHAPA_API_URL}/transaction/initialize`, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Chapa response:', response.data);
    
    if (response.data.status === 'success') {
      // Save transaction reference to order
      await Order.findOneAndUpdate(
        { orderReference: orderId },
        { 
          transactionRef: tx_ref,
          paymentStatus: 'pending'
        }
      );
      
      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      console.error('Chapa initialization failed:', response.data);
      res.status(400).json({ 
        success: false, 
        message: response.data.message || 'Payment initialization failed' 
      });
    }
  } catch (error) {
    console.error('Payment error details:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || error.message 
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    console.log('Verifying payment for tx_ref:', tx_ref);
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      }
    });
    
    console.log('Verification response:', response.data);
    
    if (response.data.status === 'success') {
      // Update order payment status
      const order = await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        { 
          paymentStatus: 'paid', 
          orderStatus: 'processing',
          paidAt: new Date()
        },
        { new: true }
      );
      
      // Redirect to frontend with success
      res.redirect(`http://localhost:5173/orders?payment=success&order=${order.orderReference}`);
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
    console.log('Webhook received:', event);
    
    if (event.event === 'charge.success') {
      await Order.findOneAndUpdate(
        { transactionRef: event.data.tx_ref },
        { 
          paymentStatus: 'paid', 
          orderStatus: 'processing',
          paidAt: new Date(),
          paymentDetails: event.data
        }
      );
    }
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error' });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderReference: orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      paidAt: order.paidAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  webhook,
  getPaymentStatus
};
