const supabase = require('./src/config/supabase');

async function testConnection() {
  console.log('Testing Supabase Connection...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
  }

  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('❌ Supabase Connection Failed:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Supabase Connection Successful!');
    console.log('✅ Found Users Table');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
    process.exit(1);
  }
}

testConnection();
