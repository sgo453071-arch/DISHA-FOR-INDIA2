const APPLICATION_STATUS = {
  APPLIED: 'applied',
  JOINED: 'joined',
  COMPLETED: 'completed',
  WITHDRAWN: 'withdrawn',
  CANCELLED: 'cancelled',
};

const MESSAGES = {
  APPLICATION_CREATED: 'Application submitted successfully',
  APPLICATION_UPDATED: 'Application updated successfully',
  APPLICATION_DELETED: 'Application deleted successfully',
  APPLICATION_WITHDRAWN: 'Application withdrawn successfully',
  APPLICATION_FETCHED: 'Application retrieved successfully',
  APPLICATIONS_FETCHED: 'Applications retrieved successfully',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const VALIDATION = {
  ANSWERS_TYPE: 'object',
};

module.exports = {
  APPLICATION_STATUS,
  MESSAGES,
  PAGINATION,
  VALIDATION,
};
