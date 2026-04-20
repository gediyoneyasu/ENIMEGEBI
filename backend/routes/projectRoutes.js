const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/upload');
const {
  getPublicProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  approveProject,
  purchaseProject,
  approvePurchase,
  getUserProjects
} = require('../controllers/projectController');

// Public routes
router.get('/public', getPublicProjects);
router.get('/public/:id', getProjectById);

// Protected routes
router.use(protect);
router.get('/', getAllProjects);
router.get('/my-projects', getUserProjects);
router.post('/', uploadProduct.single('image'), createProject);
router.put('/:id', uploadProduct.single('image'), updateProject);
router.delete('/:id', deleteProject);
router.put('/approve/:id', approveProject);
router.post('/purchase', purchaseProject);
router.post('/approve-purchase', approvePurchase);

module.exports = router;
