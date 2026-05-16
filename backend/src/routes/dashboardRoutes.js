import express from 'express';
import {
  getDashboard as getDashboardStats,
  getActivity,
  getCharts as getTrends,
  getProjectsHealth
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getActivity);
router.get('/trends', getTrends);
router.get('/projects-health', getProjectsHealth);

export default router;

// Made with Bob
