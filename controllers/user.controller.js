import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import mongoose from 'mongoose';

export const getUserProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id)
			.select('-password')
			.populate('team', 'name sport level');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
};

export const getAllPlayers = async (req, res, next) => {
	try {
		const players = await User.find({ role: 'player' })
			.select('-password')
			.populate('team', 'name level'); 

		res.json({ players });
	} catch (err) {
		next(err);
	}
};

export const updateUserProfile = async (req, res, next) => {
	try {
		const updates = req.body;
		const user = await User.findById(req.user._id);

		if (!user) return res.status(404).json({ message: 'User not found' });

		const blockedFields = ['role', 'password', 'team'];

		Object.keys(updates).forEach((key) => {
			if (!blockedFields.includes(key) && key in user) {
				user[key] = updates[key];
			}
		});

		const updatedUser = await user.save();

		res.json({
			message: 'Profile updated',
			user: {
				id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				bio: updatedUser.bio,
				team: updatedUser.team,
				position: updatedUser.position,
				socials: updatedUser.socials,
				profileImage: updatedUser.profileImage,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const leaveTeam = async (req, res, next) => {
	try {
		if (req.user.role !== 'player') {
			return res.status(403).json({ message: 'Only players can leave a team' });
		}

		const user = await User.findById(req.user._id);
		if (!user || !user.team) {
			return res.status(400).json({ message: 'You are not part of a team' });
		}

		const oldTeamId = user.team;

		// 1. Update the user (remove their team)
		user.team = null;
		await user.save();

		// 2. Update the team (remove the user from players list)
		const team = await Team.findById(oldTeamId);
		if (team) {
			team.players = team.players.filter(
				(id) => !id.equals(req.user._id)
			);
			await team.save();
		}

		// 3. Optional logging
		console.log(`Player ${user.name} left team ${team?.name || 'unknown'}`);

		res.json({
			message: 'You have left your team',
			teamLeft: oldTeamId,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteUserProfile = async (req, res, next) => {
	try {
		await User.findByIdAndDelete(req.user._id);
		res.json({ message: 'User account deleted' });
	} catch (err) {
		next(err);
	}
};

export const getPlayerById = async (req, res, next) => {
	try {
		const player = await User.findById(req.params.id)
			.select('-password')
			.populate('team', 'name level');

		if (!player || player.role !== 'player') {
			return res.status(404).json({ message: 'Player not found' });
		}

		res.json({ user: player });
	} catch (err) {
		next(err);
	}
};
