import api from './api';

export const createSupportTicket = async (data) => {
  return api.post('/support-tickets', data);
};

export const getUserTickets = async (params = {}) => {
  return api.get('/support-tickets/my-tickets', { params });
};

export const getAllTickets = async (params = {}) => {
  return api.get('/support-tickets', { params });
};

export const getTicket = async (ticketId) => {
  return api.get(`/support-tickets/${ticketId}`);
};

export const updateTicket = async (ticketId, data) => {
  return api.patch(`/support-tickets/${ticketId}`, data);
};

export const assignTicket = async (ticketId, assignToUserId) => {
  return api.post(`/support-tickets/${ticketId}/assign`, { assignToUserId });
};

export const resolveTicket = async (ticketId, resolution) => {
  return api.post(`/support-tickets/${ticketId}/resolve`, { resolution });
};

export const closeTicket = async (ticketId) => {
  return api.post(`/support-tickets/${ticketId}/close`);
};

export const deleteTicket = async (ticketId) => {
  return api.delete(`/support-tickets/${ticketId}`);
};
