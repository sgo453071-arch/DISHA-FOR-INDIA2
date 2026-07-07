const messageRepository = require('./message.repository');
const conversationRepository = require('../conversation/conversation.repository');
const { MESSAGE_STATUS, MESSAGE_TYPES } = require('./message.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const { broadcastToConversation, broadcastToUser } = require('../../socket/socketServer');

class MessageService {
  async sendMessage(senderId, conversationId, data) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, senderId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.map((p) => p.toString()).includes(senderId.toString())) {
      throw new ValidationError('You are not a participant of this conversation');
    }

    const { content, attachments = [], type = 'text' } = data;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new ValidationError('Message must have content or attachments');
    }

    const message = await messageRepository.create({
      conversationId,
      senderId,
      content: content || '',
      type,
      attachments: attachments.map((a) => ({
        type: a.type || MESSAGE_TYPES.DOCUMENT,
        url: a.url,
        name: a.name,
        size: a.size,
        mimeType: a.mimeType,
      })),
      status: MESSAGE_STATUS.SENT,
    });

    await conversationRepository.update(conversationId, {
      lastMessageAt: new Date(),
      lastMessagePreview: content || `${attachments.length} attachment(s)`,
    });

    try {
      await broadcastToConversation(conversationId.toString(), 'new-message', {
        message,
        conversationId: conversationId.toString(),
      });
      
      if (conversation.participants && Array.isArray(conversation.participants)) {
        conversation.participants.forEach((participantId) => {
          broadcastToUser(participantId.toString(), 'new-message', {
            message,
            conversationId: conversationId.toString(),
          });
        });
      }
    } catch (_error) {
      // Socket broadcast is non-blocking
    }

    return {
      message,
      successMessage: 'Message sent successfully',
    };
  }

  async getMessages(userId, conversationId, query = {}) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const { page = 1, limit = 50, cursor, sortBy = 'createdAt', order = 'asc' } = query;
    const result = await messageRepository.findByConversationId(conversationId, {
      page: Number(page),
      limit: Number(limit),
      cursor,
      sortBy,
      order,
    });

    return {
      messages: result.messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
        hasMore: result.hasMore,
      },
      successMessage: 'Messages retrieved successfully',
    };
  }

  async getMessage(userId, conversationId, messageId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const message = await messageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    return {
      message,
      successMessage: 'Message retrieved successfully',
    };
  }

  async updateMessage(userId, conversationId, messageId, content) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const message = await messageRepository.findById(messageId);

    if (!message || message.conversationId.toString() !== conversationId) {
      throw new NotFoundError('Message not found');
    }

    if (message.senderId.toString() !== userId.toString()) {
      throw new ValidationError('You can only edit your own messages');
    }

    const updated = await messageRepository.update(messageId, {
      content,
      isEdited: true,
    });

    return {
      message: updated,
      successMessage: 'Message updated successfully',
    };
  }

  async deleteMessage(userId, conversationId, messageId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const message = await messageRepository.findById(messageId);

    if (!message || message.conversationId.toString() !== conversationId) {
      throw new NotFoundError('Message not found');
    }

    if (!conversation.participants.map((p) => p.toString()).includes(userId.toString())) {
      throw new ValidationError('You are not authorized to delete this message');
    }

    await messageRepository.softDelete(messageId, userId);

    return { successMessage: 'Message deleted successfully' };
  }

  async pinMessage(userId, conversationId, messageId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const message = await messageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    const updated = await messageRepository.update(messageId, { isPinned: true });

    return {
      message: updated,
      successMessage: 'Message pinned successfully',
    };
  }

  async unpinMessage(userId, conversationId, messageId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const message = await messageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    const updated = await messageRepository.update(messageId, { isPinned: false });

    return {
      message: updated,
      successMessage: 'Message unpinned successfully',
    };
  }

  async markAsRead(userId, conversationId, messageId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    await messageRepository.markAsRead(messageId, userId);

    return { successMessage: 'Message marked as read' };
  }

  async markConversationAsRead(userId, conversationId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    await messageRepository.markConversationAsRead(conversationId, userId);

    return { successMessage: 'Conversation marked as read' };
  }

  async getPinnedMessages(userId, conversationId) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const messages = await messageRepository.findPinnedByConversationId(conversationId);

    return {
      messages,
      successMessage: 'Pinned messages retrieved successfully',
    };
  }

  async searchMessages(userId, conversationId, searchQuery, query = {}) {
    const conversation = await conversationRepository.findByIdAndUser(conversationId, userId);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const result = await messageRepository.searchMessages(conversationId, searchQuery, query);

    return {
      messages: result.messages,
      total: result.total,
      successMessage: 'Messages retrieved successfully',
    };
  }
}

module.exports = new MessageService();
