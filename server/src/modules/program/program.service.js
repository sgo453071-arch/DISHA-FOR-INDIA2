const programRepository = require('./program.repository');
const { generateProgramId, generateProgramSlug } = require('./program.utils');
const { PROGRAM_STATUS, PROGRAM_MODE, PAGINATION } = require('./program.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

const ALLOWED_SORT_FIELDS = ['createdAt', 'startDate', 'registrationDeadline', 'title', 'status'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class ProgramService {
  async createProgram(userId, programData) {
    const {
      title,
      shortDescription,
      description,
      category,
      tags,
      mode,
      approvalRequired,
      maxVolunteers,
      startDate,
      endDate,
      registrationDeadline,
      country,
      state,
      city,
      address,
      customFields,
    } = programData;

    const programId = await generateProgramId();
    const slug = await generateProgramSlug(title);

    const program = await programRepository.create({
      programId,
      title,
      slug,
      shortDescription,
      description,
      category,
      tags,
      mode: mode || PROGRAM_MODE.OFFLINE,
      status: PROGRAM_STATUS.DRAFT,
      approvalRequired: approvalRequired || false,
      maxVolunteers,
      startDate,
      endDate,
      registrationDeadline,
      country: country || 'India',
      state,
      city,
      address,
      customFields: customFields || {},
      createdBy: userId,
      updatedBy: userId,
    });

    return { program };
  }

  async getProgram(programId, userRole) {
    const program = await programRepository.findById(
      programId,
      userRole === 'admin' || userRole === 'superadmin'
    );

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.isDeleted && userRole !== 'admin' && userRole !== 'superadmin') {
      throw new NotFoundError('Program not found');
    }

    return { program };
  }

  async updateProgram(userId, programId, updateData) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    const {
      title,
      shortDescription,
      description,
      category,
      tags,
      mode,
      approvalRequired,
      maxVolunteers,
      startDate,
      endDate,
      registrationDeadline,
      country,
      state,
      city,
      address,
      customFields,
    } = updateData;

    const slugUpdateNeeded = title && title !== program.title;
    let slug = program.slug;

    if (slugUpdateNeeded) {
      slug = await generateProgramSlug(title);
    }

    const updatedProgram = await programRepository.update(programId, {
      ...(title !== undefined && { title }),
      ...(slugUpdateNeeded && { slug }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      ...(mode !== undefined && { mode }),
      ...(approvalRequired !== undefined && { approvalRequired }),
      ...(maxVolunteers !== undefined && { maxVolunteers }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(registrationDeadline !== undefined && { registrationDeadline }),
      ...(country !== undefined && { country }),
      ...(state !== undefined && { state }),
      ...(city !== undefined && { city }),
      ...(address !== undefined && { address }),
      ...(customFields !== undefined && { customFields }),
      updatedBy: userId,
    });

    return { program: updatedProgram };
  }

  async deleteProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    await programRepository.softDelete(programId, userId);

    return { program };
  }

  async restoreProgram(userId, programId) {
    const program = await programRepository.findById(programId, true);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (!program.isDeleted) {
      throw new ValidationError('Program is not deleted');
    }

    const restoredProgram = await programRepository.restore(programId);

    if (restoredProgram && restoredProgram.slug) {
      const existingProgram = await programRepository.findBySlug(restoredProgram.slug);
      if (existingProgram && existingProgram._id.toString() !== programId.toString()) {
        const newSlug = await generateProgramSlug(restoredProgram.title);
        await programRepository.update(programId, { slug: newSlug });
      }
    }

    return { program: restoredProgram };
  }

  async publishProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.status === PROGRAM_STATUS.PUBLISHED) {
      throw new ValidationError('Program is already published');
    }

    if (program.status === PROGRAM_STATUS.ARCHIVED) {
      throw new ValidationError('Archived program cannot be published');
    }

    const validationErrors = [];

    if (!program.title || program.title.trim() === '') {
      validationErrors.push({ field: 'title', message: 'Title is required for publishing' });
    }
    if (!program.description || program.description.trim() === '') {
      validationErrors.push({
        field: 'description',
        message: 'Description is required for publishing',
      });
    }
    if (!program.category || program.category.trim() === '') {
      validationErrors.push({ field: 'category', message: 'Category is required for publishing' });
    }
    if (!program.startDate) {
      validationErrors.push({
        field: 'startDate',
        message: 'Start date is required for publishing',
      });
    }
    if (!program.endDate) {
      validationErrors.push({ field: 'endDate', message: 'End date is required for publishing' });
    }
    if (!program.city || program.city.trim() === '') {
      validationErrors.push({ field: 'city', message: 'City is required for publishing' });
    }

    if (validationErrors.length > 0) {
      throw new ValidationError('Program validation failed before publishing', validationErrors);
    }

    const publishedProgram = await programRepository.publish(programId);

    return { program: publishedProgram };
  }

  async archiveProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== PROGRAM_STATUS.PUBLISHED) {
      throw new ValidationError('Only published programs can be archived');
    }

    const archivedProgram = await programRepository.archive(programId);

    return { program: archivedProgram };
  }

  async listPrograms(queryParams, userRole) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      category,
      city,
      state,
      country,
      mode,
      status,
      createdBy,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    } = queryParams;

    const validPage = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );
    const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    const searchQuery = await programRepository.searchPrograms(search);
    const filterQuery = await programRepository.buildQueryFilters({
      category,
      city,
      state,
      country,
      mode,
      status,
      createdBy,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    });

    const combinedQuery = { ...filterQuery };
    if (search && search.trim() !== '') {
      Object.assign(combinedQuery, searchQuery);
    }

    if (userRole !== 'admin' && userRole !== 'superadmin') {
      combinedQuery.status = PROGRAM_STATUS.PUBLISHED;
    }

    const result = await programRepository.findAll(combinedQuery, {
      page: validPage,
      limit: validLimit,
      sortBy: validSortBy,
      sortOrder: validSortOrder,
    });

    const totalPages = Math.ceil(result.total / validLimit);

    return {
      programs: result.programs,
      pagination: {
        total: result.total,
        page: validPage,
        limit: validLimit,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  }

  async changeProgramStatus(userId, programId, newStatus) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (!Object.values(PROGRAM_STATUS).includes(newStatus)) {
      throw new ValidationError('Invalid status value');
    }

    const currentStatus = program.status;
    const validTransitions = this._getValidTransitions(currentStatus);

    if (newStatus !== PROGRAM_STATUS.CANCELLED && !validTransitions.includes(newStatus)) {
      throw new ValidationError(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    const updatedProgram = await programRepository.updateStatus(programId, newStatus);

    return { program: updatedProgram };
  }

  _getValidTransitions(currentStatus) {
    const transitions = {
      [PROGRAM_STATUS.DRAFT]: [PROGRAM_STATUS.PENDING_APPROVAL, PROGRAM_STATUS.PUBLISHED],
      [PROGRAM_STATUS.PENDING_APPROVAL]: [
        PROGRAM_STATUS.DRAFT,
        PROGRAM_STATUS.PUBLISHED,
        PROGRAM_STATUS.CANCELLED,
      ],
      [PROGRAM_STATUS.PUBLISHED]: [
        PROGRAM_STATUS.REGISTRATION_CLOSED,
        PROGRAM_STATUS.ONGOING,
        PROGRAM_STATUS.CANCELLED,
      ],
      [PROGRAM_STATUS.REGISTRATION_CLOSED]: [PROGRAM_STATUS.ONGOING, PROGRAM_STATUS.CANCELLED],
      [PROGRAM_STATUS.ONGOING]: [PROGRAM_STATUS.COMPLETED, PROGRAM_STATUS.CANCELLED],
      [PROGRAM_STATUS.COMPLETED]: [],
      [PROGRAM_STATUS.CANCELLED]: [],
      [PROGRAM_STATUS.ARCHIVED]: [],
    };
    return transitions[currentStatus] || [];
  }

  async getStatistics() {
    const stats = await programRepository.getStatistics();
    return stats;
  }

  async getMyPrograms(userId, queryParams) {
    const applicationRepository = require('../application/application.repository');
    const result = await applicationRepository.findMyPrograms(userId, {
      page: parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE,
      limit: parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    });

    const programs = result.applications.map((app) => app.program);
    const totalPages = Math.ceil(
      result.total / (parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );

    return {
      programs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1,
      },
    };
  }
}

module.exports = new ProgramService();
