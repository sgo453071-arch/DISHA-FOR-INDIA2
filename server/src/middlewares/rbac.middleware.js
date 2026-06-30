const ROLES = require('../constants/roles.constants');
const { MESSAGES } = require('../modules/auth/auth.constants');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Middleware to authorize access based on user roles.
 * @param {...string} allowedRoles - Roles allowed to access the route.
 * @returns {Function} Express middleware function.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Auth middleware must run before rbac middleware
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(MESSAGES.FORBIDDEN));
    }

    return next();
  };
};

/**
 * Reusable helper middleware to check if user has Admin (or Super Admin) role.
 */
const isAdmin = authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN);

/**
 * Reusable helper middleware to check if user has Volunteer role.
 */
const isVolunteer = authorize(ROLES.VOLUNTEER);

/**
 * Reusable helper middleware to check if user has Guest role.
 */
const isGuest = authorize(ROLES.GUEST);

/**
 * Reusable helper middleware to check if user has either Admin, Super Admin, or Volunteer role.
 */
const isAdminOrVolunteer = authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.VOLUNTEER);

module.exports = {
  authorize,
  isAdmin,
  isVolunteer,
  isGuest,
  isAdminOrVolunteer,
};
