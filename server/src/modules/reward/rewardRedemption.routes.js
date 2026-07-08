const express = require('express');
const rewardRedemptionController = require('./rewardRedemption.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/history', rewardRedemptionController.getRedemptionHistory);
router.get('/:id', rewardRedemptionController.getRedemptionById);

module.exports = router;
