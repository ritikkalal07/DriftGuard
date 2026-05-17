import express from 'express';
import {
  getSettings,
  updateSettings,
  resetSettings,
  getAIProviderInfo,
  testAIProvider
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSettings)
  .put(updateSettings);

router.post('/reset', resetSettings);
router.get('/ai-provider', getAIProviderInfo);
router.post('/test-ai', testAIProvider);

export default router;

// Made with Bob
