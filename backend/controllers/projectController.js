const Project = require('../models/Project');

// Get public projects (only approved)
const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isApproved: true }).sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project with access check
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Check if user has purchased access
    const hasAccess = project.purchasedBy.some(p => 
      p.user.toString() === req.user.id && p.isUnlocked === true
    );
    
    // If user doesn't have access and is not admin, return limited info
    if (!hasAccess && req.user.role !== 'admin') {
      return res.json({
        success: true,
        project: {
          _id: project._id,
          title: project.title,
          titleAm: project.titleAm,
          description: project.description,
          descriptionAm: project.descriptionAm,
          image: project.image,
          price: project.price,
          status: 'locked',
          contentType: project.contentType
        }
      });
    }
    
    // Return full project with content
    res.json({ success: true, project });
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
    let projectData;
    if (req.body.project) {
      projectData = JSON.parse(req.body.project);
    } else {
      projectData = req.body;
    }
    
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }
    
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
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
    
    let projectData;
    if (req.body.project) {
      projectData = JSON.parse(req.body.project);
    } else {
      projectData = req.body;
    }
    
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
    const userId = req.user.id;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Check if already purchased
    const alreadyPurchased = project.purchasedBy.some(p => p.user.toString() === userId);
    if (alreadyPurchased) {
      return res.json({ success: true, message: 'Already purchased, waiting for approval' });
    }
    
    project.purchasedBy.push({
      user: userId,
      amount: amount,
      purchasedAt: new Date(),
      isUnlocked: false
    });
    
    await project.save();
    res.json({ success: true, message: 'Purchase request sent, waiting for admin approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve purchase (admin)
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
    
    res.json({ success: true, message: 'Purchase approved, user can now access content' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve project (admin)
const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isApproved = true;
    await project.save();
    res.json({ success: true, message: 'Project approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's purchased projects
const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'purchasedBy.user': req.user.id,
      'purchasedBy.isUnlocked': true
    });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
