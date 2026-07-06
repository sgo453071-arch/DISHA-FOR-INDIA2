const express = require('express');
const matchingController = require('./matching.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.get('/programs', authenticate, matchingController.getProgramRecommendations);

router.get(
  '/volunteers',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  matchingController.getVolunteerRecommendations
);

router.get('/recommendations', authenticate, matchingController.getDetailedRecommendation);

router.post('/save', authenticate, matchingController.saveRecommendation);

router.delete('/save/:id', authenticate, matchingController.unsaveRecommendation);

router.get('/saved', authenticate, matchingController.getSavedRecommendations);

router.get('/history', authenticate, matchingController.getRecommendationHistory);

router.get('/refresh', authenticate, matchingController.refreshRecommendations);

module.exports = router;
