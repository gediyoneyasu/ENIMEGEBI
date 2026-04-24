const axios = require('axios');
const Order = require('../models/Order');
const Project = require('../models/Project');

const CHAPA_API_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://enimegebi-zorz.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://enimegebi-backend.onrender.com';

const getSafeNameParts = (name = '') => {
  const clean = String(name || '').trim();
  if (!clean) return { firstName: 'Customer', lastName: 'User' };
  const parts = clean.split(/\s+/);
  return {
    firstName: parts[0] || 'Customer',
    lastName: parts.slice(1).join(' ') || 'User'
  };
};

// Initialize payment for order (product checkout)
const initializeOrderPayment = async (req, res) => {
  try {
    if (!CHAPA_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Chapa secret key is not configured' });
    }

    console.log('Payment request received:', req.body);
    
    const { orderId, amount, email, name, phone, returnUrl } = req.body;
    
    // Validate required fields
    if (!orderId || !amount || !email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId, amount, email, name are required' 
      });
    }
    
    const customerEmail = email || req.user?.email;
    const customerName = name || req.user?.name;
    const customerPhone = phone || req.user?.phone || '0000000000';
    const { firstName, lastName } = getSafeNameParts(customerName);

    if (!customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer email is required for payment' });
    }

    const tx_ref = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    const resolvedReturnUrl = returnUrl && /^https?:\/\//i.test(returnUrl)
      ? `${returnUrl}?payment=pending&tx_ref=${tx_ref}`
      : `${FRONTEND_URL}/checkout?payment=pending&tx_ref=${tx_ref}`;

    const paymentData = {
      amount: Number(amount),
      currency: 'ETB',
      email: customerEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: customerPhone,
      tx_ref: tx_ref,
      callback_url: `${BACKEND_URL}/api/payment/verify-order/${tx_ref}`,
      return_url: resolvedReturnUrl,
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
      const checkoutUrl = response.data?.data?.checkout_url || response.data?.checkout_url || null;
      if (!checkoutUrl) {
        return res.status(502).json({ success: false, message: 'Chapa did not return checkout URL' });
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { orderReference: orderId },
        { transactionRef: tx_ref, paymentStatus: 'pending' }
      );
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found for payment initialization' });
      }
      
      res.json({
        success: true,
        checkout_url: checkoutUrl,
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
    if (!CHAPA_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Chapa secret key is not configured' });
    }

    const { projectId, amount, email, name, phone } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({ success: false, message: 'projectId and amount are required' });
    }

    const customerEmail = email || req.user?.email;
    const customerName = name || req.user?.name;
    const customerPhone = phone || req.user?.phone || '0000000000';
    const { firstName, lastName } = getSafeNameParts(customerName);

    if (!customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer email is required for payment' });
    }
    
    const tx_ref = 'PROJ-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    const paymentData = {
      amount: Number(amount),
      currency: 'ETB',
      email: customerEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: customerPhone,
      tx_ref: tx_ref,
      callback_url: `${BACKEND_URL}/api/payment/verify-project/${tx_ref}`,
      return_url: `${FRONTEND_URL}/projects?payment=pending&tx_ref=${tx_ref}`,
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
        { $push: { purchasedBy: { user: req.user.id, amount: amount, purchasedAt: new Date(), isUnlocked: false, txRef: tx_ref } } }
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
    if (!CHAPA_SECRET_KEY) {
      return res.redirect(`${FRONTEND_URL}/checkout?payment=failed`);
    }

    const { tx_ref } = req.params;
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${CHAPA_SECRET_KEY}` }
    });
    
    if (response.data.status === 'success') {
      await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        {
          paymentStatus: 'paid',
          orderStatus: 'processing',
          paidAt: new Date(),
          chapaData: response.data.data || {}
        }
      );
      res.redirect(`${FRONTEND_URL}/checkout?payment=success&tx_ref=${tx_ref}`);
    } else {
      await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        { paymentStatus: 'failed' }
      );
      res.redirect(`${FRONTEND_URL}/checkout?payment=failed&tx_ref=${tx_ref}`);
    }
  } catch (error) {
    console.error('Verification error:', error);
    await Order.findOneAndUpdate(
      { transactionRef: req.params.tx_ref },
      { paymentStatus: 'failed' }
    );
    res.redirect(`${FRONTEND_URL}/checkout?payment=failed&tx_ref=${req.params.tx_ref}`);
  }
};

// Verify project payment
const verifyProjectPayment = async (req, res) => {
  try {
    if (!CHAPA_SECRET_KEY) {
      return res.redirect(`${FRONTEND_URL}/projects?payment=failed`);
    }

    const { tx_ref } = req.params;
    
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${CHAPA_SECRET_KEY}` }
    });
    
    if (response.data.status === 'success') {
      await Project.findOneAndUpdate(
        { 'purchasedBy.txRef': tx_ref },
        { $set: { 'purchasedBy.$.isUnlocked': true, 'purchasedBy.$.approvedAt': new Date() } }
      );
      res.redirect(`${FRONTEND_URL}/projects?payment=success&tx_ref=${tx_ref}`);
    } else {
      res.redirect(`${FRONTEND_URL}/projects?payment=failed&tx_ref=${tx_ref}`);
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.redirect(`${FRONTEND_URL}/projects?payment=failed&tx_ref=${req.params.tx_ref}`);
  }
};

const verifyOrderPaymentStatus = async (req, res) => {
  try {
    if (!CHAPA_SECRET_KEY) {
      return res.status(500).json({ success: false, status: 'error', message: 'Chapa secret key is not configured' });
    }

    const { tx_ref } = req.params;
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
    });

    if (response.data.status === 'success') {
      await Order.findOneAndUpdate(
        { transactionRef: tx_ref },
        {
          paymentStatus: 'paid',
          orderStatus: 'processing',
          paidAt: new Date(),
          chapaData: response.data.data || {}
        }
      );
      return res.json({ success: true, status: 'paid', data: response.data.data });
    }

    await Order.findOneAndUpdate(
      { transactionRef: tx_ref },
      { paymentStatus: 'failed' }
    );
    return res.json({ success: false, status: 'failed', message: 'Payment not completed' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 'error',
      message: error.response?.data?.message || error.message
    });
  }
};

const verifyProjectPaymentStatus = async (req, res) => {
  try {
    if (!CHAPA_SECRET_KEY) {
      return res.status(500).json({ success: false, status: 'error', message: 'Chapa secret key is not configured' });
    }

    const { tx_ref } = req.params;
    const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
    });

    if (response.data.status === 'success') {
      await Project.findOneAndUpdate(
        { 'purchasedBy.txRef': tx_ref },
        { $set: { 'purchasedBy.$.isUnlocked': true, 'purchasedBy.$.approvedAt': new Date() } }
      );
      return res.json({ success: true, status: 'paid', data: response.data.data });
    }

    return res.json({ success: false, status: 'failed', message: 'Payment not completed' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 'error',
      message: error.response?.data?.message || error.message
    });
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
        { 'purchasedBy.txRef': event.data.tx_ref },
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
  verifyOrderPaymentStatus,
  verifyProjectPaymentStatus,
  webhook
};
