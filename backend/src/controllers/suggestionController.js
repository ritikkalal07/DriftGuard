import supabase from '../config/supabase.js';
import { getSuggestionById, getSuggestions, updateSuggestion } from '../utils/supabaseHelpers.js';

/**
 * Get all suggestions
 * GET /api/suggestions
 */
export const getAllSuggestions = async (req, res, next) => {
  try {
    const { reportId, status } = req.query;

    const filters = {
      reportId,
      status
    };

    const suggestions = await getSuggestions(filters);

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single suggestion by ID
 * GET /api/suggestions/:id
 */
export const getSuggestion = async (req, res, next) => {
  try {
    const suggestion = await getSuggestionById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    res.json({
      success: true,
      data: { suggestion }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept suggestion
 * POST /api/suggestions/:id/accept
 */
export const acceptSuggestion = async (req, res, next) => {
  try {
    const suggestion = await getSuggestionById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    if (suggestion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Suggestion has already been processed'
      });
    }

    const updatedSuggestion = await updateSuggestion(req.params.id, {
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_by: req.user.id
    });

    res.json({
      success: true,
      message: 'Suggestion accepted successfully',
      data: { suggestion: updatedSuggestion }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject suggestion
 * POST /api/suggestions/:id/reject
 */
export const rejectSuggestion = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const suggestion = await getSuggestionById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    if (suggestion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Suggestion has already been processed'
      });
    }

    const updatedSuggestion = await updateSuggestion(req.params.id, {
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejected_by: req.user.id,
      rejection_reason: reason || null
    });

    res.json({
      success: true,
      message: 'Suggestion rejected successfully',
      data: { suggestion: updatedSuggestion }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete suggestion
 * DELETE /api/suggestions/:id
 */
export const deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await getSuggestionById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    const { error } = await supabase
      .from('suggestions')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Suggestion deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get suggestions by report
 * GET /api/suggestions/report/:reportId
 */
export const getSuggestionsByReport = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filters = {
      reportId: req.params.reportId,
      status
    };

    const suggestions = await getSuggestions(filters);

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob
