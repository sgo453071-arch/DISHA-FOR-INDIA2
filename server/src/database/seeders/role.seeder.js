const Role = require('../../modules/role/role.model');
const Permission = require('../../modules/permission/permission.model');

const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PROGRAM_MANAGER: 'program_manager',
  VOLUNTEER_COORDINATOR: 'volunteer_coordinator',
  ATTENDANCE_MANAGER: 'attendance_manager',
  REVIEWER: 'reviewer',
  VOLUNTEER: 'volunteer',
  GUEST: 'guest',
};

const ROLE_PERMISSIONS = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [],
  [SYSTEM_ROLES.ADMIN]: [
    'users:read', 'users:update',
    'programs:create', 'programs:read', 'programs:update', 'programs:delete', 'programs:publish',
    'applications:read', 'applications:approve',
    'attendance:read', 'attendance:mark',
    'certificates:read', 'certificates:generate',
    'rewards:read',
    'leaderboard:read',
    'notifications:read',
    'organizations:read',
  ],
  [SYSTEM_ROLES.PROGRAM_MANAGER]: [
    'programs:create', 'programs:read', 'programs:update', 'programs:publish',
    'applications:read', 'applications:approve',
  ],
  [SYSTEM_ROLES.VOLUNTEER_COORDINATOR]: [
    'programs:read', 'applications:read', 'attendance:mark', 'attendance:read', 'leaderboard:read',
  ],
  [SYSTEM_ROLES.ATTENDANCE_MANAGER]: ['attendance:mark', 'attendance:read', 'users:read'],
  [SYSTEM_ROLES.REVIEWER]: ['applications:read', 'users:read'],
  [SYSTEM_ROLES.VOLUNTEER]: ['applications:create', 'attendance:read', 'certificates:read', 'programs:read'],
  [SYSTEM_ROLES.GUEST]: ['programs:read'],
};

const seedRoles = async () => {
  try {
    const existingCount = await Role.countDocuments({ isSystemRole: true });
    if (existingCount > 0) {
      // eslint-disable-next-line no-console
      console.log('Roles already exist');
      return { inserted: 0, updated: 0 };
    }

    const permissions = await Permission.find({ isSystemPermission: true });
    const permissionMap = {};
    permissions.forEach((p) => (permissionMap[p.code] = p._id));

    let inserted = 0;
    let updated = 0;

    for (const [idx, [slug, codes]] of Object.entries(Object.entries(ROLE_PERMISSIONS)).entries()) {
      try {
        await Role.create({
          roleId: `ROLE${String(idx + 1).padStart(4, '0')}`,
          name: slug.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          slug,
          description: `System role: ${slug}`,
          organization: null,
          permissions: codes.map((code) => permissionMap[code]).filter(Boolean),
          isSystemRole: true,
          createdBy: null,
          updatedBy: null,
        });
        inserted++;
      } catch (err) {
        if (err.code === 11000) {
          const existingRole = await Role.findOne({ slug });
          if (existingRole) {
            const newPermissions = codes.map((code) => permissionMap[code]).filter(Boolean);
            const currentPermissionIds = existingRole.permissions.map((p) => p.toString());
            const toAdd = newPermissions.filter((p) => !currentPermissionIds.includes(p.toString()));
            if (toAdd.length > 0) {
              existingRole.permissions.push(...toAdd);
              await existingRole.save();
              updated++;
            }
          }
        } else {
          throw err;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Roles Seeded: ${inserted} inserted, ${updated} updated`);
    return { inserted, updated };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Role seeding failed:', error.message);
    return { inserted: 0, updated: 0, error: error.message };
  }
};

module.exports = { seedRoles, SYSTEM_ROLES, ROLE_PERMISSIONS };