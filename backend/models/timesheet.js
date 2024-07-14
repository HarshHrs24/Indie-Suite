const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  logHours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LogHour' }],
  createdAt: { type: Date, default: Date.now },
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;
