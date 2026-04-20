const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/upload');
const {
  getPublicProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  approveProject,
  purchaseProject,
  approvePurchase
} = require('../controllers/projectController');

// Public routes
router.get('/public', getPublicProjects);

// Protected routes
router.use(protect);
router.get('/', getAllProjects);
router.post('/', uploadProduct.single('image'), createProject);
router.put('/:id', uploadProduct.single('image'), updateProject);
router.delete('/:id', deleteProject);
router.put('/approve/:id', approveProject);
router.post('/purchase', purchaseProject);
router.post('/approve-purchase', approvePurchase);

module.exports = router;
