const Notification = require('../models/Notification');

const notifyAdmin = async ({ title, message, type = 'message', link = '', meta = {} }) => {
  try {
    return await Notification.create({
      recipientType: 'admin',
      title,
      message,
      type,
      link,
      meta
    });
  } catch (err) {
    console.error('notifyAdmin error:', err.message);
    return null;
  }
};

const notifyUser = async (userId, { title, message, type = 'broadcast', link = '', meta = {} }) => {
  if (!userId) return null;
  try {
    return await Notification.create({
      recipientType: 'user',
      userId,
      title,
      message,
      type,
      link,
      meta
    });
  } catch (err) {
    console.error('notifyUser error:', err.message);
    return null;
  }
};

module.exports = { notifyAdmin, notifyUser };
