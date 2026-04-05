const router = require('express').Router();
const protect = require('../middleware/auth');
const { getNews, getCategories, getArticleById } = require('../controllers/newsController');

router.get('/categories', getCategories);
router.get('/', protect, getNews);
router.get('/:id', protect, getArticleById);

module.exports = router;