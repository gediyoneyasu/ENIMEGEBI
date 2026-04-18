const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadTeam } = require('../config/upload');
const {
  getTeamMembers,
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');

// Public routes
router.get('/public', getTeamMembers);

// Protected admin routes
router.use(protect);
router.get('/', getAllTeamMembers);
router.post('/', uploadTeam.single('image'), createTeamMember);
router.put('/:id', uploadTeam.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;
