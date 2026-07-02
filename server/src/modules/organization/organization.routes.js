const express = require('express');
const organizationController = require('./organization.controller');
const {
  validateCreateOrganization,
  validateUpdateOrganization,
  validateOrganizationId,
  validateListOrganizations,
  validateApproveOrganization,
  validateRejectOrganization,
  validateAssignAdmin,
  validateTransferOwnership,
} = require('./organization.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize, isAdmin } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// Create Organization - Super Admin only
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN), validateCreateOrganization, organizationController.createOrganization);

// List Organizations - Authenticated users
router.get('/', authenticate, validateListOrganizations, organizationController.listOrganizations);

// Get Organization by ID
router.get('/:id', authenticate, validateOrganizationId, organizationController.getOrganization);

// Update Organization - Owner/Admin
router.put('/:id', authenticate, validateOrganizationId, validateUpdateOrganization, organizationController.updateOrganization);

// Delete Organization - Owner/Super Admin
router.delete('/:id', authenticate, validateOrganizationId, organizationController.deleteOrganization);

// Admin actions - Super Admin or Admin
router.patch('/:id/approve', authenticate, isAdmin, validateOrganizationId, validateApproveOrganization, organizationController.approveOrganization);
router.patch('/:id/reject', authenticate, isAdmin, validateOrganizationId, validateRejectOrganization, organizationController.rejectOrganization);
router.patch('/:id/activate', authenticate, isAdmin, validateOrganizationId, organizationController.activateOrganization);
router.patch('/:id/deactivate', authenticate, isAdmin, validateOrganizationId, organizationController.deactivateOrganization);
router.patch('/:id/archive', authenticate, isAdmin, validateOrganizationId, organizationController.archiveOrganization);
router.patch('/:id/restore', authenticate, isAdmin, validateOrganizationId, organizationController.restoreOrganization);
router.patch('/:id/assign-admin', authenticate, isAdmin, validateOrganizationId, validateAssignAdmin, organizationController.assignAdmin);
router.patch('/:id/remove-admin', authenticate, isAdmin, validateOrganizationId, validateAssignAdmin, organizationController.removeAdmin);
router.patch('/:id/transfer-owner', authenticate, isAdmin, validateOrganizationId, validateTransferOwnership, organizationController.transferOwnership);

module.exports = router;