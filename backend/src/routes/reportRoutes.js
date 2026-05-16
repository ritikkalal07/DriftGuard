import express from 'express';
import {
  getReports,
  getReport,
  updateReport as updateReportStatus,
  getReportSuggestions,
  exportReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getReports);

router.route('/:id')
  .get(getReport);

router.put('/:id/status', updateReportStatus);
router.get('/:id/suggestions', getReportSuggestions);
router.get('/:id/export', exportReport);

export default router;

// Made with Bob
