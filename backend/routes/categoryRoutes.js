const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadCategory } = require('../config/upload');
const {
  getCategories,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Public routes
router.get('/public', getCategories);

// Protected admin routes
router.use(protect);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', uploadCategory.single('image'), createCategory);
router.put('/:id', uploadCategory.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
