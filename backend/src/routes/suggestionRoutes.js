import express from 'express';
import {
  getAllSuggestions,
  getSuggestion,
  acceptSuggestion,
  rejectSuggestion,
  deleteSuggestion,
  getSuggestionsByReport,
  exportSuggestion
} from '../controllers/suggestionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllSuggestions);
router.get('/report/:reportId', getSuggestionsByReport);

router.route('/:id')
  .get(getSuggestion)
  .delete(deleteSuggestion);

router.put('/:id/accept', acceptSuggestion);
router.put('/:id/reject', rejectSuggestion);
router.get('/:id/export', exportSuggestion);

export default router;

// Made with Bob
