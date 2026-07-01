const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS } = require('./notification.constants');

const buildApplicationSubmitted = ({ recipientId, programName, programId, applicationId }) => ({
  recipient: recipientId,
  title: 'Application Submitted',
  message: `Your application for "${programName}" has been submitted successfully. We will review it shortly.`,
  type: NOTIFICATION_TYPES.APPLICATION,
  category: 'application',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'application',
  relatedEntityId: applicationId,
  metadata: { programId, applicationId },
});

const buildApplicationWithdrawn = ({ recipientId, programName, applicationId }) => ({
  recipient: recipientId,
  title: 'Application Withdrawn',
  message: `Your application for "${programName}" has been withdrawn successfully.`,
  type: NOTIFICATION_TYPES.APPLICATION,
  category: 'application',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'application',
  relatedEntityId: applicationId,
  metadata: { programName, applicationId },
});

const buildProgramPublished = ({ recipientId, programName, programId }) => ({
  recipient: recipientId,
  title: 'New Program Published',
  message: `A new program "${programName}" is now open for applications. Check it out and apply now!`,
  type: NOTIFICATION_TYPES.PROGRAM,
  category: 'program',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId },
});

const buildProgramCancelled = ({ recipientId, programName, programId }) => ({
  recipient: recipientId,
  title: 'Program Cancelled',
  message: `The program "${programName}" has been cancelled. We apologize for any inconvenience.`,
  type: NOTIFICATION_TYPES.PROGRAM,
  category: 'program',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId },
});

const buildProgramUpdated = ({ recipientId, programName, programId }) => ({
  recipient: recipientId,
  title: 'Program Updated',
  message: `The program "${programName}" has been updated. Please review the latest details.`,
  type: NOTIFICATION_TYPES.PROGRAM,
  category: 'program',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId },
});

const buildCheckInSuccessful = ({ recipientId, programName, attendanceId, checkInTime }) => ({
  recipient: recipientId,
  title: 'Check-In Successful',
  message: `You have successfully checked in for "${programName}" at ${new Date(checkInTime).toLocaleTimeString()}.`,
  type: NOTIFICATION_TYPES.ATTENDANCE,
  category: 'attendance',
  priority: PRIORITY.LOW,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'attendance',
  relatedEntityId: attendanceId,
  metadata: { programName, attendanceId, checkInTime },
});

const buildCheckOutSuccessful = ({ recipientId, programName, attendanceId, totalHours }) => ({
  recipient: recipientId,
  title: 'Check-Out Successful',
  message: `You have checked out from "${programName}". Total hours: ${totalHours}. Great work!`,
  type: NOTIFICATION_TYPES.ATTENDANCE,
  category: 'attendance',
  priority: PRIORITY.LOW,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'attendance',
  relatedEntityId: attendanceId,
  metadata: { programName, attendanceId, totalHours },
});

const buildAttendanceEdited = ({ recipientId, programName, attendanceId, updatedBy }) => ({
  recipient: recipientId,
  title: 'Attendance Record Updated',
  message: `Your attendance for "${programName}" has been updated by ${updatedBy || 'an administrator'}.`,
  type: NOTIFICATION_TYPES.ATTENDANCE,
  category: 'attendance',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'attendance',
  relatedEntityId: attendanceId,
  metadata: { programName, attendanceId, updatedBy },
});

const buildCertificateGenerated = ({ recipientId, programName, certificateId, certificateNumber }) => ({
  recipient: recipientId,
  title: 'Certificate Generated',
  message: `Congratulations! Your certificate for "${programName}" has been generated. Certificate Number: ${certificateNumber}.`,
  type: NOTIFICATION_TYPES.CERTIFICATE,
  category: 'certificate',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'certificate',
  relatedEntityId: certificateId,
  metadata: { programName, certificateId, certificateNumber },
});

const buildCertificateRevoked = ({ recipientId, programName, certificateId }) => ({
  recipient: recipientId,
  title: 'Certificate Revoked',
  message: `Your certificate for "${programName}" has been revoked. Please contact support for more information.`,
  type: NOTIFICATION_TYPES.CERTIFICATE,
  category: 'certificate',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'certificate',
  relatedEntityId: certificateId,
  metadata: { programName, certificateId },
});

const buildCoinsAwarded = ({ recipientId, coins, reason }) => ({
  recipient: recipientId,
  title: 'Coins Awarded',
  message: `You have been awarded ${coins} coins. ${reason || 'Keep up the great work!'}`,
  type: NOTIFICATION_TYPES.REWARD,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { coins, reason },
});

const buildPointsAwarded = ({ recipientId, points, reason }) => ({
  recipient: recipientId,
  title: 'Reward Points Awarded',
  message: `You have earned ${points} reward points. ${reason || 'Keep up the great work!'}`,
  type: NOTIFICATION_TYPES.REWARD,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { points, reason },
});

const buildImpactScoreUpdated = ({ recipientId, impactScore, totalImpact }) => ({
  recipient: recipientId,
  title: 'Impact Score Updated',
  message: `Your impact score has been updated. Current impact score: ${totalImpact || impactScore}.`,
  type: NOTIFICATION_TYPES.REWARD,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { impactScore, totalImpact },
});

const buildRankIncreased = ({ recipientId, newRank, leaderboardType }) => ({
  recipient: recipientId,
  title: 'Rank Increased',
  message: `Congratulations! You have moved up to rank #${newRank} on the ${leaderboardType || 'national'} leaderboard.`,
  type: NOTIFICATION_TYPES.LEADERBOARD,
  category: 'leaderboard',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { newRank, leaderboardType },
});

const buildBadgeEarned = ({ recipientId, badgeName, badgeDescription }) => ({
  recipient: recipientId,
  title: 'New Badge Earned',
  message: `You have earned the "${badgeName}" badge. ${badgeDescription || 'Congratulations!'}`,
  type: NOTIFICATION_TYPES.LEADERBOARD,
  category: 'gamification',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { badgeName, badgeDescription },
});

const buildAchievementUnlocked = ({ recipientId, achievementTitle, achievementDescription }) => ({
  recipient: recipientId,
  title: 'Achievement Unlocked',
  message: `You have unlocked the "${achievementTitle}" achievement. ${achievementDescription || 'Amazing work!'}`,
  type: NOTIFICATION_TYPES.LEADERBOARD,
  category: 'gamification',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { achievementTitle, achievementDescription },
});

const buildVolunteerLevelUp = ({ recipientId, newLevel, previousLevel }) => ({
  recipient: recipientId,
  title: 'Volunteer Level Up',
  message: `You have leveled up from ${previousLevel || 'Beginner'} to ${newLevel}! Keep contributing to reach even higher.`,
  type: NOTIFICATION_TYPES.LEADERBOARD,
  category: 'gamification',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { newLevel, previousLevel },
});

const buildWelcome = ({ recipientId, name }) => ({
  recipient: recipientId,
  title: 'Welcome to Disha for India',
  message: `Hello ${name || 'Volunteer'}! Welcome to Disha for India. We are excited to have you on board. Start exploring programs and make an impact today!`,
  type: NOTIFICATION_TYPES.SYSTEM,
  category: 'system',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { userName: name },
});

const buildPasswordChanged = ({ recipientId }) => ({
  recipient: recipientId,
  title: 'Password Changed',
  message: 'Your password has been changed successfully. If you did not make this change, please contact support immediately.',
  type: NOTIFICATION_TYPES.SYSTEM,
  category: 'system',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: {},
});

const buildProfileCompleted = ({ recipientId, completionPercentage }) => ({
  recipient: recipientId,
  title: 'Profile Completed',
  message: `Congratulations! Your profile is now ${completionPercentage}% complete. You are ready to start applying for programs.`,
  type: NOTIFICATION_TYPES.SYSTEM,
  category: 'system',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { completionPercentage },
});

module.exports = {
  buildApplicationSubmitted,
  buildApplicationWithdrawn,
  buildProgramPublished,
  buildProgramCancelled,
  buildProgramUpdated,
  buildCheckInSuccessful,
  buildCheckOutSuccessful,
  buildAttendanceEdited,
  buildCertificateGenerated,
  buildCertificateRevoked,
  buildCoinsAwarded,
  buildPointsAwarded,
  buildImpactScoreUpdated,
  buildRankIncreased,
  buildBadgeEarned,
  buildAchievementUnlocked,
  buildVolunteerLevelUp,
  buildWelcome,
  buildPasswordChanged,
  buildProfileCompleted,
};
