import express from 'express';
import { getOfficers, getOfficerById } from '../controllers/officerController.js';

const router = express.Router();

router.get('/', getOfficers);
router.get('/:id', getOfficerById);

export default router;
