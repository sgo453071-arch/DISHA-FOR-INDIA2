const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ============================================================
// DASHBOARD STATISTICS (Module 11.1)
// ============================================================

/**
 * @route GET /api/v1/analytics/dashboard/volunteer
 * @desc Get volunteer dashboard statistics
 * @access Private - Volunteers, Coordinators, Admins, Super Admins
 */
router.get(
  '/dashboard/volunteer',
  authenticate,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  analyticsController.getVolunteerDashboard
);

/**
 * @route GET /api/v1/analytics/dashboard/admin
 * @desc Get admin dashboard statistics
 * @access Private - Admins, Super Admins
 */
router.get(
  '/dashboard/admin',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  analyticsController.getAdminDashboard
);

/**
 * @route GET /api/v1/analytics/dashboard/super-admin
 * @desc Get super admin dashboard statistics
 * @access Private - Super Admins only
 */
router.get(
  '/dashboard/super-admin',
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  analyticsController.getSuperAdminDashboard
);

// ============================================================
// VOLUNTEER ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/volunteers
 * @desc Get volunteer analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/volunteers',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getVolunteerAnalytics
);

// ============================================================
// PROGRAM ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/programs
 * @desc Get program analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/programs',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getProgramAnalytics
);

// ============================================================
// APPLICATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/applications
 * @desc Get application analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/applications',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getApplicationAnalytics
);

// ============================================================
// ATTENDANCE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/attendance
 * @desc Get attendance analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/attendance',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getAttendanceAnalytics
);

// ============================================================
// CERTIFICATE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/certificates
 * @desc Get certificate analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/certificates',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getCertificateAnalytics
);

// ============================================================
// REWARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/rewards
 * @desc Get reward analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/rewards',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getRewardAnalytics
);

// ============================================================
// LEADERBOARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/leaderboard
 * @desc Get leaderboard analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/leaderboard',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getLeaderboardAnalytics
);

// ============================================================
// ORGANIZATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/organizations
 * @desc Get organization analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/organizations',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getOrganizationAnalytics
);

module.exports = router;