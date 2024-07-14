const Project = require('../models/project');

// Create a new project
const createProject = async (req, res) => {
  const { title, description, startDate, endDate, clientId, freelancerId, billingCycle, paymentType } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      clientId,
      freelancerId,
      billingCycle,
      paymentType,
    });

    if (project) {
      res.status(201).json(project);
    } else {
      res.status(400).json({ message: 'Invalid project data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for a user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ clientId: req.user._id }, { freelancerId: req.user._id }]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project && (project.clientId.equals(req.user._id) || project.freelancerId.equals(req.user._id))) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found or you do not have access to this project' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a project
const updateProject = async (req, res) => {
  const { title, description, startDate, endDate, status, billingCycle, paymentType } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project && (project.clientId.equals(req.user._id) || project.freelancerId.equals(req.user._id))) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.startDate = startDate || project.startDate;
      project.endDate = endDate || project.endDate;
      project.status = status || project.status;
      project.billingCycle = billingCycle || project.billingCycle;
      project.paymentType = paymentType || project.paymentType;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found or you do not have access to update this project' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project && (project.clientId.equals(req.user._id) || project.freelancerId.equals(req.user._id))) {
      await Project.deleteOne({ _id: project._id });
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found or you do not have access to delete this project' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
