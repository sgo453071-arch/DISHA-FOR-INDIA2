import api from './api';

export const createConversation = async (data) => {
  return api.post('/conversations', data);
};

export const getConversations = async (params = {}) => {
  return api.get('/conversations', { params });
};

export const getConversation = async (conversationId) => {
  return api.get(`/conversations/${conversationId}`);
};

export const updateConversation = async (conversationId, data) => {
  return api.patch(`/conversations/${conversationId}`, data);
};

export const archiveConversation = async (conversationId) => {
  return api.patch(`/conversations/${conversationId}/archive`);
};

export const deleteConversation = async (conversationId) => {
  return api.delete(`/conversations/${conversationId}`);
};
