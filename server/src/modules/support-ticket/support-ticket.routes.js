const express = require('express');
const supportTicketController = require('./support-ticket.controller');
const {
  validateCreateSupportTicket,
  validateGetSupportTickets,
  validateGetSupportTicket,
  validateUpdateSupportTicket,
  validateAssignTicket,
} = require('./support-ticket.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticate, validateCreateSupportTicket, supportTicketController.createSupportTicket);

router.get('/my-tickets', authenticate, validateGetSupportTickets, supportTicketController.getUserTickets);

router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), validateGetSupportTickets, supportTicketController.getAllTickets);

router.get('/:id', authenticate, validateGetSupportTicket, supportTicketController.getTicket);

router.patch('/:id', authenticate, validateUpdateSupportTicket, supportTicketController.updateTicket);

router.post('/:id/assign', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), validateAssignTicket, supportTicketController.assignTicket);

router.post('/:id/resolve', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), validateAssignTicket, supportTicketController.resolveTicket);

router.post('/:id/close', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), validateAssignTicket, supportTicketController.closeTicket);

router.delete('/:id', authenticate, validateGetSupportTicket, supportTicketController.deleteTicket);

module.exports = router;
