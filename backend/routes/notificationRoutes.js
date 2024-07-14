const express = require('express');
const { createNotification, getNotificationsByUser, markNotificationAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createNotification)
  .get(protect, getNotificationsByUser);

router.route('/:id')
  .put(protect, markNotificationAsRead)
  .delete(protect, deleteNotification);

module.exports = router;
