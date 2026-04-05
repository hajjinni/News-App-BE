const Article = require('../models/Article');

const CATEGORIES = ['general','business','technology','sports','health','science','entertainment'];

exports.getNews = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = category && category !== 'all' ? { category } : {};

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = (req, res) => {
  res.json(CATEGORIES);
};

exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    next(err);
  }
};