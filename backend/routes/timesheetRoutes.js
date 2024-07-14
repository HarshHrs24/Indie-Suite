const express = require('express');
const { createTimesheet, getTimesheetsByProject, getTimesheetById, updateTimesheet, deleteTimesheet } = require('../controllers/timesheetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createTimesheet);

router.route('/project/:projectId')
  .get(protect, getTimesheetsByProject);

router.route('/:id')
  .get(protect, getTimesheetById)
  .put(protect, updateTimesheet)
  .delete(protect, deleteTimesheet);

module.exports = router;
