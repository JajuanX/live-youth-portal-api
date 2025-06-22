import express from 'express';
import auth from '../middleware/auth.middleware.js';
import {
	createTransferRequest,
	approveTransferRequest,
	denyTransferRequest,
} from '../controllers/transfer.controller.js';

const router = express.Router();

router.post('/', auth.protect, createTransferRequest);
router.put('/:id/approve', auth.protect, approveTransferRequest);
router.put('/:id/deny', auth.protect, denyTransferRequest);

export default router;
