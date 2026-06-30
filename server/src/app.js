const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const passport = require('passport');

require('./config/passport'); // Load passport configuration
const errorHandler = require('./middlewares/error.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const NotFoundError = require('./utils/errors/NotFoundError');
const { successResponse } = require('./utils/response');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Gzip compression
app.use(compression());

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: '10kb' }));

// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Rate Limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', apiLimiter);
}

// Health Check Route
app.get('/health', (req, res) => {
  return successResponse(res, 200, 'Server is healthy', {
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);

// Handle 404 Not Found
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
