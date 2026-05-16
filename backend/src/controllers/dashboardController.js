import supabase from '../config/supabase.js';
import { getDashboardStats } from '../utils/supabaseHelpers.js';

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.user.id);

    // Get recent scans
    const { data: recentScans } = await supabase
      .from('scans')
      .select('id, project_id, status, created_at, high_drift_count, medium_drift_count, low_drift_count')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent reports
    const { data: recentReports } = await supabase
      .from('drift_reports')
      .select(`
        id,
        changed_file,
        drift_status,
        severity_score,
        created_at,
        scans!inner(user_id)
      `)
      .eq('scans.user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats,
        recentScans: recentScans || [],
        recentReports: recentReports || []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard activity
 * GET /api/dashboard/activity
 */
export const getActivity = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent scans with project info
    const { data: scans } = await supabase
      .from('scans')
      .select(`
        id,
        status,
        created_at,
        high_drift_count,
        projects(id, name)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Get recent drift reports
    const { data: reports } = await supabase
      .from('drift_reports')
      .select(`
        id,
        changed_file,
        drift_status,
        severity_score,
        created_at,
        scans!inner(user_id, project_id),
        projects(id, name)
      `)
      .eq('scans.user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Combine and sort by date
    const activity = [
      ...(scans || []).map(s => ({
        type: 'scan',
        id: s.id,
        projectName: s.projects?.name,
        status: s.status,
        highDriftCount: s.high_drift_count,
        createdAt: s.created_at
      })),
      ...(reports || []).map(r => ({
        type: 'report',
        id: r.id,
        projectName: r.projects?.name,
        changedFile: r.changed_file,
        driftStatus: r.drift_status,
        severityScore: r.severity_score,
        createdAt: r.created_at
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard charts data
 * GET /api/dashboard/charts
 */
export const getCharts = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get scans over time
    const { data: scans } = await supabase
      .from('scans')
      .select('created_at, high_drift_count, medium_drift_count, low_drift_count')
      .eq('user_id', req.user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const scansByDate = {};
    (scans || []).forEach(scan => {
      const date = new Date(scan.created_at).toISOString().split('T')[0];
      if (!scansByDate[date]) {
        scansByDate[date] = {
          date,
          scans: 0,
          highDrift: 0,
          mediumDrift: 0,
          lowDrift: 0
        };
      }
      scansByDate[date].scans++;
      scansByDate[date].highDrift += scan.high_drift_count || 0;
      scansByDate[date].mediumDrift += scan.medium_drift_count || 0;
      scansByDate[date].lowDrift += scan.low_drift_count || 0;
    });

    const chartData = Object.values(scansByDate);

    // Get drift status distribution
    const { data: reports } = await supabase
      .from('drift_reports')
      .select(`
        drift_status,
        scans!inner(user_id)
      `)
      .eq('scans.user_id', req.user.id)
      .gte('created_at', startDate.toISOString());

    const driftDistribution = {
      high_drift: 0,
      possible_drift: 0,
      no_drift: 0,
      missing_docs: 0
    };

    (reports || []).forEach(report => {
      if (driftDistribution[report.drift_status] !== undefined) {
        driftDistribution[report.drift_status]++;
      }
    });

    res.json({
      success: true,
      data: {
        timeline: chartData,
        distribution: driftDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob

/**
 * Get projects health summary
 * GET /api/dashboard/projects-health
 */
export const getProjectsHealth = async (req, res, next) => {
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name')
      .eq('user_id', req.user.id);

    const results = [];

    for (const p of projects || []) {
      const { data: reports } = await supabase
        .from('drift_reports')
        .select('id, drift_status')
        .eq('project_id', p.id);

      const highDriftCount = (reports || []).filter(r => r.drift_status === 'high_drift').length;

      results.push({ projectId: p.id, projectName: p.name, highDriftCount });
    }

    res.json({ success: true, data: { projects: results } });
  } catch (error) {
    next(error);
  }
};
