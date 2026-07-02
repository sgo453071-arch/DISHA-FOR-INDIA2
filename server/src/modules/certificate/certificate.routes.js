const express = require('express');
const certificateController = require('./certificate.controller');
const {
  validateGenerateCertificate,
  validateAutoGenerate,
  validateDownloadCertificate,
  validateVerifyCertificate,
  validateRevokeCertificate,
} = require('./certificate.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.get('/verify/:certificateNumber', validateVerifyCertificate, certificateController.verifyCertificate);

router.use(authenticate);

router.post('/generate', validateGenerateCertificate, certificateController.generateCertificate);
router.get('/me', certificateController.getMyCertificates);
router.get('/', certificateController.getMyCertificates);
router.get('/:id', validateDownloadCertificate, certificateController.getCertificate);
router.get('/:id/download', validateDownloadCertificate, certificateController.downloadCertificate);

router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.post('/admin/auto-generate/:programId', validateAutoGenerate, certificateController.autoGenerateForProgram);
router.post('/admin/:id/revoke', validateRevokeCertificate, certificateController.revokeCertificate);

module.exports = router;
