import api from './api';

export const getProgramRecommendations = async (params = {}) => {
  return await api.get('/matching/programs', { params });
};

export const getVolunteerRecommendations = async (params = {}) => {
  return await api.get('/matching/volunteers', { params });
};

export const getDetailedRecommendation = async (params = {}) => {
  return await api.get('/matching/recommendations', { params });
};

export default {
  getProgramRecommendations,
  getVolunteerRecommendations,
  getDetailedRecommendation,
};
