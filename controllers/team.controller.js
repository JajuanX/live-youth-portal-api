import Team from '../models/team.model.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const createTeam = async (req, res, next) => {
	try {
		if (!['coach', 'admin'].includes(req.user.role)) {
			return res.status(403).json({ message: 'Only coaches or admins can create teams' });
		}
		console.log(req.body);

		const { name, sport, level, logo } = req.body;

		if (!name || !sport || !level) {
			return res.status(400).json({ message: 'Name, sport, and level are required' });
		}

		const newTeam = new Team({
			name,
			sport,
			level,
			createdBy: req.user._id,
		});

		if (logo) {
			newTeam.logo = logo; // assuming logo is a public S3 URL passed from frontend
		}

		const team = await newTeam.save();

		res.status(201).json({ message: 'Team created', team });
	} catch (err) {
		next(err);
	}
};

export const removePlayer = async (req, res, next) => {
	try {
		const { teamId } = req.params;
		const { playerId } = req.body;

		const team = await Team.findById(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		if (!req.user._id.equals(team.createdBy) && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorized' });
		}

		team.players = team.players.filter(
			(id) => id.toString() !== playerId
		);
		await team.save();

		const user = await User.findById(playerId);
		if (user) {
			user.team = null;
			await user.save();
		}

		res.json({ message: 'Player removed from team' });
	} catch (err) {
		next(err);
	}
};

export const getTeamByCoach = async (req, res, next) => {
	try {
		if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

		const team = await Team.findOne({ createdBy: req.user._id })
			.populate('players', 'name email position profileImage')
			.populate('pendingRequests', 'name email position profileImage');

		if (!team) return res.status(404).json({ message: 'No team found for this coach' });

		res.json({ team });
	} catch (err) {
		next(err);
	}
};
export const getTeam = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id).populate('players', 'name position profileImage').populate('createdBy', '-password');
		if (!team) return res.status(404).json({ message: 'Team not found' });
		res.json(team);
	} catch (err) {
		next(err);
	}
};

export const getAllTeams = async (req, res, next) => {
	try {
		const filters = {};
		const { sport, level } = req.query;

		if (sport) filters.sport = sport;
		if (level) filters.level = level;

		const teams = await Team.find(filters)
			.populate('createdBy', 'name role') // optional
			.select('-players'); // don't return player array here

		res.json({ teams });
	} catch (err) {
		next(err);
	}
};


export const updateTeam = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		// Only allow coach who created it or an admin
		if (
			!req.user._id.equals(team.createdBy) &&
			req.user.role !== 'admin'
		) {
			return res.status(403).json({ message: 'Not authorized to update this team' });
		}

		const { name, sport, level } = req.body;

		if (name) team.name = name;
		if (sport) team.sport = sport;
		if (level) team.level = level;

		const updated = await team.save();
		res.json({ message: 'Team updated', team: updated });
	} catch (err) {
		next(err);
	}
};

export const deleteTeam = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		if (
			!req.user._id.equals(team.createdBy) &&
			req.user.role !== 'admin'
		) {
			return res.status(403).json({ message: 'Not authorized to delete this team' });
		}

		await team.deleteOne();
		res.json({ message: 'Team deleted' });
	} catch (err) {
		next(err);
	}
};

export const requestToJoinTeam = async (req, res, next) => {
	try {
		const teamId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(teamId)) {
			return res.status(400).json({ message: 'Invalid team ID' });
		}

		const team = await Team.findById(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		if (req.user.role !== 'player') {
			return res.status(403).json({ message: 'Only players can request to join' });
		}

		if (req.user.team) {
			return res.status(400).json({ message: 'You are already on a team' });
		}

		// Prevent duplicate requests
		if (team.pendingRequests?.includes(req.user._id)) {
			return res.status(400).json({ message: 'Already requested to join this team' });
		}

		team.pendingRequests.push(req.user._id);
		await team.save();

		res.json({ message: 'Join request submitted' });
	} catch (err) {
		next(err);
	}
};

export const getPendingRequests = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id).populate('pendingRequests', 'name email role');

		if (!team) return res.status(404).json({ message: 'Team not found' });
		if (!req.user._id.equals(team.createdBy) && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Not authorized' });
		}

		res.json({ pending: team.pendingRequests });
	} catch (err) {
		next(err);
	}
};

export const approveRequest = async (req, res, next) => {
	try {
		const { teamId, userId } = req.params;

		const team = await Team.findById(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		// Check permission
		if (!req.user._id.equals(team.createdBy) && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Unauthorized' });
		}
		console.log(team);
		console.log(userId);
		
		// Check request exists
		if (!team.pendingRequests.includes(userId)) {
			return res.status(400).json({ message: 'User has not requested to join' });
		}

		// Move user to players
		team.players.push(userId);
		team.pendingRequests = team.pendingRequests.filter(
			(id) => id.toString() !== userId
		);
		await team.save();

		// Update user's team
		const user = await User.findById(userId);
		user.team = teamId;
		await user.save();

		res.json({ message: 'User approved and added to team' });
	} catch (err) {
		next(err);
	}
};

export const denyRequest = async (req, res, next) => {
	try {
		const { teamId, userId } = req.params;

		const team = await Team.findById(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		if (!req.user._id.equals(team.createdBy) && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Unauthorized' });
		}

		team.pendingRequests = team.pendingRequests.filter(
			(id) => id.toString() !== userId
		);
		await team.save();

		res.json({ message: 'Join request denied' });
	} catch (err) {
		next(err);
	}
};

