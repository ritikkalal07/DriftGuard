import supabase from '../config/supabase.js';

/**
 * Helper functions for Supabase database operations
 */

// Scans
export const createScan = async (scanData) => {
  const { data, error } = await supabase
    .from('scans')
    .insert([scanData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getScanById = async (scanId, userId) => {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateScan = async (scanId, updates) => {
  const { data, error } = await supabase
    .from('scans')
    .update(updates)
    .eq('id', scanId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getScans = async (userId, filters = {}) => {
  let query = supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId);

  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  query = query.order('created_at', { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Drift Reports
export const createDriftReport = async (reportData) => {
  const { data, error } = await supabase
    .from('drift_reports')
    .insert([reportData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getDriftReportById = async (reportId) => {
  const { data, error } = await supabase
    .from('drift_reports')
    .select('*')
    .eq('id', reportId)
    .single();
  
  if (error) throw error;
  return data;
};

export const getDriftReports = async (filters = {}) => {
  let query = supabase.from('drift_reports').select('*');

  if (filters.scanId) {
    query = query.eq('scan_id', filters.scanId);
  }
  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.driftStatus) {
    query = query.eq('drift_status', filters.driftStatus);
  }

  query = query.order('created_at', { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateDriftReport = async (reportId, updates) => {
  const { data, error } = await supabase
    .from('drift_reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Suggestions
export const createSuggestion = async (suggestionData) => {
  const { data, error } = await supabase
    .from('suggestions')
    .insert([suggestionData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSuggestionById = async (suggestionId) => {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('id', suggestionId)
    .single();
  
  if (error) throw error;
  return data;
};

export const getSuggestions = async (filters = {}) => {
  let query = supabase.from('suggestions').select('*');

  if (filters.reportId) {
    query = query.eq('report_id', filters.reportId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateSuggestion = async (suggestionId, updates) => {
  const { data, error } = await supabase
    .from('suggestions')
    .update(updates)
    .eq('id', suggestionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Settings
export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
    if (error && (error.code === 'PGRST116' || error.code === '42P01')) return null;
  return data;
};

export const createOrUpdateSettings = async (userId, settingsData) => {
  const { data, error } = await supabase
    .from('settings')
    .upsert([
      {
        user_id: userId,
        ...settingsData
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Dashboard Stats
export const getDashboardStats = async (userId) => {
  // Get total projects
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get total scans
  const { count: scanCount } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get recent scans with drift counts
  const { data: recentScans } = await supabase
    .from('scans')
    .select('high_drift_count, medium_drift_count, low_drift_count, missing_docs_count, no_drift_count')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const stats = {
    totalProjects: projectCount || 0,
    totalScans: scanCount || 0,
    highDriftCount: recentScans?.reduce((sum, s) => sum + (s.high_drift_count || 0), 0) || 0,
    mediumDriftCount: recentScans?.reduce((sum, s) => sum + (s.medium_drift_count || 0), 0) || 0,
    lowDriftCount: recentScans?.reduce((sum, s) => sum + (s.low_drift_count || 0), 0) || 0,
    missingDocsCount: recentScans?.reduce((sum, s) => sum + (s.missing_docs_count || 0), 0) || 0,
    noDriftCount: recentScans?.reduce((sum, s) => sum + (s.no_drift_count || 0), 0) || 0
  };

  return stats;
};

export default {
  createScan,
  getScanById,
  updateScan,
  getScans,
  createDriftReport,
  getDriftReportById,
  getDriftReports,
  updateDriftReport,
  createSuggestion,
  getSuggestionById,
  getSuggestions,
  updateSuggestion,
  getUserSettings,
  createOrUpdateSettings,
  getDashboardStats
};

// Made with Bob
