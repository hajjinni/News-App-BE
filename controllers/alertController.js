const Alert = require('../models/Alert');

exports.getAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, unreadOnly } = req.query;
    const query = { userId: req.user._id };
    if (unreadOnly === 'true') query.read = false;

    const alerts = await Alert.find(query)
      .populate('article', 'title description url urlToImage source category publishedAt')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const unreadCount = await Alert.countDocuments({ userId: req.user._id, read: false });

    res.json({ alerts, unreadCount });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Alert.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All alerts marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAlert = async (req, res, next) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
};