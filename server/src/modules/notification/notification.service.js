const notificationRepository = require('./notification.repository');
const { generateNotificationId, notificationFormatter } = require('./notification.utils');
const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS, MESSAGES, DEFAULTS } = require('./notification.constants');
const templates = require('./notification.templates');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class NotificationService {
  /**
   * Create a new notification.
   * @param {object} notificationData - Notification data.
   * @returns {Promise<object>} Created notification.
   */
  async createNotification(notificationData) {
    const notification = await notificationRepository.create({
      ...notificationData,
      notificationId: generateNotificationId(),
      status: STATUS.PENDING,
      priority: notificationData.priority || DEFAULTS.PRIORITY,
      channel: notificationData.channel || DEFAULTS.CHANNEL,
      isRead: notificationData.isRead !== undefined ? notificationData.isRead : DEFAULTS.IS_READ,
    });

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Build a notification payload from a template without persisting it.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @returns {object} Notification payload.
   */
  buildNotification(templateKey, templateData = {}) {
    if (!templates[templateKey]) {
      throw new ValidationError(`Notification template '${templateKey}' not found`);
    }

    const payload = templates[templateKey](templateData);

    if (!payload.recipient) {
      throw new ValidationError('Notification recipient is required');
    }

    return payload;
  }

  /**
   * Create and persist an in-app notification using a template.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notification.
   */
  async sendInAppNotification(templateKey, templateData = {}, overrides = {}) {
    const payload = this.buildNotification(templateKey, templateData);

    const notification = await notificationRepository.create({
      ...payload,
      ...overrides,
      notificationId: generateNotificationId(),
      status: STATUS.SENT,
      sentAt: new Date(),
    });

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Trigger a notification event.
   * Alias for sendInAppNotification to provide a semantic API for other modules.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notification.
   */
  async triggerNotification(templateKey, templateData = {}, overrides = {}) {
    return this.sendInAppNotification(templateKey, templateData, overrides);
  }

  /**
   * Send bulk in-app notifications to multiple recipients using a template.
   * @param {Array<string>} recipientIds - Array of user IDs.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notifications.
   */
  async sendBulkInAppNotification(recipientIds, templateKey, templateData = {}, overrides = {}) {
    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      throw new ValidationError('At least one recipient is required');
    }

    const notifications = recipientIds.map((recipientId) => {
      const payload = templates[templateKey]({ ...templateData, recipientId });
      return {
        ...payload,
        ...overrides,
        notificationId: generateNotificationId(),
        status: STATUS.SENT,
        sentAt: new Date(),
      };
    });

    const createdNotifications = await notificationRepository.bulkCreate(notifications);

    return {
      notifications: createdNotifications.map(notificationFormatter),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Get notifications for a user with pagination.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Notifications list.
   */
  async getNotifications(userId, query = {}) {
    const { type, isRead, page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    const filter = { recipient: userId, isDeleted: false };

    if (type) {
      filter.type = type;
    }

    if (isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    const { notifications, total } = await notificationRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Get unread notifications for a user.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Unread notifications list.
   */
  async getUnreadNotifications(userId, query = {}) {
    const { page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    const { notifications, total } = await notificationRepository.findUnread(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Mark a notification as read.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Updated notification.
   */
  async markAsRead(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    if (notification.isRead) {
      return {
        notification: notificationFormatter(notification),
        message: MESSAGES.NOTIFICATION_UPDATED,
      };
    }

    const updated = await notificationRepository.markAsRead(notificationId);

    return {
      notification: notificationFormatter(updated),
      message: MESSAGES.NOTIFICATION_UPDATED,
    };
  }

  /**
   * Mark all notifications as read for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Result object.
   */
  async markAllAsRead(userId) {
    const result = await notificationRepository.markAllAsRead(userId);

    return {
      modifiedCount: result.modifiedCount,
      message: MESSAGES.ALL_NOTIFICATIONS_READ,
    };
  }

  /**
   * Soft delete a notification.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Deleted notification confirmation.
   */
  async deleteNotification(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    await notificationRepository.softDelete(notificationId, userId);

    return {
      message: MESSAGES.NOTIFICATION_DELETED,
    };
  }

  /**
   * Find pending notifications for processing.
   * @param {object} options - Query options.
   * @returns {Promise<Array>} Array of pending notifications.
   */
  async findPendingNotifications(options = {}) {
    return notificationRepository.findPendingNotifications(options);
  }

  /**
   * Mark a notification as sent.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Updated notification.
   */
  async markNotificationAsSent(notificationId) {
    const notification = await notificationRepository.markAsSent(notificationId);

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_UPDATED,
    };
  }
}

module.exports = new NotificationService();
