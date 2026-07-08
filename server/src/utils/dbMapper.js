/**
 * Utility to map Supabase PostgreSQL records to Mongoose-style documents.
 * Ensures compatibility with existing services that expect `_id`.
 */
const mapToMongoose = (record, options = { includeSensitive: false }) => {
  if (!record) return null;
  if (Array.isArray(record)) return record.map(r => mapToMongoose(r, options));
  
  // Clone to avoid mutating original if it's reused
  const mapped = { ...record, _id: record.id };
  
  // Convert snake_case to camelCase for auth fields
  if (mapped.google_id) { mapped.googleId = mapped.google_id; delete mapped.google_id; }
  if (mapped.refresh_token) { mapped.refreshToken = mapped.refresh_token; delete mapped.refresh_token; }
  if (mapped.password_reset_token) { mapped.passwordResetToken = mapped.password_reset_token; delete mapped.password_reset_token; }
  if (mapped.password_reset_expires) { mapped.passwordResetExpires = mapped.password_reset_expires; delete mapped.password_reset_expires; }
  if (mapped.last_login) { mapped.lastLogin = mapped.last_login; delete mapped.last_login; }
  if (mapped.last_active) { mapped.lastActive = mapped.last_active; delete mapped.last_active; }
  if (mapped.volunteer_id) { mapped.volunteerId = mapped.volunteer_id; delete mapped.volunteer_id; }

  // By default, Mongoose models had select: false for these.
  // We remove them to prevent accidental leakage in standard user queries.
  if (!options.includeSensitive) {
    delete mapped.password;
    delete mapped.refreshToken;
    delete mapped.passwordResetToken;
    delete mapped.passwordResetExpires;
    delete mapped.googleId;
  }

  return mapped;
};

module.exports = { mapToMongoose };
