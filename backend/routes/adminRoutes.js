const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import controller
const productController = require('../controllers/productController');

// ========== CONFIGURE MULTER FOR FILE UPLOADS ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).array('images', 10);

// ========== TEST ROUTES ==========
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is working!' });
});

router.get('/test-controller', productController.test);

// ========== PRODUCT ROUTES WITH UPLOAD MIDDLEWARE ==========
router.get('/products', productController.getProducts);
router.post('/products', upload, productController.createProduct);  // ← ADDED upload
router.put('/products/:id', upload, productController.updateProduct); // ← ADDED upload
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;