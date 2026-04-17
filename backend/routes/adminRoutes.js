const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getContacts,
  createContact,
  markContactRead,
  getDashboardStats,
  createProductWithImage,
  updateProductWithImage,
  getPublicProducts
} = require('../controllers/adminController');

// Public routes (no authentication required)
router.post('/contacts', createContact);

// Public products for frontend (no auth needed)
router.get('/public-products', getPublicProducts);

// Protected routes (admin only)
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product routes with image upload support
router.get('/products', getProducts);
router.post('/products', upload.single('image'), createProductWithImage);
router.put('/products/:id', upload.single('image'), updateProductWithImage);
router.delete('/products/:id', deleteProduct);

// Order routes
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Contact routes (GET needs auth)
router.get('/contacts', getContacts);
router.put('/contacts/:id/read', markContactRead);

module.exports = router;
