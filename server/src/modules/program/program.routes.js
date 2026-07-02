const express = require('express');
const programController = require('./program.controller');
const {
  validateCreateProgram,
  validateUpdateProgram,
  validateGetProgram,
  validateListPrograms,
  validatePublishProgram,
  validateArchiveProgram,
  validateRestoreProgram,
  validateDeleteProgram,
  validateChangeProgramStatus,
} = require('./program.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize, isVolunteer } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// Public routes
router.get('/', authenticate, validateListPrograms, programController.listPrograms);
router.get('/me', authenticate, programController.getMyPrograms);
router.get('/:id', authenticate, validateGetProgram, programController.getProgram);

// Admin/Coordinator routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateCreateProgram,
  programController.createProgram
);
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateUpdateProgram,
  programController.updateProgram
);
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateDeleteProgram,
  programController.deleteProgram
);
router.patch(
  '/:id/publish',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validatePublishProgram,
  programController.publishProgram
);
router.patch(
  '/:id/archive',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateArchiveProgram,
  programController.archiveProgram
);
router.patch(
  '/:id/restore',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRestoreProgram,
  programController.restoreProgram
);
router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateChangeProgramStatus,
  programController.changeProgramStatus
);
router.get(
  '/statistics',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  programController.getStatistics
);

module.exports = router;
