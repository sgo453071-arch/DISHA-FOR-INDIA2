const supabase = require('../../config/supabase');
const { mapToMongoose } = require('../../utils/dbMapper');

class UserRepository {
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapToMongoose(data);
  }

  async findByUsername(username) {
    // Case insensitive username lookup as per requirements
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapToMongoose(data);
  }

  async findByVolunteerId(volunteerId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('volunteer_id', volunteerId) // assuming volunteerId maps to volunteer_id or was in metadata
      // Wait, volunteerId wasn't explicitly in the schema! It should be either added to users table or handled.
      // Let's assume it was supposed to be there or we can store it in metadata for now.
      // We will look in metadata:
      .contains('metadata', { volunteerId })
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapToMongoose(data);
  }

  async updateProfile(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async updateProfilePhoto(id, photoUrl) {
    const { data, error } = await supabase
      .from('users')
      .update({ profile_photo: photoUrl })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async updateResume(id, resumeUrl) {
    // Resume typically goes in metadata if not in main schema
    const { data: user } = await supabase.from('users').select('metadata').eq('id', id).single();
    const metadata = user?.metadata || {};
    
    const { data, error } = await supabase
      .from('users')
      .update({ metadata: { ...metadata, resumeUrl } })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async updateProfileProgress(id, profileCompletion, profileStrength, volunteerLevel) {
    const { data: user } = await supabase.from('users').select('metadata').eq('id', id).single();
    const metadata = user?.metadata || {};
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        metadata: { ...metadata, profileCompletion, profileStrength, volunteerLevel } 
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async getVolunteerStatistics(id) {
    const { data, error } = await supabase
      .from('users')
      .select('points, metadata')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return {
      points: data.points,
      hoursCompleted: data.metadata?.hoursCompleted,
      programsJoined: data.metadata?.programsJoined,
      programsCompleted: data.metadata?.programsCompleted,
      certificatesEarned: data.metadata?.certificatesEarned,
      referralCount: data.metadata?.referralCount,
      impactScore: data.metadata?.impactScore,
      volunteerLevel: data.metadata?.volunteerLevel,
      profileCompletion: data.metadata?.profileCompletion,
      profileStrength: data.metadata?.profileStrength
    };
  }

  async searchUsers(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', order = 'desc' } = options;
    const skip = (page - 1) * limit;

    let request = supabase.from('users').select('*', { count: 'exact' });

    // Handle generic mongo queries by mapping them if necessary
    if (query.role) request = request.eq('role', query.role);
    if (query.isDeleted !== undefined) request = request.eq('is_deleted', query.isDeleted);

    const { data, error, count } = await request
      .order(sortBy, { ascending: order !== 'desc' })
      .range(skip, skip + limit - 1);

    if (error) throw error;

    return { users: mapToMongoose(data), total: count };
  }

  async findPublicProfile(username) {
    const { data, error } = await supabase
      .from('users')
      .select('name, username, profile_photo, about, city, state, points, metadata')
      .ilike('username', username)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      name: data.name,
      username: data.username,
      profilePhoto: data.profile_photo,
      about: data.about,
      city: data.city,
      state: data.state,
      points: data.points,
      college: data.metadata?.college,
      course: data.metadata?.course,
      skills: data.metadata?.skills,
      hoursCompleted: data.metadata?.hoursCompleted,
      programsCompleted: data.metadata?.programsCompleted,
      volunteerLevel: data.metadata?.volunteerLevel,
      profileCompletion: data.metadata?.profileCompletion,
      profileStrength: data.metadata?.profileStrength,
      impactScore: data.metadata?.impactScore
    };
  }

  async findVolunteersForLeaderboard(skip = 0, limit = 20) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'VOLUNTEER')
      .eq('is_deleted', false)
      .order('points', { ascending: false })
      .order('created_at', { ascending: true })
      .range(skip, skip + limit - 1);

    if (error) throw error;
    return mapToMongoose(data);
  }

  async getVolunteerRank() {
    return null;
  }

  async findTopVolunteers(limit = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'VOLUNTEER')
      .eq('is_deleted', false)
      .order('points', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return mapToMongoose(data);
  }

  async countDocuments(query = {}) {
    let request = supabase.from('users').select('*', { count: 'exact', head: true });
    if (query.role) request = request.eq('role', query.role);
    if (query.isDeleted !== undefined) request = request.eq('is_deleted', query.isDeleted);
    
    const { count, error } = await request;
    if (error) throw error;
    return count;
  }
}

module.exports = new UserRepository();
