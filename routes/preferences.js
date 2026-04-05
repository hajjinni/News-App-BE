const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getPreferences,
  updatePreferences,
  savePushSubscription,
  removePushSubscription
} = require('../controllers/preferenceController');

router.get('/', protect, getPreferences);
router.put('/', protect, updatePreferences);
router.post('/push-subscribe', protect, savePushSubscription);
router.delete('/push-subscribe', protect, removePushSubscription);

module.exports = router;