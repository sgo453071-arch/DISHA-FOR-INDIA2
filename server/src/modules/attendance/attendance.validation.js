const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validation skeleton for checking in.
 */
const validateCheckIn = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for checking out.
 */
const validateCheckOut = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for manually marking attendance (Admin/Coordinator).
 */
const validateMarkAttendance = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for getting a specific attendance record.
 */
const validateGetAttendance = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for getting my attendance.
 */
const validateMyAttendance = (req, res, next) => {
  return next();
};

/**
 * Validation skeleton for getting attendance history.
 */
const validateAttendanceHistory = (req, res, next) => {
  return next();
};

module.exports = {
  validateCheckIn,
  validateCheckOut,
  validateMarkAttendance,
  validateGetAttendance,
  validateMyAttendance,
  validateAttendanceHistory,
};
