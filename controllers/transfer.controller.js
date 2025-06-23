import TransferRequest from '../models/transferRequest.model.js';
import User from '../models/user.model.js';
import Team from '../models/team.model.js';

export const createTransferRequest = async (req, res, next) => {
	try {
		if (req.user.role !== 'player') {
			return res.status(403).json({ message: 'Only players can request transfers' });
		}

		const { teamId } = req.body;

		const existing = await TransferRequest.findOne({
			player: req.user._id,
			team: teamId,
			status: 'pending',
		});

		if (existing) {
			return res.status(400).json({ message: 'Transfer request already pending' });
		}

		const team = await Team.findById(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		const request = await TransferRequest.create({
			player: req.user._id,
			team: teamId,
			createdBy: req.user._id,
		});

		res.status(201).json({ message: 'Transfer request submitted', request });
	} catch (err) {
		next(err);
	}
};

export const approveTransferRequest = async (req, res, next) => {
	try {
		const request = await TransferRequest.findById(req.params.id).populate('team');
		if (!request) return res.status(404).json({ message: 'Transfer request not found' });

		if (request.status !== 'pending') {
			return res.status(400).json({ message: 'Transfer request already processed' });
		}

		const isCoach = request.team.createdBy.equals(req.user._id);
		const isAdmin = req.user.role === 'admin';
		if (!isCoach && !isAdmin) {
			return res.status(403).json({ message: 'Not authorized to approve this request' });
		}

		request.status = 'approved';
		request.reviewedBy = req.user._id;
		await request.save();

		const player = await User.findById(request.player);
		if (!player) return res.status(404).json({ message: 'Player not found' });

		player.team = request.team._id;
		await player.save();

		res.json({ message: 'Player approved and added to team', request });
	} catch (err) {
		next(err);
	}
};

export const denyTransferRequest = async (req, res, next) => {
	try {
		const request = await TransferRequest.findById(req.params.id).populate('team');
		if (!request) return res.status(404).json({ message: 'Transfer request not found' });

		if (request.status !== 'pending') {
			return res.status(400).json({ message: 'Transfer request already processed' });
		}

		const isCoach = request.team.createdBy.equals(req.user._id);
		const isAdmin = req.user.role === 'admin';
		if (!isCoach && !isAdmin) {
			return res.status(403).json({ message: 'Not authorized to deny this request' });
		}

		request.status = 'denied';
		request.reviewedBy = req.user._id;
		await request.save();

		res.json({ message: 'Transfer request denied', request });
	} catch (err) {
		next(err);
	}
};
