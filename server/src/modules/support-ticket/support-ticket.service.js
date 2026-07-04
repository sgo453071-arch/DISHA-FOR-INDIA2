const supportTicketRepository = require('./support-ticket.repository');
const conversationRepository = require('../conversation/conversation.repository');
const { TICKET_STATUS } = require('./support-ticket.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class SupportTicketService {
  async createSupportTicket(userId, data) {
    const { subject, description, category = 'general', priority = 'medium', participantIds = [] } = data;

    const conversation = await conversationRepository.create({
      participants: [userId, ...participantIds],
      type: 'support',
      title: subject,
      status: 'active',
    });

    const ticket = await supportTicketRepository.create({
      conversationId: conversation._id,
      userId,
      subject,
      description,
      category,
      priority,
      status: TICKET_STATUS.OPEN,
    });

    return {
      ticket,
      conversation,
      successMessage: 'Support ticket created successfully',
    };
  }

  async getUserTickets(userId, query = {}) {
    const { page = 1, limit = 20, status, priority } = query;
    const result = await supportTicketRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
    });

    return {
      tickets: result.tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Support tickets retrieved successfully',
    };
  }

  async getAllTickets(query = {}) {
    const { page = 1, limit = 20, status, priority, assignedTo } = query;
    const result = await supportTicketRepository.findAll({
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
      assignedTo,
    });

    return {
      tickets: result.tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Support tickets retrieved successfully',
    };
  }

  async getTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    return {
      ticket,
      successMessage: 'Support ticket retrieved successfully',
    };
  }

  async updateTicket(userId, ticketId, updateData) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const allowedFields = ['subject', 'description', 'priority', 'category', 'resolution'];
    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    if (updateData.status) {
      const validStatuses = Object.values(TICKET_STATUS);
      if (!validStatuses.includes(updateData.status)) {
        throw new ValidationError('Invalid ticket status');
      }
      safeUpdate.status = updateData.status;
      if (updateData.status === 'resolved') {
        safeUpdate.resolvedAt = new Date();
      }
      if (updateData.status === 'closed') {
        safeUpdate.closedAt = new Date();
      }
    }

    const updated = await supportTicketRepository.update(ticketId, safeUpdate);

    return {
      ticket: updated,
      successMessage: 'Support ticket updated successfully',
    };
  }

  async assignTicket(userId, ticketId, assignToUserId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const updated = await supportTicketRepository.update(ticketId, {
      assignedTo: assignToUserId,
      status: TICKET_STATUS.IN_PROGRESS,
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket assigned successfully',
    };
  }

  async resolveTicket(userId, ticketId, resolution) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const updated = await supportTicketRepository.update(ticketId, {
      status: TICKET_STATUS.RESOLVED,
      resolution: resolution || null,
      resolvedAt: new Date(),
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket resolved successfully',
    };
  }

  async closeTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const updated = await supportTicketRepository.update(ticketId, {
      status: TICKET_STATUS.CLOSED,
      closedAt: new Date(),
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket closed successfully',
    };
  }

  async deleteTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    await supportTicketRepository.softDelete(ticketId, userId);

    return {
      successMessage: 'Support ticket deleted successfully',
    };
  }
}

module.exports = new SupportTicketService();
