import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseInstance;
let configError = null;

if (!supabaseUrl || !supabaseKey) {
  configError = new Error(
    'Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) in backend/.env. ' +
    'See backend/.env.example for a template.'
  );
  console.warn('⚠️  Supabase not configured:', configError.message);
}

/**
 * Safe Supabase accessor.
 * - If the client was initialised, all Supabase calls are forwarded normally.
 * - If not, every property access throws the config error with a clear message.
 */
function createLazySupabase() {
  const handler = {
    get(_target, prop) {
      if (configError) {
        throw configError;
      }
      return supabaseInstance[prop];
    },
  };
  return new Proxy({}, handler);
}

export const supabase = configError ? createLazySupabase() : createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: { schema: 'public' },
});

// Re-export the init error so callers can react explicitly
export const supabaseConfigError = configError;

/**
 * Test connection – returns false (and logs) instead of throwing, so it is safe to call at boot.
 */
export const testConnection = async () => {
  if (configError) {
    console.error('❌ Supabase connection failed:', configError.message);
    return false;
  }
  try {
    // Use head + count to avoid pulling rows
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

export default supabase;
