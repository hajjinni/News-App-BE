const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getAlerts,
  markAsRead,
  markAllAsRead,
  deleteAlert
} = require('../controllers/alertController');

router.get('/', protect, getAlerts);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteAlert);

module.exports = router;