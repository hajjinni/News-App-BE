const User = require('../models/User');
const Article = require('../models/Article');
const { sendDigestEmail } = require('../services/emailService');

exports.sendDigests = async (frequency, io) => {
  try {
    const users = await User.find({
      'preferences.frequency': frequency,
      'preferences.emailAlerts': true,
      isActive: true
    });

    const since = frequency === 'hourly'
      ? new Date(Date.now() - 60 * 60 * 1000)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const user of users) {
      const articles = await Article.find({
        category: { $in: user.preferences.categories },
        publishedAt: { $gte: since }
      })
        .sort({ publishedAt: -1 })
        .limit(frequency === 'hourly' ? 5 : 20)
        .lean();

      if (articles.length === 0) continue;

      await sendDigestEmail(user, articles);

      // Also push digest via socket if connected
      io.to(user._id.toString()).emit('digest_ready', {
        count: articles.length,
        frequency
      });
    }
  } catch (err) {
    console.error('Digest job error:', err.message);
  }
};