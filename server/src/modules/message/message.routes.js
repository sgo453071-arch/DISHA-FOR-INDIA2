const express = require('express');
const messageController = require('./message.controller');
const {
  validateSendMessage,
  validateGetMessages,
  validateGetMessage,
  validateUpdateMessage,
  validateSearchMessages,
} = require('./message.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/:conversationId/messages', authenticate, validateSendMessage, messageController.sendMessage);

router.get('/:conversationId/messages', authenticate, validateGetMessages, messageController.getMessages);

router.get('/:conversationId/messages/search', authenticate, validateSearchMessages, messageController.searchMessages);

router.get('/:conversationId/messages/:messageId', authenticate, validateGetMessage, messageController.getMessage);

router.patch('/:conversationId/messages/:messageId', authenticate, validateUpdateMessage, messageController.updateMessage);

router.delete('/:conversationId/messages/:messageId', authenticate, validateGetMessage, messageController.deleteMessage);

router.post('/:conversationId/messages/:messageId/pin', authenticate, validateGetMessage, messageController.pinMessage);

router.delete('/:conversationId/messages/:messageId/pin', authenticate, validateGetMessage, messageController.unpinMessage);

router.post('/:conversationId/messages/:messageId/read', authenticate, validateGetMessage, messageController.markAsRead);

router.get('/:conversationId/pinned', authenticate, validateGetMessage, messageController.getPinnedMessages);

module.exports = router;
