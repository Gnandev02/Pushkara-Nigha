import express from 'express';
import { getCameras } from '../controllers/cameraController.js';

const router = express.Router();

router.get('/', getCameras);

export default router;
