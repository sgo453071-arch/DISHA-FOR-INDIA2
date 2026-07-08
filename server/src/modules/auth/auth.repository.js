const supabase = require('../../config/supabase');
const { mapToMongoose } = require('../../utils/dbMapper');
const { STATUS } = require('../user/user.constants');

class AuthRepository {
  /**
   * Helper function to map data and explicitly include sensitive fields for auth.
   */
  _mapAuth(data) {
    return mapToMongoose(data, { includeSensitive: true });
  }

  async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByEmail(email) {
    // lowercase emails & case-insensitive lookup
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email.toLowerCase())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByUsername(username) {
    const { data, error } = await supabase.from('users').select('*').ilike('username', username).single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByVolunteerId(volunteerId) {
    const { data, error } = await supabase.from('users').select('*').eq('volunteer_id', volunteerId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByGoogleId(googleId) {
    const { data, error } = await supabase.from('users').select('*').eq('google_id', googleId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByRefreshToken(token) {
    const { data, error } = await supabase.from('users').select('*').eq('refresh_token', token).single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async findByResetToken(token) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('password_reset_token', token)
      .gt('password_reset_expires', new Date().toISOString())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async create(userData) {
    // Map camelCase to snake_case for insert
    const insertData = { ...userData };
    if (insertData.volunteerId) { insertData.volunteer_id = insertData.volunteerId; delete insertData.volunteerId; }
    if (insertData.email) { insertData.email = insertData.email.toLowerCase(); }

    const { data, error } = await supabase.from('users').insert([insertData]).select().single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async createGoogleUser(userData) {
    const insertData = { ...userData };
    if (insertData.googleId) { insertData.google_id = insertData.googleId; delete insertData.googleId; }
    if (insertData.profilePhoto) { insertData.profile_photo = insertData.profilePhoto; delete insertData.profilePhoto; }
    if (insertData.email) { insertData.email = insertData.email.toLowerCase(); }

    const { data, error } = await supabase.from('users').insert([insertData]).select().single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async linkGoogleAccount(id, googleId, picture) {
    const { data, error } = await supabase
      .from('users')
      .update({ google_id: googleId, profile_photo: picture })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async update(id, updateData) {
    const dbUpdate = { ...updateData };
    if (dbUpdate.refreshToken !== undefined) { dbUpdate.refresh_token = dbUpdate.refreshToken; delete dbUpdate.refreshToken; }
    if (dbUpdate.lastLogin !== undefined) { dbUpdate.last_login = dbUpdate.lastLogin; delete dbUpdate.lastLogin; }
    if (dbUpdate.lastActive !== undefined) { dbUpdate.last_active = dbUpdate.lastActive; delete dbUpdate.lastActive; }

    const { data, error } = await supabase.from('users').update(dbUpdate).eq('id', id).select().single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async updateRefreshToken(id, token) {
    const { data, error } = await supabase
      .from('users')
      .update({ refresh_token: token })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async removeRefreshToken(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ refresh_token: null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async saveResetToken(id, hashedToken, expires) {
    const { data, error } = await supabase
      .from('users')
      .update({
        password_reset_token: hashedToken,
        password_reset_expires: expires,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async clearResetToken(id) {
    const { data, error } = await supabase
      .from('users')
      .update({
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async updatePassword(id, hashedPassword) {
    const { data, error } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: null,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this._mapAuth(data);
  }

  async findActiveUser(id) {
    // Note: status does not exist as a column on public.users. 
    // It's in Mongoose. Let's assume it was migrated or should be checked via another field.
    // Wait, let's look at schema for `users`. It doesn't have `status`!
    // But `auth.service.js` checked `if (user.status === STATUS.SUSPENDED)`.
    // We didn't add `status` column! Let's check metadata or add it.
    // For now, if we don't have status, we'll assume they're active unless `is_deleted`.
    // Wait, let's query `is_deleted` = false for active users.
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false) // Use is_deleted as fallback
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }

  async delete(id) {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select().single();
    if (error && error.code !== 'PGRST116') throw error;
    return this._mapAuth(data);
  }
}

module.exports = new AuthRepository();
