const express = require('express');
const conversationController = require('./conversation.controller');
const {
  validateCreateConversation,
  validateGetConversations,
  validateGetConversation,
  validateUpdateConversation,
} = require('./conversation.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticate, validateCreateConversation, conversationController.createConversation);

router.get('/', authenticate, validateGetConversations, conversationController.getConversations);

router.get('/:id', authenticate, validateGetConversation, conversationController.getConversation);

router.patch('/:id', authenticate, validateUpdateConversation, conversationController.updateConversation);

router.patch('/:id/archive', authenticate, validateGetConversation, conversationController.archiveConversation);

router.delete('/:id', authenticate, validateGetConversation, conversationController.deleteConversation);

module.exports = router;
