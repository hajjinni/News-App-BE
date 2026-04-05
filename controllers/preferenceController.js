const User = require('../models/User');

exports.getPreferences = async (req, res, next) => {
  try {
    res.json(req.user.preferences);
  } catch (err) {
    next(err);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const { categories, frequency, emailAlerts, pushAlerts } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        preferences: {
          categories: categories || req.user.preferences.categories,
          frequency: frequency || req.user.preferences.frequency,
          emailAlerts: typeof emailAlerts === 'boolean' ? emailAlerts : req.user.preferences.emailAlerts,
          pushAlerts: typeof pushAlerts === 'boolean' ? pushAlerts : req.user.preferences.pushAlerts
        }
      },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json(user.preferences);
  } catch (err) {
    next(err);
  }
};

exports.savePushSubscription = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: req.body,
      'preferences.pushAlerts': true
    });
    res.json({ message: 'Push subscription saved' });
  } catch (err) {
    next(err);
  }
};

exports.removePushSubscription = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: null,
      'preferences.pushAlerts': false
    });
    res.json({ message: 'Push subscription removed' });
  } catch (err) {
    next(err);
  }
};