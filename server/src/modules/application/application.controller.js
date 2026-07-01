const applicationService = require('./application.service');
const { MESSAGES } = require('./application.constants');
const { successResponse } = require('../../utils/response');

class ApplicationController {
  applyToProgram = async (req, res, next) => {
    try {
      const result = await applicationService.applyToProgram(
        req.user.id,
        req.body.programId,
        req.body.answers
      );
      return successResponse(res, 201, MESSAGES.APPLICATION_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  withdrawApplication = async (req, res, next) => {
    try {
      const result = await applicationService.withdrawApplication(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.APPLICATION_WITHDRAWN, result);
    } catch (error) {
      return next(error);
    }
  };

  getApplication = async (req, res, next) => {
    try {
      const result = await applicationService.getApplication(
        req.user.id,
        req.params.id,
        req.user.role
      );
      return successResponse(res, 200, MESSAGES.APPLICATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getMyApplications = async (req, res, next) => {
    try {
      const result = await applicationService.getMyApplications(req.user.id, req.query);
      return successResponse(res, 200, 'My applications retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getMyPrograms = async (req, res, next) => {
    try {
      const result = await applicationService.getMyPrograms(req.user.id, req.query);
      return successResponse(res, 200, 'My programs retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getAdminApplications = async (req, res, next) => {
    try {
      const result = await applicationService.getAdminApplications(req.query);
      return successResponse(res, 200, 'Applications retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  bulkUpdateApplications = async (req, res, next) => {
    try {
      const { ids, status } = req.body;
      const result = await applicationService.bulkUpdateApplications(req.user.id, ids, status);
      return successResponse(res, 200, 'Bulk update completed successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getApplicationStatistics = async (req, res, next) => {
    try {
      const result = await applicationService.getApplicationStatistics();
      return successResponse(res, 200, 'Application statistics retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ApplicationController();
