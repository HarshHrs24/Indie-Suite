const mongoose = require('mongoose');

const logHourSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  description: { type: String },
  type: { type: String, enum: ['Billable', 'Non-Billable'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const LogHour = mongoose.model('LogHour', logHourSchema);

module.exports = LogHour;
