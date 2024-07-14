const Notification = require('../models/notification');

// Create a new notification
const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
    });

    if (notification) {
      res.status(201).json(notification);
    } else {
      res.status(400).json({ message: 'Invalid notification data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notifications for a user
const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to this notification' });
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have access to this notification' });
    }

    await Notification.deleteOne({ _id: notification._id });
    res.json({ message: 'Notification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
};
