-- DriftGuard Database Schema for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/yvmdcwrhusrgvghqigjm/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  repository_url VARCHAR(500),
  repository_path VARCHAR(500),
  default_branch VARCHAR(100) DEFAULT 'main',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_type VARCHAR(50) NOT NULL DEFAULT 'manual',
  diff_content TEXT NOT NULL,
  diff_source VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_files INTEGER DEFAULT 0,
  high_drift_count INTEGER DEFAULT 0,
  medium_drift_count INTEGER DEFAULT 0,
  low_drift_count INTEGER DEFAULT 0,
  no_drift_count INTEGER DEFAULT 0,
  missing_docs_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drift Reports table
CREATE TABLE IF NOT EXISTS drift_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  changed_file VARCHAR(500) NOT NULL,
  changed_symbols JSONB DEFAULT '[]',
  related_docs JSONB DEFAULT '[]',
  drift_status VARCHAR(50) NOT NULL,
  severity_score INTEGER NOT NULL DEFAULT 0,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  suggested_patch TEXT,
  reviewer_comment TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES drift_reports(id) ON DELETE CASCADE,
  suggestion_type VARCHAR(50) NOT NULL,
  original_content TEXT,
  suggested_content TEXT NOT NULL,
  explanation TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES users(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_provider VARCHAR(50) DEFAULT 'mock',
  ai_api_key VARCHAR(500),
  ai_model VARCHAR(100),
  ai_endpoint VARCHAR(500),
  drift_sensitivity VARCHAR(20) DEFAULT 'medium',
  file_ignore_patterns TEXT[],
  auto_scan_enabled BOOLEAN DEFAULT false,
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id   ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_project_id  ON scans(project_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id     ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_status      ON scans(status);
CREATE INDEX IF NOT EXISTS idx_reports_scan_id   ON drift_reports(scan_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON drift_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_status    ON drift_reports(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_report_id ON suggestions(report_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_settings_user_id  ON settings(user_id);

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scans_updated_at BEFORE UPDATE ON scans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drift_reports_updated_at BEFORE UPDATE ON drift_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at BEFORE UPDATE ON suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE drift_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

-- RLS policies (open for now — service-role key bypasses RLS anyway)
DROP POLICY IF EXISTS "Users select own"       ON users;
DROP POLICY IF EXISTS "Users update own"       ON users;
DROP POLICY IF EXISTS "Projects select"        ON projects;
DROP POLICY IF EXISTS "Projects insert"        ON projects;
DROP POLICY IF EXISTS "Projects update"        ON projects;
DROP POLICY IF EXISTS "Projects delete"        ON projects;
DROP POLICY IF EXISTS "Scans select"            ON scans;
DROP POLICY IF EXISTS "Scans insert"            ON scans;
DROP POLICY IF EXISTS "Scans update"            ON scans;
DROP POLICY IF EXISTS "Scans delete"            ON scans;
DROP POLICY IF EXISTS "Reports select"         ON drift_reports;
DROP POLICY IF EXISTS "Reports insert"         ON drift_reports;
DROP POLICY IF EXISTS "Reports update"         ON drift_reports;
DROP POLICY IF EXISTS "Reports delete"         ON drift_reports;
DROP POLICY IF EXISTS "Suggestions select"     ON suggestions;
DROP POLICY IF EXISTS "Suggestions insert"     ON suggestions;
DROP POLICY IF EXISTS "Suggestions update"     ON suggestions;
DROP POLICY IF EXISTS "Suggestions delete"     ON suggestions;
DROP POLICY IF EXISTS "Settings select own"    ON settings;
DROP POLICY IF EXISTS "Settings insert"        ON settings;
DROP POLICY IF EXISTS "Settings update"        ON settings;

CREATE POLICY "Users select own"      ON users      FOR SELECT USING (true);
CREATE POLICY "Users update own"      ON users      FOR UPDATE USING (true);
CREATE POLICY "Projects select"       ON projects   FOR SELECT USING (true);
CREATE POLICY "Projects insert"       ON projects   FOR INSERT WITH CHECK (true);
CREATE POLICY "Projects update"       ON projects   FOR UPDATE USING (true);
CREATE POLICY "Projects delete"       ON projects   FOR DELETE USING (true);
CREATE POLICY "Scans select"          ON scans      FOR SELECT USING (true);
CREATE POLICY "Scans insert"          ON scans      FOR INSERT WITH CHECK (true);
CREATE POLICY "Scans update"          ON scans      FOR UPDATE USING (true);
CREATE POLICY "Scans delete"          ON scans      FOR DELETE USING (true);
CREATE POLICY "Reports select"        ON drift_reports FOR SELECT USING (true);
CREATE POLICY "Reports insert"        ON drift_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Reports update"        ON drift_reports FOR UPDATE USING (true);
CREATE POLICY "Reports delete"        ON drift_reports FOR DELETE USING (true);
CREATE POLICY "Suggestions select"    ON suggestions FOR SELECT USING (true);
CREATE POLICY "Suggestions insert"    ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Suggestions update"    ON suggestions FOR UPDATE USING (true);
CREATE POLICY "Suggestions delete"    ON suggestions FOR DELETE USING (true);
CREATE POLICY "Settings select own"   ON settings   FOR SELECT USING (true);
CREATE POLICY "Settings insert"       ON settings   FOR INSERT WITH CHECK (true);
CREATE POLICY "Settings update"       ON settings   FOR UPDATE USING (true);

-- Demo user (password: demo123, bcrypt hash)
INSERT INTO users (id, name, email, password)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'demo@driftguard.dev', '$2a$10$LZ27Irjn66yQkknkv.SzC./Y5AB35kHPwi4vr8ql8./aDe5NI8.I2')
ON CONFLICT (email) DO NOTHING;

-- Default demo settings
INSERT INTO settings (user_id, ai_provider, drift_sensitivity, auto_scan_enabled, notification_enabled)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'mock', 'medium', false, true)
ON CONFLICT (user_id) DO NOTHING;

-- Verify
DO $$
BEGIN
  RAISE NOTICE 'DriftGuard schema applied. Demo: demo@driftguard.dev / demo123';
END $$;
