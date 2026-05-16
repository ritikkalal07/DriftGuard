import express from 'express';
import {
  acceptSuggestion,
  rejectSuggestion,
  exportSuggestion
} from '../controllers/suggestionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.put('/:id/accept', acceptSuggestion);
router.put('/:id/reject', rejectSuggestion);
router.get('/:id/export', exportSuggestion);

export default router;

// Made with Bob
