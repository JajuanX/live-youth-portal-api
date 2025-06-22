import express from 'express';
import auth from '../middleware/auth.middleware.js';
import {
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
	leaveTeam,
} from '../controllers/user.controller.js';

const router = express.Router();

router
	.route('/me')
	.get(auth.protect, getUserProfile)
	.put(auth.protect, updateUserProfile)
	.delete(auth.protect, deleteUserProfile);

router.patch('/me/leave-team', auth.protect, leaveTeam);

export default router;
