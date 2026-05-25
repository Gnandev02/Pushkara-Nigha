import express from 'express';
import { getMonitoring, updateMonitoring } from '../controllers/monitoringController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMonitoring);
router.put('/', authenticateToken, updateMonitoring);

export default router;
