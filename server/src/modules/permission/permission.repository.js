const supabase = require('../../config/supabase');
const { mapToMongoose } = require('../../utils/dbMapper');

class PermissionRepository {
  async create(permissionData) {
    const { data, error } = await supabase
      .from('permissions')
      .insert([permissionData])
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async findByCode(code) {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('slug', code)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
    return mapToMongoose(data);
  }

  async findAll(query = {}) {
    const { page = 1, limit = 50, module, category } = query;
    const skip = (page - 1) * limit;

    let request = supabase.from('permissions').select('*', { count: 'exact' });

    if (module) {
      request = request.eq('module', module);
    }
    if (category) {
      request = request.eq('category', category);
    }

    const { data, error, count } = await request
      .range(skip, skip + limit - 1);

    if (error) throw error;

    return { permissions: mapToMongoose(data), total: count, page, limit };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapToMongoose(data);
  }

  async existsByCode(code) {
    const { data, error } = await supabase
      .from('permissions')
      .select('id')
      .eq('slug', code)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return mapToMongoose(data);
  }
}

module.exports = new PermissionRepository();