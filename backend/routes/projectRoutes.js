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
  unlockProject,
  approveProject
} = require('../controllers/projectController');

// Public routes
router.get('/public', getPublicProjects);

// Protected routes
router.use(protect);
router.get('/', getAllProjects);
router.post('/', uploadProduct.single('image'), createProject);
router.put('/:id', uploadProduct.single('image'), updateProject);
router.delete('/:id', deleteProject);
router.post('/unlock', unlockProject);
router.put('/approve/:id', approveProject);

module.exports = router;
