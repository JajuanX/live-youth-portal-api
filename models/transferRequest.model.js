import mongoose from 'mongoose';

const transferRequestSchema = new mongoose.Schema(
	{
		player: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Team',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'denied'],
			default: 'pending',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		reviewedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

const TransferRequest = mongoose.model('TransferRequest', transferRequestSchema);
export default TransferRequest;
