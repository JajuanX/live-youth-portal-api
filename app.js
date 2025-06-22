import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth Middleware
app.use(authMiddleware.initialize); // attach auth check logic here as needed

// Example route
app.get('/', (req, res) => {
	res.json({ message: 'API running' });
});

// Error Middleware
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
