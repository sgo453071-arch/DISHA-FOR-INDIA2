/**
 * Validates required environment variables at server startup.
 * Fails fast if any required variable is missing.
 */
const REQUIRED_ENV_VARS = [
  'PORT',
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRE',
  'CORS_ORIGIN',
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  // Validate that at least one DB connection is available: DATABASE_URL, MONGODB_URI, or both SUPABASE keys
  const hasPostgres = !!process.env.DATABASE_URL;
  const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
  const hasMongo = !!process.env.MONGODB_URI;

  if (!hasPostgres && !hasSupabase && !hasMongo) {
    missing.push('DATABASE_URL (or SUPABASE_URL & SUPABASE_KEY, or MONGODB_URI)');
  }

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[ENV ERROR] ❌ Missing required environment variables:\n  ${missing.join('\n  ')}\n\nPlease set them in your .env file and restart the server.`
    );
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('[ENV] ✅ All required environment variables are present.');
};

module.exports = validateEnv;
