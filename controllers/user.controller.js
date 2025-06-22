import User from '../models/user.model.js';

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

export const deleteUserProfile = async (req, res, next) => {
	try {
		await User.findByIdAndDelete(req.user._id);
		res.json({ message: 'User account deleted' });
	} catch (err) {
		next(err);
	}
};
