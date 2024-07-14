const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' },
  expectedTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [String],
  logHours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LogHour' }],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
