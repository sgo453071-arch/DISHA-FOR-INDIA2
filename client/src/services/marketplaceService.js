import api from './api';

export const getMarketplaceCatalog = async (params = {}) => {
  const res = await api.get('/rewards/marketplace', { params });
  return res?.data || null;
};

export const getFeaturedRewards = async (params = {}) => {
  const res = await api.get('/rewards/marketplace/featured', { params });
  return res?.data || [];
};

export const getRewardDetail = async (id) => {
  const res = await api.get(`/rewards/marketplace/${id}`);
  return res?.data || null;
};

export const redeemReward = async (id, quantity = 1) => {
  const res = await api.post(`/rewards/marketplace/${id}/redeem`, { quantity });
  return res?.data || null;
};

export const getRedemptionHistory = async (params = {}) => {
  const res = await api.get('/rewards/my-redemptions', { params });
  return res?.data || null;
};

export default {
  getMarketplaceCatalog,
  getFeaturedRewards,
  getRewardDetail,
  redeemReward,
  getRedemptionHistory,
};
