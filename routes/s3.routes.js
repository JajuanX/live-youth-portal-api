import express from 'express';
import { getPresignedUrl } from '../controllers/s3.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/presign', protect, getPresignedUrl);

export default router;
