# 🗄️ Supabase Setup Guide for DriftGuard

This guide will help you set up Supabase as the database for DriftGuard.

---

## 📋 Why Supabase?

- ✅ **Free Tier**: 500MB database, 2GB file storage, 50MB file uploads
- ✅ **PostgreSQL**: Powerful relational database with JSONB support
- ✅ **Auto APIs**: Instant REST and GraphQL APIs
- ✅ **Real-time**: Built-in real-time subscriptions
- ✅ **Auth**: Built-in authentication system
- ✅ **Easy Deployment**: Works perfectly with Vercel
- ✅ **No Connection Limits**: Unlike MongoDB Atlas free tier

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New project"**
5. Fill in:
   - **Name**: `driftguard`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

### Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire content from `backend/database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: ✅ Success message

### Step 3: Get Connection Details

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Update Environment Variables

Update your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Secret (keep your existing one or generate new)
JWT_SECRET=your-jwt-secret-here

# Node Environment
NODE_ENV=development

# AI Provider
AI_PROVIDER=mock
```

### Step 5: Install Dependencies

```bash
cd backend
npm install
```

### Step 6: Test Connection

```bash
cd backend
npm run dev
```

You should see:
```
✅ Supabase connected successfully
Server running on port 5000
```

---

## 🎯 Demo User

The schema automatically creates a demo user:

- **Email**: `demo@driftguard.dev`
- **Password**: `demo123`

You can login immediately after setup!

---

## 📊 Database Tables

The schema creates these tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts and authentication |
| `projects` | Git repositories and projects |
| `scans` | Drift detection scans |
| `drift_reports` | Individual drift reports per file |
| `suggestions` | AI-generated documentation fixes |
| `settings` | User preferences and AI config |

---

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own data
- Automatic filtering by user_id
- Secure by default

### Policies

Pre-configured policies for:
- ✅ SELECT (read)
- ✅ INSERT (create)
- ✅ UPDATE (modify)
- ✅ DELETE (remove)

---

## 🔧 Advanced Configuration

### Enable Realtime (Optional)

For live updates:

1. Go to **Database** → **Replication**
2. Enable replication for tables:
   - `scans`
   - `drift_reports`
   - `suggestions`

### Add Custom Functions

Example: Get user statistics

```sql
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_projects', (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid),
    'total_scans', (SELECT COUNT(*) FROM scans WHERE user_id = user_uuid),
    'high_drift_reports', (SELECT COUNT(*) FROM drift_reports dr
      JOIN scans s ON dr.scan_id = s.id
      WHERE s.user_id = user_uuid AND dr.drift_status = 'high_drift')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Backup Strategy

Supabase automatically backs up your database:
- **Point-in-time recovery**: Last 7 days (free tier)
- **Manual backups**: Export via SQL Editor
- **Upgrade for more**: Pro plan has 30-day recovery

---

## 🌐 Vercel Deployment

### Environment Variables for Vercel

Add these in Vercel dashboard:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
NODE_ENV=production
AI_PROVIDER=mock
```

### Connection Pooling

Supabase handles connection pooling automatically:
- No need for additional configuration
- Works perfectly with serverless functions
- Scales automatically

---

## 📈 Monitoring

### View Database Activity

1. Go to **Database** → **Logs**
2. See real-time queries
3. Monitor performance

### Check API Usage

1. Go to **Settings** → **Usage**
2. View:
   - Database size
   - API requests
   - Storage usage
   - Bandwidth

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Configure notifications for:
   - High database usage
   - API rate limits
   - Error rates

---

## 🐛 Troubleshooting

### "Connection refused"

**Solution:**
- Check SUPABASE_URL is correct
- Verify SUPABASE_ANON_KEY is set
- Ensure project is not paused (free tier pauses after 7 days inactivity)

### "Row Level Security policy violation"

**Solution:**
- Check RLS policies are created
- Verify user authentication
- Ensure user_id matches in queries

### "Too many connections"

**Solution:**
- Supabase handles this automatically
- If issue persists, check for connection leaks in code
- Consider upgrading plan for more connections

### "Schema not found"

**Solution:**
- Re-run the schema.sql file
- Check SQL Editor for errors
- Verify all tables were created

---

## 💰 Cost Estimation

### Free Tier Limits

- ✅ 500MB database storage
- ✅ 2GB file storage
- ✅ 50MB file uploads
- ✅ 50,000 monthly active users
- ✅ 500MB egress
- ✅ Unlimited API requests

### When to Upgrade

Upgrade to Pro ($25/month) when you need:
- More storage (8GB database)
- More bandwidth (50GB egress)
- Daily backups
- Point-in-time recovery (30 days)
- Email support

---

## 🔄 Migration from MongoDB

If you're migrating from MongoDB:

### 1. Export MongoDB Data

```bash
mongoexport --uri="mongodb://..." --collection=users --out=users.json
```

### 2. Transform to PostgreSQL Format

Use a script or manually transform JSON to SQL INSERT statements.

### 3. Import to Supabase

```sql
-- Example for users
INSERT INTO users (id, name, email, password, created_at)
SELECT 
  uuid_generate_v4(),
  data->>'name',
  data->>'email',
  data->>'password',
  (data->>'createdAt')::timestamp
FROM json_to_recordset('[...]') AS data(
  name text,
  email text,
  password text,
  createdAt text
);
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] All 6 tables created (users, projects, scans, drift_reports, suggestions, settings)
- [ ] Indexes created
- [ ] RLS policies enabled
- [ ] Demo user exists
- [ ] Environment variables set
- [ ] Backend connects successfully
- [ ] Can login with demo credentials
- [ ] Can create projects and scans

---

## 🎉 Success!

Your DriftGuard platform is now powered by Supabase!

**Next Steps:**
1. Start the development server: `npm run dev`
2. Login with demo credentials
3. Create your first project
4. Run a drift scan
5. Deploy to Vercel

**Total Setup Time:** ~5 minutes  
**Cost:** $0 (Free tier)  
**Scalability:** Automatic  
**Reliability:** 99.9% uptime  

🚀 **Your documentation drift detector is ready!**