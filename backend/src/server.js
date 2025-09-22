// src/server.js
import './config/dotenv.config.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import postRoutes from './routes/post.routes.js';
import testRoutes from './routes/test.routes.js';
import mediaRoutes from './routes/media.routes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/media', mediaRoutes); 


// Health check
app.get('/', (req, res) => {
    res.send('Khel Pratibha API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
