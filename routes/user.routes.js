import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
	leaveTeam,
	getAllPlayers,
	getPlayerById
} from '../controllers/user.controller.js';

const router = express.Router();

router
	.route('/me')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deleteUserProfile);

router.patch('/me/leave-team', protect, leaveTeam);
router.get('/players', getAllPlayers);
router.get('/players/:id', getPlayerById);


export default router;
