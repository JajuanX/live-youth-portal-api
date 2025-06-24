import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
	leaveTeam,
} from '../controllers/user.controller.js';

const router = express.Router();

router
	.route('/me')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deleteUserProfile);

router.patch('/me/leave-team', protect, leaveTeam);

export default router;
