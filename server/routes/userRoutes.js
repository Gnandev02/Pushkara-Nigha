import express from 'express';
import { getSupervisors, getSupervisor, addSupervisor, updateSupervisor, deleteSupervisor } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT authentication to protect the supervisor directory routes
router.use(authenticateToken);

router.get('/', getSupervisors);
router.get('/:username', getSupervisor);
router.post('/', addSupervisor);
router.put('/:username', updateSupervisor);
router.delete('/:username', deleteSupervisor);

export default router;
