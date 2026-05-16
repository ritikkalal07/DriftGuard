import supabase from '../config/supabase.js';
import { createScan, updateScan, getScanById, getScans } from '../utils/supabaseHelpers.js';
import DriftDetectionService from '../services/drift/DriftDetectionService.js';

/**
 * Get all scans for current user
 * GET /api/scans
 */
export const getAllScans = async (req, res, next) => {
  try {
    const { projectId, status, limit } = req.query;
    
    const filters = {
      projectId,
      status,
      limit: limit ? parseInt(limit) : 50
    };

    const scans = await getScans(req.user.id, filters);

    res.json({
      success: true,
      data: { scans }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single scan by ID
 * GET /api/scans/:id
 */
export const getScan = async (req, res, next) => {
  try {
    const scan = await getScanById(req.params.id, req.user.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    // Get drift reports for this scan
    const { data: reports } = await supabase
      .from('drift_reports')
      .select('*')
      .eq('scan_id', scan.id)
      .order('severity_score', { ascending: false });

    res.json({
      success: true,
      data: { 
        scan,
        reports: reports || []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create and run new scan
 * POST /api/scans
 */
export const createNewScan = async (req, res, next) => {
  try {
    const { projectId, diffContent, diffSource, scanType } = req.body;

    // Validate input
    if (!projectId || !diffContent) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and diff content are required'
      });
    }

    // Verify project belongs to user
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', req.user.id)
      .single();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Create scan record
    const scan = await createScan({
      project_id: projectId,
      user_id: req.user.id,
      scan_type: scanType || 'manual',
      diff_content: diffContent,
      diff_source: diffSource || 'manual',
      status: 'processing',
      started_at: new Date().toISOString()
    });

    // Run drift detection asynchronously
    setImmediate(async () => {
      try {
        const results = await DriftDetectionService.analyzeDiff(
          diffContent,
          projectId,
          scan.id
        );

        // Update scan with results
        await updateScan(scan.id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_files: results.totalFiles || 0,
          high_drift_count: results.highDriftCount || 0,
          medium_drift_count: results.mediumDriftCount || 0,
          low_drift_count: results.lowDriftCount || 0,
          no_drift_count: results.noDriftCount || 0,
          missing_docs_count: results.missingDocsCount || 0
        });
      } catch (error) {
        console.error('Drift detection error:', error);
        await updateScan(scan.id, {
          status: 'failed',
          completed_at: new Date().toISOString()
        });
      }
    });

    res.status(201).json({
      success: true,
      message: 'Scan created and processing started',
      data: { scan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete scan
 * DELETE /api/scans/:id
 */
export const deleteScan = async (req, res, next) => {
  try {
    // Verify scan belongs to user
    const scan = await getScanById(req.params.id, req.user.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    // Delete scan (cascade will handle related records)
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get scan reports
 * GET /api/scans/:id/reports
 */
export const getScanReports = async (req, res, next) => {
  try {
    // Verify scan belongs to user
    const scan = await getScanById(req.params.id, req.user.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    const { data: reports, error } = await supabase
      .from('drift_reports')
      .select('*')
      .eq('scan_id', scan.id)
      .order('severity_score', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: { reports: reports || [] }
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob
