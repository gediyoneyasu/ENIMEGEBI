const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/upload');
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
  getPublicProducts
} = require('../controllers/adminController');

// Public routes
router.post('/contacts', createContact);
router.get('/public-products', getPublicProducts);

// Protected routes
router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/products', getProducts);
router.post('/products', uploadProduct.single('image'), createProduct);
router.put('/products/:id', uploadProduct.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/contacts', getContacts);
router.put('/contacts/:id/read', markContactRead);

module.exports = router;
