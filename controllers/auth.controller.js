import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

export const registerUser = async (req, res, next) => {
	try {
		const { email, password, name } = req.body;

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ message: 'Email already in use' });
		}

		const user = await User.create({ email, password, name });

		res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				token: generateToken(user._id),
			},
		});
	} catch (err) {
		next(err);
	}
};

export const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user || !(await user.matchPassword(password))) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		res.json({
			message: 'Login successful',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				token: generateToken(user._id),
			},
		});
	} catch (err) {
		next(err);
	}
};
