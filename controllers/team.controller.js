import Team from '../models/team.model.js';

export const createTeam = async (req, res, next) => {
	try {
		if (!['coach', 'admin'].includes(req.user.role)) {
			return res.status(403).json({ message: 'Only coaches or admins can create teams' });
		}

		const { name, sport, level } = req.body;

		const team = await Team.create({
			name,
			sport,
			level,
			createdBy: req.user._id,
		});

		res.status(201).json({ message: 'Team created', team });
	} catch (err) {
		next(err);
	}
};

export const getTeam = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id).populate('players', 'name position profileImage');
		if (!team) return res.status(404).json({ message: 'Team not found' });
		res.json(team);
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
