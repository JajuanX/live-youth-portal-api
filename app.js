import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import teamRoutes from './routes/team.routes.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors({
	origin: process.env.CLIENT_ORIGIN || '*',
	credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'API running' });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB connected');
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	});
