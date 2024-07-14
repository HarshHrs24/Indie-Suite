const LogHour = require('../models/logHour');
const Task = require('../models/task');
const Project = require('../models/project');

// Create a new log hour
const createLogHour = async (req, res) => {
  const { taskId, projectId, date, hours, description, type } = req.body;

  try {
    const task = await Task.findById(taskId);
    const project = await Project.findById(projectId);

    if (!task || !project) {
      return res.status(404).json({ message: 'Task or Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to log hours for this task or project' });
    }

    const logHour = await LogHour.create({
      taskId,
      projectId,
      userId: req.user._id,
      date,
      hours,
      description,
      type,
    });

    if (logHour) {
      task.logHours.push(logHour._id);
      await task.save();
      res.status(201).json(logHour);
    } else {
      res.status(400).json({ message: 'Invalid log hour data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all log hours for a task
const getLogHoursByTask = async (req, res) => {
  try {
    const logHours = await LogHour.find({ taskId: req.params.taskId });

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view log hours for this task' });
    }

    res.json(logHours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get log hour by ID
const getLogHourById = async (req, res) => {
  try {
    const logHour = await LogHour.findById(req.params.id);

    if (!logHour) {
      return res.status(404).json({ message: 'Log hour not found' });
    }

    const task = await Task.findById(logHour.taskId);
    const project = await Project.findById(logHour.projectId);
    if (!task || !project) {
      return res.status(404).json({ message: 'Task or Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view this log hour' });
    }

    res.json(logHour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a log hour
const updateLogHour = async (req, res) => {
  const { date, hours, description, type } = req.body;

  try {
    const logHour = await LogHour.findById(req.params.id);

    if (!logHour) {
      return res.status(404).json({ message: 'Log hour not found' });
    }

    const task = await Task.findById(logHour.taskId);
    const project = await Project.findById(logHour.projectId);
    if (!task || !project) {
      return res.status(404).json({ message: 'Task or Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to update this log hour' });
    }

    logHour.date = date || logHour.date;
    logHour.hours = hours || logHour.hours;
    logHour.description = description || logHour.description;
    logHour.type = type || logHour.type;

    const updatedLogHour = await logHour.save();
    res.json(updatedLogHour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a log hour
const deleteLogHour = async (req, res) => {
  try {
    const logHour = await LogHour.findById(req.params.id);

    if (!logHour) {
      return res.status(404).json({ message: 'Log hour not found' });
    }

    const task = await Task.findById(logHour.taskId);
    const project = await Project.findById(logHour.projectId);
    if (!task || !project) {
      return res.status(404).json({ message: 'Task or Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to delete this log hour' });
    }

    await LogHour.deleteOne({ _id: logHour._id });
    res.json({ message: 'Log hour removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLogHour,
  getLogHoursByTask,
  getLogHourById,
  updateLogHour,
  deleteLogHour,
};
