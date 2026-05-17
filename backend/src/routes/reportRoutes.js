import express from 'express';
import {
  getReports,
  getReport,
  updateReport as updateReportStatus,
  deleteReport,
  getReportSuggestions,
  exportReport,
  getReportsByProject
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getReports);
router.get('/project/:projectId', getReportsByProject);

router.route('/:id')
  .get(getReport)
  .delete(deleteReport);

router.patch('/:id', updateReportStatus);
router.patch('/:id/status', updateReportStatus);
router.get('/:id/suggestions', getReportSuggestions);
router.get('/:id/export', exportReport);

export default router;

// Made with Bob
