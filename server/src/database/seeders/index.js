const { seedPermissions } = require('./permission.seeder');
const { seedRoles } = require('./role.seeder');
const { seedOrganization } = require('./organization.seeder');

const runSeeders = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('Starting database seeding...');

    await seedPermissions();
    await seedRoles();
    await seedOrganization();

    // eslint-disable-next-line no-console
    console.log('Database seeding completed');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seeding failed:', error.message);
    return false;
  }
};

module.exports = { runSeeders };