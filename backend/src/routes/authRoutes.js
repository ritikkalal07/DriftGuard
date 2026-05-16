import express from 'express';
import { signup, login, getCurrentUser, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

export default router;

// Made with Bob
