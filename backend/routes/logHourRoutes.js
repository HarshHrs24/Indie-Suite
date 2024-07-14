const express = require('express');
const { createLogHour, getLogHoursByTask, getLogHourById, updateLogHour, deleteLogHour } = require('../controllers/logHourController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createLogHour);

router.route('/task/:taskId')
  .get(protect, getLogHoursByTask);

router.route('/:id')
  .get(protect, getLogHourById)
  .put(protect, updateLogHour)
  .delete(protect, deleteLogHour);

module.exports = router;
