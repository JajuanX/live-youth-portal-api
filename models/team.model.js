import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		sport: { type: String },
		level: { type: String },
		logo: { type: String },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		players: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);
export default Team;
