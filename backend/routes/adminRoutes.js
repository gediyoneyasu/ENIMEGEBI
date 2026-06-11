const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/upload');

const upload = uploadProduct.array('images', 10);

router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is working!' });
});

router.get('/test-controller', productController.test);

// Public product routes
router.get('/public-products', productController.getPublicProducts);
router.get('/public-products/:id', productController.getPublicProductById);
router.get('/home-data', productController.getHomeData);

// Protected admin routes
router.get('/dashboard-stats', protect, admin, adminController.getDashboardStats);
router.get('/orders', protect, admin, adminController.getOrders);
router.put('/orders/:id', protect, admin, adminController.updateOrderStatus);

router.get('/products', protect, admin, productController.getProducts);
router.post('/products/repair-images', protect, admin, productController.repairProductImages);
router.post('/products', protect, admin, upload, productController.createProduct);
router.put('/products/:id', protect, admin, upload, productController.updateProduct);
router.delete('/products/:id', protect, admin, productController.deleteProduct);

module.exports = router;
