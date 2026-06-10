const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProduct } = require('../config/upload');

const upload = uploadProduct.array('images', 10);

router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is working!' });
});

router.get('/test-controller', productController.test);

router.get('/products', productController.getProducts);
router.get('/home-data', productController.getHomeData);
router.get('/public-products', productController.getPublicProducts);
router.get('/public-products/:id', productController.getPublicProductById);
router.post('/products/repair-images', productController.repairProductImages);
router.post('/products', upload, productController.createProduct);
router.put('/products/:id', upload, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
