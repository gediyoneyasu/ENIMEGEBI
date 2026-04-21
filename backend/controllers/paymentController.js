const axios = require('axios');
const Order = require('../models/Order');
const Project = require('../models/Project');

const CHAPA_API_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Initialize payment for order (product checkout)
const initializeOrderPayment = async (req, res) => {
  try {
    console.log('Payment request received:', req.body);
    
    const { orderId, amount, email, name, phone } = req.body;
    
    // Validate required fields
    if (!orderId || !amount || !email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId, amount, email, name are required' 
      });
    }
    
    const tx_ref = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    const paymentData = {
      amount: Number(amount),
      currency: 'ETB',
      email: email,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ')[1] || 'Customer',
      phone_number: phone || '0000000000',
      tx_ref: tx_ref,
      callback_url: `https://enimegebi-backend.onrender.com/api/payment/verify-order/${tx_ref}`,
      return_url: `https://enimegebi-zorz.vercel.app/orders?payment=success`,
      customization: {
        title: 'Enimegebi Payment',
        description: `Payment for order ${orderId}`
      }
    };
    
    console.log('Sending to Chapa:', paymentData);
    
    const response = await axios.post(`${CHAPA_API_URL}/transaction/initialize`, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Chapa response:', response.data);
    
    if (response.data.status === 'success') {
      await Order.findOneAndUpdate(
        { orderReference: orderId },
        { transactionRef: tx_ref, paymentStatus: 'pending' }
      );
      
      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({ success: false, message: response.data.message || 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || error.message 
    });
  }
};

// Initialize payment for project
const initializeProjectPayment = async (req, res) => {
  try {
    const { projectId, amount, email, name, phone } = req.body;
    
    const tx_ref = 'PROJ-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    const paymentData = {
      amount: Number(amount),
      currency: 'ETB',
      email: email,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ')[1] || 'Customer',
      phone_number: phone || '0000000000',
      tx_ref: tx_ref,
      callback_url: `https://enimegebi-backend.onrender.com/api/payment/verify-project/${tx_ref}`,
      return_url: `https://enimegebi-zorz.vercel.app/projects?payment=success`,
      customization: {
        title: 'Enimegebi Project',
        description: `Payment for project ${projectId}`
      }
    };
    
    const response = await axios.post(`${CHAPA_API_URL}/transaction/initialize`, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.status === 'success') {
      await Project.findOneAndUpdate(
        { _id: projectId },
        { $push: { purchasedBy: { user: req.user.id, amount: amount, purchasedAt: new Date(), isUnlocked: true, tx_ref: tx_ref } } }
      );
      
      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error('Project payment error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify order payment
const verifyOrderPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${CHAPA_SECRET_KEY}` }
    });
    
    if (response.data.status === 'success') {
      await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        { paymentStatus: 'paid', orderStatus: 'processing', paidAt: new Date() }
      );
      res.redirect('https://enimegebi-zorz.vercel.app/orders?payment=success');
    } else {
      res.redirect('https://enimegebi-zorz.vercel.app/checkout?payment=failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.redirect('https://enimegebi-zorz.vercel.app/checkout?payment=failed');
  }
};

// Verify project payment
const verifyProjectPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${CHAPA_SECRET_KEY}` }
    });
    
    if (response.data.status === 'success') {
      await Project.findOneAndUpdate(
        { 'purchasedBy.tx_ref': tx_ref },
        { $set: { 'purchasedBy.$.isUnlocked': true, 'purchasedBy.$.approvedAt': new Date() } }
      );
      res.redirect('https://enimegebi-zorz.vercel.app/projects?payment=success');
    } else {
      res.redirect('https://enimegebi-zorz.vercel.app/projects?payment=failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.redirect('https://enimegebi-zorz.vercel.app/projects?payment=failed');
  }
};

// Webhook
const webhook = async (req, res) => {
  try {
    const event = req.body;
    if (event.event === 'charge.success') {
      await Order.findOneAndUpdate(
        { transactionRef: event.data.tx_ref },
        { paymentStatus: 'paid', orderStatus: 'processing', paidAt: new Date() }
      );
      await Project.findOneAndUpdate(
        { 'purchasedBy.tx_ref': event.data.tx_ref },
        { $set: { 'purchasedBy.$.isUnlocked': true } }
      );
    }
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error' });
  }
};

module.exports = {
  initializeOrderPayment,
  initializeProjectPayment,
  verifyOrderPayment,
  verifyProjectPayment,
  webhook
};
