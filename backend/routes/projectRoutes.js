const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProjectFile } = require('../config/upload');
const {
  getPublicProjects,
  getProjectById,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  purchaseProject,
  approvePurchase,
  approveProject,
  getUserProjects
} = require('../controllers/projectController');

// Public routes
router.get('/public', getPublicProjects);
router.get('/public/:id', getProjectById);

// Protected routes
router.use(protect);
router.get('/', getAllProjects);
router.get('/my-projects', getUserProjects);
router.post('/', uploadProjectFile.single('file'), createProject);
router.put('/:id', uploadProjectFile.single('file'), updateProject);
router.delete('/:id', deleteProject);
router.post('/purchase', purchaseProject);
router.post('/approve-purchase', approvePurchase);
router.put('/approve/:id', approveProject);

module.exports = router;
