const axios = require('axios');
const Article = require('../models/Article');
const User = require('../models/User');
const Alert = require('../models/Alert');
const { sendEmailAlert } = require('../services/emailService');
const { sendPushAlert } = require('../services/pushService');

const CATEGORIES = ['general','business','technology','sports','health','science','entertainment'];

exports.fetchAndBroadcastNews = async (io) => {
  for (const category of CATEGORIES) {
    try {
      const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          category,
          pageSize: 10,
          apiKey: process.env.NEWS_API_KEY
        },
        timeout: 10000
      });

      if (!data.articles) continue;

      for (const item of data.articles) {
        if (!item.url || !item.title || item.title === '[Removed]') continue;

        // Skip if already stored
        const exists = await Article.findOne({ url: item.url });
        if (exists) continue;

        const article = await Article.create({
          title: item.title,
          description: item.description || '',
          url: item.url,
          urlToImage: item.urlToImage || '',
          source: item.source?.name || 'Unknown',
          category,
          publishedAt: item.publishedAt || new Date()
        });

        // Find users subscribed to this category with immediate frequency
        const users = await User.find({
          'preferences.categories': category,
          'preferences.frequency': 'immediate',
          isActive: true
        });

        for (const user of users) {
          // Real-time socket alert
          io.to(user._id.toString()).emit('news_alert', { article, category });

          // Save alert record
          await Alert.create({ userId: user._id, article: article._id, type: 'realtime' });

          // Email via SendGrid
          if (user.preferences.emailAlerts) {
            await sendEmailAlert(user, article);
            await Alert.create({ userId: user._id, article: article._id, type: 'email' });
          }

          // Web push
          if (user.preferences.pushAlerts && user.pushSubscription) {
            await sendPushAlert(user.pushSubscription, article);
            await Alert.create({ userId: user._id, article: article._id, type: 'push' });
          }

          article.sentToUsers.push(user._id);
        }

        if (users.length > 0) await article.save();
      }
    } catch (err) {
      console.error(`Error fetching ${category}:`, err.message);
    }
  }
};