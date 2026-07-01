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

// ─── Volunteer Routes ──────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateApplyToProgram,
  applicationController.applyToProgram
);

router.get('/me', authenticate, validateMyApplications, applicationController.getMyApplications);

router.patch(
  '/:id/withdraw',
  authenticate,
  validateWithdrawApplication,
  applicationController.withdrawApplication
);

// ─── Shared Routes ───────────────────────────────────────────────────
router.get('/:id', authenticate, validateGetApplication, applicationController.getApplication);

module.exports = router;
