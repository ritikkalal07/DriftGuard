/**
 * Database Seed Script
 * Seeds the Supabase database with a demo user for testing.
 * Run: npm run seed
 *
 * Prerequisites:
 *   - Supabase table schema must already exist (apply via Supabase Studio SQL editor).
 *   - SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in backend/.env
 */
import supabase from '../src/config/supabase.js';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'demo@driftguard.dev';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Demo User';
const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // Verify Supabase connection
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
  } catch (err) {
    console.error('❌ Cannot connect to Supabase.');
    console.error('   Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in backend/.env');
    console.error('   Details:', err.message);
    process.exit(1);
  }

  // Check if demo user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', DEMO_EMAIL);

  if (existingUser && existingUser.length > 0) {
    console.log(`ℹ️  Demo user already exists: ${DEMO_EMAIL}`);
  } else {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        id: DEMO_USER_ID,
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: hashedPassword,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create demo user:', error.message);
      process.exit(1);
    }

    // Create default settings for the demo user
    await supabase.from('settings').insert([{
      user_id: user.id,
      ai_provider: 'mock',
      drift_sensitivity: 'medium',
      auto_scan_enabled: false,
      notification_enabled: true,
    }]);

    console.log(`✅ Demo user created successfully: ${DEMO_EMAIL}`);
  }

  console.log('\n🌱 Seed complete!');
  console.log(`   Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

seed().catch(err => {
  console.error('❌ Seed script failed:', err);
  process.exit(1);
});
