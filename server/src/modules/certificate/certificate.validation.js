const ValidationError = require('../../utils/errors/ValidationError');

const validateGenerateCertificate = (req, res, next) => {
  const { programId, applicationId, attendanceId, volunteerHours } = req.body;
  const errors = [];

  if (!programId || typeof programId !== 'string' || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  if (applicationId && typeof applicationId !== 'string') {
    errors.push({ field: 'applicationId', message: 'Application ID must be a string' });
  }

  if (attendanceId && typeof attendanceId !== 'string') {
    errors.push({ field: 'attendanceId', message: 'Attendance ID must be a string' });
  }

  if (volunteerHours !== undefined && (typeof volunteerHours !== 'number' || volunteerHours < 0)) {
    errors.push({ field: 'volunteerHours', message: 'Volunteer hours must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Certificate generation validation failed', errors));
  }

  return next();
};

const validateAutoGenerate = (req, res, next) => {
  const { programId } = req.params;
  const errors = [];

  if (!programId || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Auto-generate validation failed', errors));
  }

  return next();
};

const validateDownloadCertificate = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'id', message: 'Certificate ID is required' }]));
  }

  return next();
};

const validateVerifyCertificate = (req, res, next) => {
  const { certificateNumber } = req.params;

  if (!certificateNumber || certificateNumber.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'certificateNumber', message: 'Certificate number is required' }]));
  }

  return next();
};

const validateRevokeCertificate = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'id', message: 'Certificate ID is required' }]));
  }

  return next();
};

module.exports = {
  validateGenerateCertificate,
  validateAutoGenerate,
  validateDownloadCertificate,
  validateVerifyCertificate,
  validateRevokeCertificate,
};
