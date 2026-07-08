const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

// We use the service_role key in the backend to bypass RLS initially.
// Later in Phase 5, we can integrate user JWTs to apply RLS policies.
const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseServiceKey || 'mock-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;
