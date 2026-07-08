const supabase = require('../../config/supabase');
const { mapToMongoose } = require('../../utils/dbMapper');

class RoleRepository {
  async create(roleData) {
    const { data, error } = await supabase
      .from('roles')
      .insert([roleData])
      .select()
      .single();
    if (error) throw error;
    return mapToMongoose(data);
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:role_permissions (
          permission:permissions (*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Map populated permissions
    data.permissions = data.permissions?.map(rp => rp.permission) || [];
    return mapToMongoose(data);
  }

  async findBySlug(slug) {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:role_permissions (
          permission:permissions (*)
        )
      `)
      .eq('slug', slug)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    data.permissions = data.permissions?.map(rp => rp.permission) || [];
    return mapToMongoose(data);
  }

  async findAll(query = {}) {
    const { page = 1, limit = 10, isSystemRole } = query;
    const skip = (page - 1) * limit;

    let request = supabase
      .from('roles')
      .select(`
        *,
        permissions:role_permissions (
          permission:permissions (*)
        )
      `, { count: 'exact' });

    if (isSystemRole !== undefined) {
      request = request.eq('is_system_role', isSystemRole);
    }

    const { data, error, count } = await request
      .range(skip, skip + limit - 1);

    if (error) throw error;

    const mappedData = data.map(role => {
      role.permissions = role.permissions?.map(rp => rp.permission) || [];
      return mapToMongoose(role);
    });

    return { roles: mappedData, total: count, page, limit };
  }

  async update(id, updateData) {
    const { data, error } = await supabase
      .from('roles')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        permissions:role_permissions (
          permission:permissions (*)
        )
      `)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    data.permissions = data.permissions?.map(rp => rp.permission) || [];
    return mapToMongoose(data);
  }

  async softDelete(id, deletedById) {
    // Roles do not have is_deleted in the new schema, so we physically delete
    // or just leave as is. For strict migration, we delete it.
    const { data, error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)
      .select()
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return mapToMongoose(data);
  }

  async existsBySlug(slug, excludeId = null) {
    let request = supabase.from('roles').select('id').eq('slug', slug);
    if (excludeId) {
      request = request.neq('id', excludeId);
    }
    const { data, error } = await request.limit(1).maybeSingle();
    if (error) throw error;
    return mapToMongoose(data);
  }
}

module.exports = new RoleRepository();