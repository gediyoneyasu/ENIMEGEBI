const Project = require('../models/Project');

// Get public projects (only approved and unlocked)
const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isApproved: true }).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects for admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    let projectData = JSON.parse(req.body.project);
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    let projectData = JSON.parse(req.body.project);
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }
    Object.assign(project, projectData);
    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Purchase project
const purchaseProject = async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    project.purchasedBy.push({
      user: req.user.id,
      amount: amount,
      purchasedAt: new Date()
    });
    await project.save();
    
    res.json({ success: true, message: 'Purchase request sent, waiting for admin approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve purchase
const approvePurchase = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const purchase = project.purchasedBy.find(p => p.user.toString() === userId);
    if (purchase) {
      purchase.isUnlocked = true;
      purchase.approvedAt = new Date();
      await project.save();
    }
    
    res.json({ success: true, message: 'Purchase approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve project
const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isApproved = true;
    project.status = 'unlocked';
    await project.save();
    res.json({ success: true, message: 'Project approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  purchaseProject,
  approvePurchase,
  approveProject
};
