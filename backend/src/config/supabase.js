import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY');
}

// Create Supabase client (or a lightweight mock when env vars are missing)
let supabaseClient;
if (!supabaseUrl || !supabaseKey) {
  console.warn('Using mock Supabase client due to missing environment variables');
  const mockFrom = () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null })
  });

  supabaseClient = {
    from: () => mockFrom(),
    rpc: async () => ({ data: null, error: null })
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  });
}

export const supabase = supabaseClient;

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

export default supabase;

// Made with Bob
