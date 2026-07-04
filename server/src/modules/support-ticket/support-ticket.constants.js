const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const TICKET_CATEGORIES = {
  TECHNICAL: 'technical',
  BILLING: 'billing',
  GENERAL: 'general',
  COMPLAINT: 'complaint',
  SUGGESTION: 'suggestion',
};

const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const MESSAGES = {
  CREATED: 'Support ticket created successfully',
  FETCHED: 'Support ticket retrieved successfully',
  UPDATED: 'Support ticket updated successfully',
  DELETED: 'Support ticket deleted successfully',
  ALL_FETCHED: 'Support tickets retrieved successfully',
  ASSIGNED: 'Support ticket assigned successfully',
  RESOLVED: 'Support ticket resolved successfully',
  CLOSED: 'Support ticket closed successfully',
};

const DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  SORT_BY: 'createdAt',
  ORDER: 'desc',
};

const VALIDATION = {
  SUBJECT_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
};

module.exports = {
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
  TICKET_STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
