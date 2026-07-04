import api from './api';

export const getNotifications = async (params = {}) => {
  return api.get('/notifications', { params });
};

export const getUnreadNotificationCount = async () => {
  return api.get('/notifications/unread/count');
};

export const markNotificationAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return api.patch('/notifications/read-all');
};

export const deleteNotification = async (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

export const restoreNotification = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/restore`);
};

export const searchNotifications = async ({ search, ...params }) => {
  return api.get('/notifications/search', { params: { search, ...params } });
};

export const getNotificationPreferences = async () => {
  return api.get('/notifications/preferences');
};

export const updateNotificationPreferences = async (data) => {
  return api.put('/notifications/preferences', data);
};
