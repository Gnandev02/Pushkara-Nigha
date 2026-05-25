import express from 'express';
import { getGhats, getGhatById, addGhat, updateGhat, deleteGhat } from '../controllers/ghatController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public read routes (dashboard needs these without auth for initial load)
router.get('/', getGhats);
router.get('/:id', getGhatById);

// Protected write routes
router.post('/', authenticateToken, requireAdmin, addGhat);
router.put('/:id', authenticateToken, updateGhat);
router.delete('/:id', authenticateToken, requireAdmin, deleteGhat);

export default router;
