const NOTIFICATION_TYPES = {
  REGISTRATION: 'registration',
  PROGRAM_CREATED: 'program_created',
  PROGRAM_UPDATED: 'program_updated',
  PROGRAM_CANCELLED: 'program_cancelled',
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_APPROVED: 'application_approved',
  APPLICATION_REJECTED: 'application_rejected',
  ATTENDANCE_MARKED: 'attendance_marked',
  CERTIFICATE_GENERATED: 'certificate_generated',
  REWARD_EARNED: 'reward_earned',
  COINS_ADDED: 'coins_added',
  BADGE_EARNED: 'badge_earned',
  ORGANIZATION_APPROVED: 'organization_approved',
  ORGANIZATION_REJECTED: 'organization_rejected',
  ADMIN_ANNOUNCEMENT: 'admin_announcement',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  SECURITY_ALERT: 'security_alert',
  PASSWORD_CHANGED: 'password_changed',
  PROFILE_UPDATED: 'profile_updated',
  VOLUNTEER_LEVEL_UP: 'volunteer_level_up',
  LEADERBOARD_POSITION_CHANGED: 'leaderboard_position_changed',
};

const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const CHANNEL = {
  IN_APP: 'in-app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
};

const STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  SCHEDULED: 'scheduled',
};

const MESSAGES = {
  NOTIFICATION_CREATED: 'Notification created successfully',
  NOTIFICATIONS_FETCHED: 'Notifications retrieved successfully',
  NOTIFICATION_FETCHED: 'Notification retrieved successfully',
  NOTIFICATION_UPDATED: 'Notification updated successfully',
  NOTIFICATION_DELETED: 'Notification deleted successfully',
  ALL_NOTIFICATIONS_READ: 'All notifications marked as read',
  NO_NOTIFICATIONS: 'No notifications found',
  NOTIFICATION_NOT_FOUND: 'Notification not found',
};

const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    SORT_BY: 'createdAt',
    ORDER: 'desc',
  },
  PRIORITY: PRIORITY.MEDIUM,
  CHANNEL: CHANNEL.IN_APP,
  IS_READ: false,
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  MESSAGE_MAX_LENGTH: 1000,
  METADATA_MAX_DEPTH: 3,
};

module.exports = {
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNEL,
  STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
