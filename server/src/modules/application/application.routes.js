const express = require('express');
const applicationController = require('./application.controller');
const {
  validateApplyToProgram,
  validateWithdrawApplication,
  validateGetApplication,
  validateMyApplications,
  validateMyPrograms,
  validateAdminApplications,
  validateBulkUpdate,
} = require('./application.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ─── Static routes MUST come before /:id ───────────────────────────

// Volunteer: get my applications
router.get('/me', authenticate, validateMyApplications, applicationController.getMyApplications);

// Admin/Coordinator: get statistics (static path – must be before /:id)
router.get(
  '/stats',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  applicationController.getApplicationStatistics
);

// Admin/Coordinator: get all applications with filters (GET /)
router.get(
  '/',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAdminApplications,
  applicationController.getAdminApplications
);

// Admin/Coordinator: bulk status update
router.patch(
  '/bulk',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateBulkUpdate,
  applicationController.bulkUpdateApplications
);

// Volunteer: apply to a program
router.post(
  '/',
  authenticate,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateApplyToProgram,
  applicationController.applyToProgram
);

// Volunteer: withdraw an application
router.patch(
  '/:id/withdraw',
  authenticate,
  validateWithdrawApplication,
  applicationController.withdrawApplication
);

// ─── Dynamic /:id route MUST be last ────────────────────────────────
router.get('/:id', authenticate, validateGetApplication, applicationController.getApplication);

module.exports = router;
