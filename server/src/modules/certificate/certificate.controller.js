const certificateService = require('./certificate.service');
const { MESSAGES } = require('./certificate.constants');
const { successResponse } = require('../../utils/response');

class CertificateController {
  generateCertificate = async (req, res, next) => {
    try {
      const { programId, applicationId, attendanceId, volunteerHours } = req.body;
      const certificate = await certificateService.generateCertificate(
        req.user.id,
        programId,
        { applicationId, attendanceId, volunteerHours },
        req.user.id,
        `${req.protocol}://${req.get('host')}`
      );
      return successResponse(res, 201, MESSAGES.CERTIFICATE_GENERATED, certificate);
    } catch (error) {
      return next(error);
    }
  };

  autoGenerateForProgram = async (req, res, next) => {
    try {
      const { programId } = req.params;
      const results = await certificateService.autoGenerateForProgram(programId);
      return successResponse(res, 200, 'Auto-generation completed', results);
    } catch (error) {
      return next(error);
    }
  };

  verifyCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.verifyCertificate(req.params.certificateNumber);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_VERIFIED, result);
    } catch (error) {
      return next(error);
    }
  };

  downloadCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.downloadCertificate(req.params.id, req.user.id, req.user.role);
      if (result.certificateUrl) {
        return res.redirect(result.certificateUrl);
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificate-${result.certificate.certificateNumber}.pdf`);
      return res.send(result.pdfBuffer);
    } catch (error) {
      return next(error);
    }
  };

  revokeCertificate = async (req, res, next) => {
    try {
      const revoked = await certificateService.revokeCertificate(req.params.id, req.user.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_REVOKED, revoked);
    } catch (error) {
      return next(error);
    }
  };

  getMyCertificates = async (req, res, next) => {
    try {
      const result = await certificateService.getMyCertificates(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.CERTIFICATES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.getCertificate(req.params.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new CertificateController();
