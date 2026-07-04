const express = require('express');
const notificationController = require('./notification.controller');
const notificationPreferenceController = require('./notificationPreference.controller');
const {
  validateGetNotifications,
  validateGetNotification,
  validateSearchNotifications,
  validateMarkAsRead,
  validateMarkAllAsRead,
  validateDeleteNotification,
  validateRestoreNotification,
  validateBroadcastNotification,
  validateGetPreferences,
  validateUpdatePreferences,
} = require('./notification.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// ─── Notification Routes ─────────────────────────────────────────
router.get('/', authenticate, validateGetNotifications, notificationController.getNotifications);

router.get('/search', authenticate, validateSearchNotifications, notificationController.searchNotifications);

router.get('/unread', authenticate, validateGetNotifications, notificationController.getUnreadNotifications);

router.get('/unread/count', authenticate, notificationController.getUnreadCount);

router.get('/:id', authenticate, validateGetNotification, notificationController.getNotification);

router.patch('/:id/read', authenticate, validateMarkAsRead, notificationController.markAsRead);

router.patch('/read-all', authenticate, validateMarkAllAsRead, notificationController.markAllAsRead);

router.patch('/:id/restore', authenticate, validateRestoreNotification, notificationController.restoreNotification);

router.delete('/:id', authenticate, validateDeleteNotification, notificationController.deleteNotification);

router.post('/broadcast', authenticate, validateBroadcastNotification, authorize(['admin', 'superadmin']), notificationController.broadcastNotification);

// ─── Notification Preference Routes ───────────────────────────────
router.get('/preferences', authenticate, validateGetPreferences, notificationPreferenceController.getPreferences);

router.put('/preferences', authenticate, validateUpdatePreferences, notificationPreferenceController.updatePreferences);

module.exports = router;
