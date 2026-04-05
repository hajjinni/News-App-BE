const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  url: { type: String, required: true, unique: true },
  urlToImage: { type: String, default: '' },
  source: { type: String, default: 'Unknown' },
  category: {
    type: String,
    enum: ['general','business','technology','sports','health','science','entertainment'],
    required: true
  },
  publishedAt: { type: Date, default: Date.now },
  sentToUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

articleSchema.index({ category: 1, publishedAt: -1 });


module.exports = mongoose.model('Article', articleSchema);