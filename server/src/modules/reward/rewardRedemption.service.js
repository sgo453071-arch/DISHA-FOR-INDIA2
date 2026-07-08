const rewardRedemptionRepository = require('./rewardRedemption.repository');
const NotFoundError = require('../../utils/errors/NotFoundError');

class RewardRedemptionService {
  async createRedemption(redemptionData) {
    return rewardRedemptionRepository.create(redemptionData);
  }

  async getRedemptionHistory(userId, options = {}) {
    return rewardRedemptionRepository.findByUser(userId, options);
  }

  async getRedemptionById(id) {
    const redemption = await rewardRedemptionRepository.findById(id);
    if (!redemption) {
      throw new NotFoundError('Redemption not found');
    }
    return redemption;
  }

  async updateRedemptionStatus(id, status, extra = {}) {
    return rewardRedemptionRepository.updateStatus(id, status, extra);
  }

  async getRedemptionCount(userId) {
    return rewardRedemptionRepository.countByUser(userId);
  }
}

module.exports = new RewardRedemptionService();
