const conversationRepository = require('./conversation.repository');
const { CONVERSATION_STATUS } = require('./conversation.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class ConversationService {
  async createConversation(userId, data) {
    const { participantIds, type = 'private', title } = data;

    const uniqueParticipants = Array.from(new Set([userId, ...participantIds]));

    if (uniqueParticipants.length < 2) {
      throw new ValidationError('A conversation requires at least 2 participants');
    }

    const conversation = await conversationRepository.create({
      participants: uniqueParticipants,
      type,
      title,
      status: CONVERSATION_STATUS.ACTIVE,
    });

    return {
      conversation,
      successMessage: 'Conversation created successfully',
    };
  }

  async getUserConversations(userId, query = {}) {
    const { page = 1, limit = 20, type, sortBy = 'lastMessageAt', order = 'desc' } = query;
    const result = await conversationRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      type,
      sortBy,
      order,
    });

    return {
      conversations: result.conversations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Conversations retrieved successfully',
    };
  }

  async getConversation(userId, conversationId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    return {
      conversation,
      successMessage: 'Conversation retrieved successfully',
    };
  }

  async updateConversation(userId, conversationId, updateData) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const allowedFields = ['title', 'status', 'lastMessageAt', 'lastMessagePreview'];
    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    const updated = await conversationRepository.update(conversationId, safeUpdate);

    return {
      conversation: updated,
      successMessage: 'Conversation updated successfully',
    };
  }

  async archiveConversation(userId, conversationId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const updated = await conversationRepository.update(conversationId, {
      status: CONVERSATION_STATUS.ARCHIVED,
    });

    return {
      conversation: updated,
      successMessage: 'Conversation archived successfully',
    };
  }

  async deleteConversation(userId, conversationId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    await conversationRepository.softDelete(conversationId, userId);

    return {
      successMessage: 'Conversation deleted successfully',
    };
  }
}

module.exports = new ConversationService();
