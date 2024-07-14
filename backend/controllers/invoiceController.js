const Invoice = require('../models/invoice');
const Timesheet = require('../models/timesheet');
const Project = require('../models/project');

// Create a new invoice
const createInvoice = async (req, res) => {
  const { projectId, timesheetId, issueDate, dueDate, amount } = req.body;

  try {
    const project = await Project.findById(projectId);
    const timesheet = await Timesheet.findById(timesheetId);

    if (!project || !timesheet) {
      return res.status(404).json({ message: 'Project or Timesheet not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to create an invoice for this project' });
    }

    const invoice = await Invoice.create({
      projectId,
      clientId: project.clientId,
      freelancerId: project.freelancerId,
      timesheetId,
      issueDate,
      dueDate,
      amount,
    });

    if (invoice) {
      res.status(201).json(invoice);
    } else {
      res.status(400).json({ message: 'Invalid invoice data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all invoices for a project
const getInvoicesByProject = async (req, res) => {
  try {
    const invoices = await Invoice.find({ projectId: req.params.projectId });

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view invoices for this project' });
    }

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const project = await Project.findById(invoice.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to view this invoice' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an invoice
const updateInvoice = async (req, res) => {
  const { status } = req.body;

  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const project = await Project.findById(invoice.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to update this invoice' });
    }

    invoice.status = status || invoice.status;

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const project = await Project.findById(invoice.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.clientId.equals(req.user._id) && !project.freelancerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to delete this invoice' });
    }

    await Invoice.deleteOne({ _id: invoice._id });
    res.json({ message: 'Invoice removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoicesByProject,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
