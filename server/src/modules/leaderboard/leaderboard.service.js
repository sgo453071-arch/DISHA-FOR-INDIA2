const Leaderboard = require('./leaderboard.model');
const leaderboardRepository = require('./leaderboard.repository');
const userRepository = require('../user/user.repository');
const rewardRepository = require('../reward/reward.repository');
const { generateLeaderboardId, calculateLeaderboardScore } = require('./leaderboard.utils');
const { LEADERBOARD_TYPE, MESSAGES, VALIDATION } = require('./leaderboard.constants');
const {
  NotFoundError,
} = require('../../utils/errors');

const Reward = require('../reward/reward.model');

class LeaderboardService {
  async _getUserStats(userId) {
    const [user, reward] = await Promise.all([
      userRepository.findById(userId),
      rewardRepository.findByUser(userId),
    ]);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const totalVolunteerHours = reward?.currentVolunteerHours || user.hoursCompleted || 0;
    const totalProgramsCompleted = reward?.totalProgramsCompleted || user.programsCompleted || 0;
    const totalImpact = reward?.currentImpactScore || 0;
    const totalPoints = reward?.currentPoints || 0;
    const totalCoins = reward?.currentCoins || 0;

    return {
      userId,
      name: user.name,
      email: user.email,
      volunteerId: user.volunteerId,
      city: user.city || 'Unknown',
      state: user.state || 'Unknown',
      country: user.country || 'India',
      totalVolunteerHours,
      totalProgramsCompleted,
      totalImpact,
      totalPoints,
      totalCoins,
      createdAt: user.createdAt,
    };
  }

  async calculateRank(userId) {
    const stats = await this._getUserStats(userId);
    const score = calculateLeaderboardScore(
      stats.totalImpact,
      stats.totalPoints,
      stats.totalVolunteerHours,
      stats.totalProgramsCompleted,
      stats.totalCoins
    );

    let entry = await leaderboardRepository.findByUser(userId);
    if (!entry) {
      entry = await leaderboardRepository.create({
        leaderboardId: generateLeaderboardId(),
        user: userId,
        totalPoints: stats.totalPoints,
        totalCoins: stats.totalCoins,
        totalImpact: stats.totalImpact,
        totalVolunteerHours: stats.totalVolunteerHours,
        totalProgramsCompleted: stats.totalProgramsCompleted,
        city: stats.city,
        state: stats.state,
        country: stats.country,
        lastCalculatedAt: new Date(),
      });
    } else {
      await leaderboardRepository.update(userId, {
        totalPoints: stats.totalPoints,
        totalCoins: stats.totalCoins,
        totalImpact: stats.totalImpact,
        totalVolunteerHours: stats.totalVolunteerHours,
        totalProgramsCompleted: stats.totalProgramsCompleted,
        city: stats.city,
        state: stats.state,
        country: stats.country,
        lastCalculatedAt: new Date(),
      });
    }

    return {
      userId,
      score,
      city: stats.city,
      state: stats.state,
      totalImpact: stats.totalImpact,
      totalPoints: stats.totalPoints,
      totalVolunteerHours: stats.totalVolunteerHours,
      totalProgramsCompleted: stats.totalProgramsCompleted,
      totalCoins: stats.totalCoins,
    };
  }

  async _performRefresh() {
    const users = await userRepository.searchUsers(
      { isDeleted: false, role: 'volunteer' },
      { page: 1, limit: 10000 }
    );
    if (!users || users.users.length === 0) {
      return { refreshed: 0, message: 'No volunteers found to refresh' };
    }

    const rewardDocs = await Reward.find({}).lean();
    const rewardMap = new Map(rewardDocs.map((r) => [r.user.toString(), r]));

    const entries = [];
    for (const user of users.users) {
      const reward = rewardMap.get(user._id.toString());
      entries.push({
        user: user._id,
        createdAt: user.createdAt,
        totalPoints: reward?.currentPoints || 0,
        totalCoins: reward?.currentCoins || 0,
        totalImpact: reward?.currentImpactScore || 0,
        totalVolunteerHours: reward?.currentVolunteerHours || user.hoursCompleted || 0,
        totalProgramsCompleted: reward?.totalProgramsCompleted || user.programsCompleted || 0,
        city: user.city || 'Unknown',
        state: user.state || 'Unknown',
        country: user.country || 'India',
      });
    }

    for (const entry of entries) {
      entry.score = calculateLeaderboardScore(
        entry.totalImpact,
        entry.totalPoints,
        entry.totalVolunteerHours,
        entry.totalProgramsCompleted,
        entry.totalCoins
      );
    }

    const sorted = [...entries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateA - dateB;
    });

    for (let i = 0; i < sorted.length; i++) {
      sorted[i].currentRank = i + 1;
      sorted[i].nationalRank = i + 1;
    }

    const stateGroups = {};
    for (const entry of sorted) {
      const key = entry.state || 'Unknown';
      if (!stateGroups[key]) stateGroups[key] = [];
      stateGroups[key].push(entry);
    }

    for (const state of Object.keys(stateGroups)) {
      for (let i = 0; i < stateGroups[state].length; i++) {
        stateGroups[state][i].stateRank = i + 1;
      }
    }

    const cityGroups = {};
    for (const entry of sorted) {
      const key = `${entry.state || 'Unknown'}|${entry.city || 'Unknown'}`;
      if (!cityGroups[key]) cityGroups[key] = [];
      cityGroups[key].push(entry);
    }

    for (const key of Object.keys(cityGroups)) {
      for (let i = 0; i < cityGroups[key].length; i++) {
        cityGroups[key][i].cityRank = i + 1;
      }
    }

    const now = new Date();
    const bulkEntries = sorted.map((s) => ({
      updateOne: {
        filter: { user: s.user, isDeleted: false },
        update: {
          $set: {
            currentRank: s.currentRank,
            nationalRank: s.nationalRank,
            stateRank: s.stateRank,
            cityRank: s.cityRank,
            totalPoints: s.totalPoints,
            totalCoins: s.totalCoins,
            totalImpact: s.totalImpact,
            totalVolunteerHours: s.totalVolunteerHours,
            totalProgramsCompleted: s.totalProgramsCompleted,
            city: s.city,
            state: s.state,
            country: s.country,
            leaderboardId: `LB-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            lastCalculatedAt: now,
            updatedAt: now,
          },
        },
        upsert: true,
      },
    }));

    if (bulkEntries.length > 0) {
      await Leaderboard.bulkWrite(bulkEntries, { ordered: false });
    }

    return {
      refreshed: sorted.length,
      timestamp: now.toISOString(),
    };
  }

  async refreshLeaderboard(_adminId) {
    return this._performRefresh();
  }

  async getLeaderboard(queryParams) {
    const { page, limit, type, city, state, sortBy, sortOrder } = queryParams;

    const validPage = Math.max(1, parseInt(page, 10) || VALIDATION.DEFAULT_PAGE);
    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || VALIDATION.MAX_LIMIT),
      VALIDATION.MAX_LIMIT
    );

    const filters = { isDeleted: false };

    if (type === LEADERBOARD_TYPE.CITY) {
      if (city) {
        filters.city = { $regex: new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
      }
      if (state) {
        filters.state = { $regex: new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
      }
    } else if (type === LEADERBOARD_TYPE.STATE) {
      if (state) {
        filters.state = { $regex: new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
      }
    } else if (type === LEADERBOARD_TYPE.NATIONAL) {
      // No additional filters for national leaderboard
    }

    let sortField = 'currentRank';
    if (sortBy && ['currentRank', 'nationalRank', 'stateRank', 'cityRank', 'totalImpact', 'totalPoints', 'totalVolunteerHours', 'totalProgramsCompleted', 'totalCoins'].includes(sortBy)) {
      sortField = sortBy;
    }
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    return leaderboardRepository.findLeaderboard(filters, {
      page: validPage,
      limit: validLimit,
      sortBy: sortField,
      sortOrder: sortDirection === 1 ? 'asc' : 'desc',
    });
  }

  async getMyRank(userId) {
    const leaderboard = await leaderboardRepository.findByUser(userId);
    if (!leaderboard) {
      throw new NotFoundError(MESSAGES.LEADERBOARD_NOT_FOUND);
    }
    return leaderboard;
  }

  async getTopVolunteers(queryParams) {
    const { type, limit, city, state } = queryParams;

    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || VALIDATION.DEFAULT_TOP_LIMIT),
      VALIDATION.MAX_LIMIT
    );

    let rankField = 'currentRank';
    let filters = { isDeleted: false };

    if (type === LEADERBOARD_TYPE.CITY) {
      rankField = 'cityRank';
      if (city) filters.city = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      if (state) filters.state = new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    } else if (type === LEADERBOARD_TYPE.STATE) {
      rankField = 'stateRank';
      if (state) filters.state = new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    } else if (type === LEADERBOARD_TYPE.NATIONAL) {
      rankField = 'currentRank';
    }

    return leaderboardRepository.findTopUsers(rankField, validLimit, filters);
  }
}

module.exports = new LeaderboardService();
