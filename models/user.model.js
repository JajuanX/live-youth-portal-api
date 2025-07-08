import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const combineResultSchema = new mongoose.Schema(
	{
		date: { type: Date, default: Date.now },
		metrics: {
			fortyYardDash: { type: Number }, // in seconds
			verticalJump: { type: Number }, // in inches
			broadJump: { type: Number },    // in inches
			benchPress: { type: Number },   // reps or lbs
			threeCone: { type: Number },    // in seconds
			shuttle: { type: Number },      // in seconds
		},
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },

		role: {
			type: String,
			enum: ['player', 'coach', 'admin'],
			required: true,
			default: 'player',
		},

		bio: { type: String },
		position: { type: String },
		dob: { type: Date },

		socials: {
			twitter: { type: String },
			instagram: { type: String },
			youtube: { type: String },
		},

		highlightFilm: { type: String },
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
		customColors: {
			primary: { type: String, default: '#1e3a8a' },
			secondary: { type: String, default: '#facc15' }
		},
		combineResults: [combineResultSchema],
		nickname: { type: String },
		height: { type: String }, 
		weight: { type: String },  
		school: { type: String },
		gradYear: { type: Number },
		location: {
			city: { type: String },
			state: { type: String },
		},
		gpa: { type: String },
		profileImage: { type: String },
		team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
