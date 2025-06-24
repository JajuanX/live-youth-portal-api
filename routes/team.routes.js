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

// Authenticated team actions
router.use(protect);

router.post('/', createTeam);
router.get('/', getAllTeams);
router.get('/my-team', getTeamByCoach);
router.get('/:id', getTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// Team join flow
router.post('/:id/join', requestToJoinTeam);
router.post('/:teamId/requests/:userId/approve', approveRequest);
router.post('/:teamId/requests/:userId/deny', denyRequest);
router.post('/:teamId/remove-player', removePlayer);

export default router;
