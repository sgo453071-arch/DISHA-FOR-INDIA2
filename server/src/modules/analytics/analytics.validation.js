/**
 * Analytics validation constants
 * Validation is handled inline in routes or passed to controller
 */

const DATE_RANGES = [
  '', 'today', 'this_week', 'this_month', 'last_month', 'last_3_months', 'last_6_months', 'last_year', null
];

/**
 * Validate date range parameter
 * @param {string} dateRange - Date range value to validate
 * @returns {boolean} Valid or not
 */
const isValidDateRange = (dateRange) => {
  if (!dateRange) return true;
  return DATE_RANGES.includes(dateRange);
};

/**
 * Validate limit parameter
 * @param {number} limit - Limit value to validate
 * @returns {boolean} Valid or not
 */
const isValidLimit = (limit) => {
  if (!limit) return true;
  const num = parseInt(limit, 10);
  return !isNaN(num) && num >= 1 && num <= 100;
};

module.exports = {
  DATE_RANGES,
  isValidDateRange,
  isValidLimit,
};