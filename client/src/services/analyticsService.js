import api from './api';

/**
 * Analytics Service
 * Provides functions to fetch analytics data from the backend
 */

// Dashboard Statistics
export const getVolunteerDashboard = async () => {
  return api.get('/analytics/dashboard/volunteer');
};

export const getAdminDashboard = async () => {
  return api.get('/analytics/dashboard/admin');
};

export const getSuperAdminDashboard = async () => {
  return api.get('/analytics/dashboard/super-admin');
};

// Analytics Reports
export const getVolunteerAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/volunteers', { params });
};

export const getProgramAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/programs', { params });
};

export const getApplicationAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/applications', { params });
};

export const getAttendanceAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/attendance', { params });
};

export const getCertificateAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/certificates', { params });
};

export const getRewardAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/rewards', { params });
};

export const getLeaderboardAnalytics = async (limit = 10) => {
  return api.get('/analytics/leaderboard', { params: { limit } });
};

export const getOrganizationAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/organizations', { params });
};

// Legacy compatibility
export const getDashboardStatistics = getAdminDashboard;