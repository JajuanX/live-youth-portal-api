import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
	createTransferRequest,
	approveTransferRequest,
	denyTransferRequest,
} from '../controllers/transfer.controller.js';

const router = express.Router();

router.post('/', protect, createTransferRequest);
router.put('/:id/approve', protect, approveTransferRequest);
router.put('/:id/deny', protect, denyTransferRequest);

export default router;
