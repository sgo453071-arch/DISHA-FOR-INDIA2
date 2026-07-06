const fs = require('fs');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

require('./config/passport'); // Load Passport Google OAuth strategy
const getCorsConfig = require('./config/cors.config');
const helmetConfig = require('./config/helmet.config');
const getMorganMiddleware = require('./config/morgan.config');
const { globalLimiter } = require('./config/rateLimiter.config');
const swaggerSpec = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notFound.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const programRoutes = require('./modules/program/program.routes');
const applicationRoutes = require('./modules/application/application.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const certificateRoutes = require('./modules/certificate/certificate.routes');
const rewardRoutes = require('./modules/reward/reward.routes');
const leaderboardRoutes = require('./modules/leaderboard/leaderboard.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const organizationRoutes = require('./modules/organization/organization.routes');
const permissionRoutes = require('./modules/permission/permission.routes');
const roleRoutes = require('./modules/role/role.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const reportsRoutes = require('./modules/reports/report.routes');
const conversationRoutes = require('./modules/conversation/conversation.routes');
const messageRoutes = require('./modules/message/message.routes');
const supportTicketRoutes = require('./modules/support-ticket/support-ticket.routes');
const announcementRoutes = require('./modules/announcement/announcement.routes');
require('./modules/announcement/announcement.model');
const collaborationRoutes = require('./modules/collaboration/collaboration.routes');
require('./modules/collaboration/collaboration.model');
const matchingRoutes = require('./modules/matching/matching.routes');
require('./modules/matching/recommendation.model');
const { successResponse } = require('./utils/response');

const app = express();

// ─────────────────────────────────────────────
// Trust proxy for proper IP detection behind reverse proxy (Render)
// ─────────────────────────────────────────────
app.set('trust proxy', 1);

// ─────────────────────────────────────────────
// 1. Security Headers (Helmet)
// ─────────────────────────────────────────────
app.use(helmet(helmetConfig));

// ─────────────────────────────────────────────
// 2. CORS
// ─────────────────────────────────────────────
app.use(cors(getCorsConfig()));

// ─────────────────────────────────────────────
// 3. HTTP Request Logging (Morgan)
// ─────────────────────────────────────────────
app.use(getMorganMiddleware());

// ─────────────────────────────────────────────
// 4. Body Parsing (with request size limits)
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─────────────────────────────────────────────
// 5. Cookie Parsing
// ─────────────────────────────────────────────
app.use(cookieParser());

// ─────────────────────────────────────────────
// 6. Gzip Compression
// ─────────────────────────────────────────────
app.use(compression());

// ─────────────────────────────────────────────
// 7. Passport Initialization
// ─────────────────────────────────────────────
app.use(passport.initialize());

// ─────────────────────────────────────────────
// 8. Global Rate Limiter (Production only)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use('/api', globalLimiter);
}

// ─────────────────────────────────────────────
// 9. Health Check
// ─────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  return successResponse(res, 200, 'Server is healthy', {
    status: 'UP',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
// 9.5. Root endpoint for Render health checks
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  return successResponse(res, 200, 'API Running', {
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      programs: '/api/v1/programs',
      applications: '/api/v1/applications',
      attendance: '/api/v1/attendance',
      certificates: '/api/v1/certificates',
      rewards: '/api/v1/rewards',
      leaderboard: '/api/v1/leaderboard',
      notifications: '/api/v1/notifications',
      analytics: '/api/v1/analytics',
      reports: '/api/v1/reports',
      announcements: '/api/v1/announcements',
      collaboration: '/api/v1/collaboration',
      matching: '/api/v1/matching',
    },
  });
});

// ─────────────────────────────────────────────
// 10. API Routes
// ─────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/conversations', messageRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/support-tickets', supportTicketRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/collaboration', collaborationRoutes);
app.use('/api/v1/matching', matchingRoutes);

// ─────────────────────────────────────────────
// 11. Swagger API Documentation
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─────────────────────────────────────────────
// 12. Serve React static build + SPA fallback
// ─────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();
  if (req.path.includes('.')) return next();

  const indexPath = path.join(clientBuildPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return next();
  }

  return res.sendFile(indexPath);
});

// ─────────────────────────────────────────────
// 13. 404 Handler (must be after all routes and docs)
// ─────────────────────────────────────────────
app.use(notFoundHandler);

// ─────────────────────────────────────────────
// 13. Global Error Handler (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;