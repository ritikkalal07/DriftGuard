import supabase from '../config/supabase.js';
import { getDriftReportById, getDriftReports, updateDriftReport } from '../utils/supabaseHelpers.js';

/**
 * Get all drift reports
 * GET /api/reports
 */
export const getReports = async (req, res, next) => {
  try {
    const { projectId, scanId, status, driftStatus, limit } = req.query;

    const filters = {
      projectId,
      scanId,
      status,
      driftStatus,
      limit: limit ? parseInt(limit) : 100
    };

    const reports = await getDriftReports(filters);

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single drift report by ID
 * GET /api/reports/:id
 */
export const getReport = async (req, res, next) => {
  try {
    const report = await getDriftReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Get suggestions for this report
    const { data: suggestions } = await supabase
      .from('suggestions')
      .select('*')
      .eq('report_id', report.id)
      .order('created_at', { ascending: false });

    res.json({
      success: true,
      data: { 
        report,
        suggestions: suggestions || []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update drift report status
 * PATCH /api/reports/:id
 */
export const updateReport = async (req, res, next) => {
  try {
    const { status, resolvedBy } = req.body;

    const report = await getDriftReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const updates = {};
    if (status !== undefined) {
      updates.status = status;
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = resolvedBy || req.user.id;
      }
    }

    const updatedReport = await updateDriftReport(req.params.id, updates);

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report: updatedReport }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete drift report
 * DELETE /api/reports/:id
 */
export const deleteReport = async (req, res, next) => {
  try {
    const report = await getDriftReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const { error } = await supabase
      .from('drift_reports')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get report suggestions
 * GET /api/reports/:id/suggestions
 */
export const getReportSuggestions = async (req, res, next) => {
  try {
    const report = await getDriftReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const { data: suggestions, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('report_id', report.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: { suggestions: suggestions || [] }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reports by project
 * GET /api/reports/project/:projectId
 */
export const getReportsByProject = async (req, res, next) => {
  try {
    const { status, driftStatus, limit } = req.query;

    const filters = {
      projectId: req.params.projectId,
      status,
      driftStatus,
      limit: limit ? parseInt(limit) : 100
    };

    const reports = await getDriftReports(filters);

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    next(error);
  }
};

  /**
   * Export a report (returns JSON attachment)
   * GET /api/reports/:id/export
   */
  export const exportReport = async (req, res, next) => {
    try {
      const report = await getDriftReportById(req.params.id);

      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      const filename = `report-${report.id}.json`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(report);
    } catch (error) {
      next(error);
    }
  };

// Made with Bob
