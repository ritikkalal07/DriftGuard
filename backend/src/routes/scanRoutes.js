import express from 'express';
import {
  createNewScan as createScan,
  getScan as getScan,
  getAllScans as getScans,
  getScanReports,
  deleteScan
} from '../controllers/scanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getScans)
  .post(createScan);

router.route('/:id')
  .get(getScan)
  .delete(deleteScan);

router.get('/:id/reports', getScanReports);

export default router;

// Made with Bob
