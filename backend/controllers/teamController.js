const Team = require('../models/Team');

// Get all team members (public)
const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all team members for admin
const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.find({}).sort({ order: 1 });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create team member
const createTeamMember = async (req, res) => {
  try {
    const teamData = JSON.parse(req.body.team);
    if (req.file) {
      teamData.image = `/uploads/team/${req.file.filename}`;
    }
    const team = await Team.create(teamData);
    res.json({ success: true, team });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    const teamData = JSON.parse(req.body.team);
    if (req.file) {
      teamData.image = `/uploads/team/${req.file.filename}`;
    }
    Object.assign(team, teamData);
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete team member
const deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
