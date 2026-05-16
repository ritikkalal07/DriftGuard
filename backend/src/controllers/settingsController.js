import { getUserSettings, createOrUpdateSettings } from '../utils/supabaseHelpers.js';
import aiService from '../services/ai/AIService.js';

/**
 * Get user settings
 * GET /api/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await getUserSettings(req.user.id);

    // If no settings exist, create default settings
    if (!settings) {
      settings = await createOrUpdateSettings(req.user.id, {
        ai_provider: 'mock',
        drift_sensitivity: 'medium',
        auto_scan_enabled: false,
        notification_enabled: true
      });
    }

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user settings
 * PUT /api/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const {
      aiProvider,
      aiApiKey,
      aiModel,
      aiEndpoint,
      driftSensitivity,
      fileIgnorePatterns,
      autoScanEnabled,
      notificationEnabled
    } = req.body;

    const updates = {};
    if (aiProvider !== undefined) updates.ai_provider = aiProvider;
    if (aiApiKey !== undefined) updates.ai_api_key = aiApiKey;
    if (aiModel !== undefined) updates.ai_model = aiModel;
    if (aiEndpoint !== undefined) updates.ai_endpoint = aiEndpoint;
    if (driftSensitivity !== undefined) updates.drift_sensitivity = driftSensitivity;
    if (fileIgnorePatterns !== undefined) updates.file_ignore_patterns = fileIgnorePatterns;
    if (autoScanEnabled !== undefined) updates.auto_scan_enabled = autoScanEnabled;
    if (notificationEnabled !== undefined) updates.notification_enabled = notificationEnabled;

    const settings = await createOrUpdateSettings(req.user.id, updates);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset settings to default
 * POST /api/settings/reset
 */
export const resetSettings = async (req, res, next) => {
  try {
    const defaultSettings = {
      ai_provider: 'mock',
      ai_api_key: null,
      ai_model: null,
      ai_endpoint: null,
      drift_sensitivity: 'medium',
      file_ignore_patterns: [],
      auto_scan_enabled: false,
      notification_enabled: true
    };

    const settings = await createOrUpdateSettings(req.user.id, defaultSettings);

    res.json({
      success: true,
      message: 'Settings reset to default',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob

/**
 * Get AI provider info
 * GET /api/settings/ai-provider
 */
export const getAIProviderInfo = async (req, res, next) => {
  try {
    const info = aiService.getProviderInfo();
    res.json({ success: true, data: { provider: info } });
  } catch (error) {
    next(error);
  }
};

/**
 * Test AI provider connectivity/functionality
 * POST /api/settings/test-ai
 */
export const testAIProvider = async (req, res, next) => {
  try {
    // For now, perform a lightweight provider check
    const info = aiService.getProviderInfo();
    if (!info.isReady) {
      return res.status(500).json({ success: false, message: 'AI provider not ready' });
    }

    // Optionally run a mock summary call to verify runtime
    try {
      await aiService.summarizeScan({ totalReports: 0, highDrift: 0, possibleDrift: 0, missingDocs: 0, noDrift: 0 });
    } catch (e) {
      // If provider fails, report error
      return res.status(500).json({ success: false, message: 'AI provider test failed', error: e.message });
    }

    res.json({ success: true, message: 'AI provider is available', data: { provider: info } });
  } catch (error) {
    next(error);
  }
};
