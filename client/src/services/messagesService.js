import api from './api';

export const sendMessage = async (conversationId, data) => {
  return api.post(`/conversations/${conversationId}/messages`, data);
};

export const getMessages = async (conversationId, params = {}) => {
  return api.get(`/conversations/${conversationId}/messages`, { params });
};

export const getMessage = async (conversationId, messageId) => {
  return api.get(`/conversations/${conversationId}/messages/${messageId}`);
};

export const updateMessage = async (conversationId, messageId, content) => {
  return api.patch(`/conversations/${conversationId}/messages/${messageId}`, { content });
};

export const deleteMessage = async (conversationId, messageId) => {
  return api.delete(`/conversations/${conversationId}/messages/${messageId}`);
};

export const pinMessage = async (conversationId, messageId) => {
  return api.post(`/conversations/${conversationId}/messages/${messageId}/pin`);
};

export const unpinMessage = async (conversationId, messageId) => {
  return api.delete(`/conversations/${conversationId}/messages/${messageId}/pin`);
};

export const markMessageAsRead = async (conversationId, messageId) => {
  return api.post(`/conversations/${conversationId}/messages/${messageId}/read`);
};

export const getPinnedMessages = async (conversationId) => {
  return api.get(`/conversations/${conversationId}/pinned`);
};

export const searchMessages = async (conversationId, search, params = {}) => {
  return api.get(`/conversations/${conversationId}/messages/search`, { params: { search, ...params } });
};
