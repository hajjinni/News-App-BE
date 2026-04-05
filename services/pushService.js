const webpush = require('../config/vapid');

exports.sendPushAlert = async (subscription, article) => {
  try {
    const payload = JSON.stringify({
      title: `Breaking: ${article.category}`,
      body: article.title.slice(0, 100),
      icon: article.urlToImage || '/logo192.png',
      badge: '/badge.png',
      url: article.url,
      data: { articleId: article._id }
    });
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    // 410 = subscription expired, caller should delete it
    if (err.statusCode === 410) {
      console.log('Push subscription expired for user');
    } else {
      console.error('Push error:', err.message);
    }
  }
};