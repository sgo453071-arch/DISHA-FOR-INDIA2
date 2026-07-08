const mongoose = require('mongoose');
const authService = require('./src/modules/auth/auth.service');
const authRepository = require('./src/modules/auth/auth.repository');
const roleRepository = require('./src/modules/role/role.repository');
const permissionRepository = require('./src/modules/permission/permission.repository');
const jwtUtils = require('./src/utils/jwt');

async function runTests() {
  console.log('--- STARTING BATCH 2 AUTH MIGRATION TESTS ---');

  try {
    // 1. Create a Role & Permission (Testing RBAC repos)
    console.log('Testing permission repository...');
    const testPermission = await permissionRepository.create({
      name: 'Test Permission',
      slug: 'test_permission_' + Date.now(),
      description: 'Used for automated testing'
    });
    console.log('✅ Permission created:', testPermission.slug, testPermission._id);

    console.log('Testing role repository...');
    const testRole = await roleRepository.create({
      name: 'Test Role',
      slug: 'test_role_' + Date.now(),
      description: 'Used for automated testing'
    });
    console.log('✅ Role created:', testRole.slug, testRole._id);

    // 2. Registration Flow
    console.log('Testing registration...');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testUsername = `testuser_${Date.now()}`;
    const password = 'TestPassword123!';
    
    const user = await authService.register({
      name: 'Test User',
      username: testUsername,
      email: testEmail,
      password: password,
      phone: '1234567890'
    });
    console.log('✅ Registration successful! User ID:', user._id);
    
    // We expect user to have _id, but NO password/refreshToken returned by default!
    if (user.password || user.refreshToken) {
      throw new Error('Security Error: Password or refresh token leaked in registration response!');
    }
    
    // 3. User Lookup by Email/ID
    console.log('Testing user lookup (auth context)...');
    const lookupUser = await authRepository.findByEmail(testEmail);
    if (!lookupUser || !lookupUser.password) {
      throw new Error('User lookup failed or did not return password hash for auth layer!');
    }
    console.log('✅ User lookup successful');

    // 4. Login Flow & Password Verification
    console.log('Testing login flow (includes password bcrypt verification)...');
    const loginResult = await authService.login({
      email: testEmail,
      password: password
    });
    console.log('✅ Login successful! Received access token:', !!loginResult.accessToken);
    
    // 5. JWT Generation & Verification
    console.log('Testing JWT generation & verification...');
    const decoded = jwtUtils.verifyAccessToken(loginResult.accessToken);
    if (decoded.id !== user._id) {
      throw new Error('JWT payload ID mismatch!');
    }
    console.log('✅ JWT verification successful. Payload ID matches User _id');

    // 6. Token Rotation (Refresh Token)
    console.log('Testing refresh token flow...');
    const refreshResult = await authService.refreshToken(loginResult.refreshToken);
    console.log('✅ Refresh successful. New access token:', !!refreshResult.accessToken);

    // 7. Protected Route Mapping (Mongoose Compatibility check)
    // Protected routes rely on `req.user._id` existing, meaning our dbMapper works.
    if (!loginResult.user._id) {
      throw new Error('Missing _id on returned user object! Mongoose compatibility broken.');
    }
    console.log('✅ Mongoose compatibility (_id) verified on user objects');

    // Cleanup (optional but good)
    await authRepository.delete(user._id);
    await roleRepository.softDelete(testRole._id);

    console.log('--- ALL AUTHENTICATION TESTS PASSED ---');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  }
}

// We don't connect to Mongoose, proving no MongoDB dependency is needed
runTests();
