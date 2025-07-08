import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
	createTeam,
	getTeam,
	updateTeam,
	deleteTeam,
	getAllTeams,
	requestToJoinTeam,
	approveRequest,
	denyRequest,
	getTeamByCoach,
	removePlayer
} from '../controllers/team.controller.js';

const router = express.Router();

router.get('/', getAllTeams);
router.get('/my-team', protect, getTeamByCoach);
router.get('/:id', getTeam);
router.post('/', protect, createTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);

// Team join flow
router.post('/:id/join', protect, requestToJoinTeam);
router.post('/:teamId/requests/:userId/approve', protect, approveRequest);
router.post('/:teamId/requests/:userId/deny', protect, denyRequest);
router.post('/:teamId/remove-player', protect, removePlayer);

export default router;
