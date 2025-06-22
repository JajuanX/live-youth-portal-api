import express from 'express';
import auth from '../middleware/auth.middleware.js';
import {
	createTeam,
	getTeam,
	updateTeam,
	deleteTeam,
} from '../controllers/team.controller.js';

const router = express.Router();

router.post('/', auth.protect, createTeam);
router.get('/:id', auth.protect, getTeam);
router.put('/:id', auth.protect, updateTeam);
router.delete('/:id', auth.protect, deleteTeam);

export default router;
