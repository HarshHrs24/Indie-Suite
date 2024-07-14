const Task = require('../models/task');
const Project = require('../models/project');

// Create a new task
const createTask = async (req, res) => {
  const { projectId, title, description, expectedTime } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to create a task in this project' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      expectedTime,
    });

    if (task) {
      res.status(201).json(task);
    } else {
      res.status(400).json({ message: 'Invalid task data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a project
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view tasks in this project' });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { title, description, status, expectedTime, comments } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to update this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.expectedTime = expectedTime || task.expectedTime;
    task.comments = comments || task.comments;

    if (status === 'Approved' && project.clientId.equals(req.user._id)) {
      task.approvedAt = new Date();
      task.approvedBy = req.user._id;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to delete this task' });
    }

    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
