const applicationRepository = require('./application.repository');
const programRepository = require('../program/program.repository');
const { generateApplicationId } = require('./application.utils');
const { APPLICATION_STATUS, PAGINATION } = require('./application.constants');
const { PROGRAM_STATUS } = require('../program/program.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');
const notificationService = require('../notification/notification.service');
// Import Application model for capacity check
const Application = require('./application.model');


class ApplicationService {
  async applyToProgram(userId, programId, answers) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== PROGRAM_STATUS.PUBLISHED && program.status !== PROGRAM_STATUS.ONGOING) {
      throw new ValidationError('This program is not currently accepting applications');
    }

    if (program.registrationDeadline && new Date() > new Date(program.registrationDeadline)) {
      throw new ValidationError('Registration deadline has passed');
    }

    // Capacity validation: ensure program has available slots
    if (program.maxVolunteers) {
      const existingCount = await Application.countDocuments({
        program: programId,
        status: { $in: [APPLICATION_STATUS.APPLIED, APPLICATION_STATUS.JOINED] },
        isDeleted: false,
      });
      if (existingCount >= program.maxVolunteers) {
        throw new ValidationError('Program has reached its maximum volunteer capacity');
      }
    }

    const existingApplication = await applicationRepository.findExistingApplication(
      userId,
      programId
    );
    if (existingApplication) {
      throw new ConflictError('You have already applied to this program');
    }

    const application = await applicationRepository.create({
      applicationId: await generateApplicationId(),
      user: userId,
      program: programId,
      answers: answers || {},
      status: APPLICATION_STATUS.APPLIED,
      appliedAt: new Date(),
      joinedAt: new Date(),
    });

    try {
      await notificationService.sendInAppNotification('buildApplicationSubmitted', {
        recipientId: userId,
        programName: program.title,
        programId: programId.toString(),
        applicationId: application._id.toString(),
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return { application };
  }

  async withdrawApplication(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (
      application.user._id.toString() !== userId.toString() &&
      application.user.toString() !== userId
    ) {
      throw new ValidationError('You can only withdraw your own application');
    }

    if (
      application.status === APPLICATION_STATUS.WITHDRAWN ||
      application.status === APPLICATION_STATUS.COMPLETED ||
      application.status === APPLICATION_STATUS.CANCELLED
    ) {
      throw new ValidationError('Application cannot be withdrawn');
    }

    if (application.program.startDate) {
      const programStart = new Date(application.program.startDate);
      const now = new Date();
      const hoursRemaining = (programStart - now) / (1000 * 60 * 60);
      if (hoursRemaining < 24) {
        throw new ValidationError('Cannot withdraw less than 24 hours before program start');
      }
    }

    const withdrawnApplication = await applicationRepository.withdraw(applicationId, userId);

    try {
      const program = application.program || (await programRepository.findById(application.program.toString()));
      await notificationService.sendInAppNotification('buildApplicationWithdrawn', {
        recipientId: userId,
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return { application: withdrawnApplication };
  }

  async getApplication(userId, applicationId, userRole) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (userRole !== 'admin' && userRole !== 'superadmin' && userRole !== 'coordinator') {
      if (
        application.user._id.toString() !== userId.toString() &&
        application.user.toString() !== userId
      ) {
        throw new NotFoundError('Application not found');
      }
    }

    return { application };
  }

  async getMyApplications(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyApplications(userId, {
      ...queryParams,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getMyPrograms(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyPrograms(userId, {
      ...queryParams,
      page,
      limit,
    });

    const programs = result.applications.map((app) => {
      const progObj = app.program.toObject ? app.program.toObject() : app.program;
      return {
        ...progObj,
        id: progObj._id,
        applicationId: app._id,
        programTitle: progObj.title
      };
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      programs,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getAdminApplications(queryParams) {
    let { page, limit, sortBy, sortOrder, status, program, user, city, state } = queryParams;

    // Normalize combined sortBy values like 'date_desc', 'date_asc', 'name_asc'
    const SORT_MAP = {
      date_desc: { sortBy: 'createdAt', sortOrder: 'desc' },
      date_asc: { sortBy: 'createdAt', sortOrder: 'asc' },
      name_asc: { sortBy: 'createdAt', sortOrder: 'asc' },
      name_desc: { sortBy: 'createdAt', sortOrder: 'desc' },
      status_asc: { sortBy: 'status', sortOrder: 'asc' },
      status_desc: { sortBy: 'status', sortOrder: 'desc' },
    };
    if (sortBy && SORT_MAP[sortBy]) {
      sortOrder = SORT_MAP[sortBy].sortOrder;
      sortBy = SORT_MAP[sortBy].sortBy;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    const limitNum = Math.min(
      Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const filters = {};

    if (status && status !== '') filters.status = status;
    if (program) filters.program = program;
    if (user) filters.user = user;
    if (city) filters['program.city'] = new RegExp(city, 'i');
    if (state) filters['program.state'] = new RegExp(state, 'i');

    const result = await applicationRepository.findAdminApplications(filters, {
      page: pageNum,
      limit: limitNum,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });

    const totalPages = Math.ceil(result.total / limitNum);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    };
  }

  async bulkUpdateApplications(userId, ids, newStatus) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('Invalid application IDs');
    }

    if (!Object.values(APPLICATION_STATUS).includes(newStatus)) {
      throw new ValidationError('Invalid status value');
    }

    const applications = await applicationRepository.findByIds(ids);
    await applicationRepository.bulkUpdate(ids, { status: newStatus });

    for (const application of applications) {
      try {
        const program = application.program || await programRepository.findById(application.program.toString());
        const recipientId = application.user._id || application.user;
        if (newStatus === APPLICATION_STATUS.JOINED) {
          await notificationService.sendInAppNotification('buildApplicationApproved', {
            recipientId: recipientId.toString(),
            programName: program?.title || 'Program',
            applicationId: application._id.toString(),
          });
        } else if (newStatus === APPLICATION_STATUS.REJECTED) {
          await notificationService.sendInAppNotification('buildApplicationRejected', {
            recipientId: recipientId.toString(),
            programName: program?.title || 'Program',
            applicationId: application._id.toString(),
            reason: 'Your application has been rejected',
          });
        }
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    return { updatedCount: ids.length };
  }

  async getApplicationStatistics() {
    return applicationRepository.getStatistics();
  }

  async approveApplication(adminId, applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new NotFoundError('Application not found');
    if (application.status === APPLICATION_STATUS.APPROVED || application.status === APPLICATION_STATUS.JOINED) {
      throw new ValidationError('Application is already approved');
    }
    const updated = await applicationRepository.approve(applicationId);
    try {
      const program = application.program;
      await notificationService.sendInAppNotification('buildApplicationApproved', {
        recipientId: (application.user._id || application.user).toString(),
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
      });
    } catch (_err) { /* non-blocking */ }
    return { application: updated };
  }

  async rejectApplication(adminId, applicationId, reason) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new NotFoundError('Application not found');
    if (application.status === APPLICATION_STATUS.REJECTED) {
      throw new ValidationError('Application is already rejected');
    }
    const updated = await applicationRepository.reject(applicationId, reason);
    try {
      const program = application.program;
      await notificationService.sendInAppNotification('buildApplicationRejected', {
        recipientId: (application.user._id || application.user).toString(),
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
        reason: reason || 'Your application has been reviewed.',
      });
    } catch (_err) { /* non-blocking */ }
    return { application: updated };
  }

  /**
   * Returns a volunteer's own application counts (used when volunteer hits /stats).
   */
  async getMyApplicationStats(userId) {
    const Application = require('./application.model');
    const { APPLICATION_STATUS } = require('./application.constants');

    const [total, joined, withdrawn, completed, cancelled] = await Promise.all([
      Application.countDocuments({ user: userId, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.JOINED, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.WITHDRAWN, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.COMPLETED, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.CANCELLED, isDeleted: false }),
    ]);

    return { total, joined, withdrawn, completed, cancelled };
  }
}

module.exports = new ApplicationService();
