const rewardRedemptionService = require('./rewardRedemption.service');
const { MESSAGES } = require('./reward.constants');
const { successResponse, errorResponse } = require('../../utils/response');

class RewardRedemptionController {
  getRedemptionHistory = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        status: req.query.status || 'all',
      };
      const result = await rewardRedemptionService.getRedemptionHistory(userId, options);
      return successResponse(res, 200, MESSAGES.TRANSACTIONS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRedemptionById = async (req, res, next) => {
    try {
      const redemption = await rewardRedemptionService.getRedemptionById(req.params.id);
      return successResponse(res, 200, 'Redemption details retrieved', redemption);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardRedemptionController();
