const Timesheet = require('../models/timesheet');
const LogHour = require('../models/logHour');
const Project = require('../models/project');

// Create a new timesheet
const createTimesheet = async (req, res) => {
  const { projectId, startDate, endDate } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to create a timesheet for this project' });
    }

    const logHours = await LogHour.find({
      projectId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const timesheet = await Timesheet.create({
      projectId,
      userId: req.user._id,
      startDate,
      endDate,
      logHours: logHours.map(log => log._id),
    });

    if (timesheet) {
      res.status(201).json(timesheet);
    } else {
      res.status(400).json({ message: 'Invalid timesheet data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all timesheets for a project
const getTimesheetsByProject = async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ projectId: req.params.projectId });

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view timesheets for this project' });
    }

    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get timesheet by ID
const getTimesheetById = async (req, res) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id).populate('logHours');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    const project = await Project.findById(timesheet.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view this timesheet' });
    }

    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a timesheet
const updateTimesheet = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    const project = await Project.findById(timesheet.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to update this timesheet' });
    }

    const logHours = await LogHour.find({
      projectId: timesheet.projectId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    timesheet.startDate = startDate || timesheet.startDate;
    timesheet.endDate = endDate || timesheet.endDate;
    timesheet.logHours = logHours.map(log => log._id);

    const updatedTimesheet = await timesheet.save();
    res.json(updatedTimesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a timesheet
const deleteTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    const project = await Project.findById(timesheet.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to delete this timesheet' });
    }

    await Timesheet.deleteOne({ _id: timesheet._id });
    res.json({ message: 'Timesheet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTimesheet,
  getTimesheetsByProject,
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
};
