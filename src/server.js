import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db.js';
import { seedAdminUser } from './controllers/authController.js';
import { seedTeamMembers } from './controllers/teamController.js';
import { seedColleges } from './controllers/collegeController.js';
import { seedSuccessStories } from './controllers/storyController.js';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';

import { BACKEND_ROOT, getUploadPath } from './utils/paths.js';

// Load environment variables absolutely (works correctly in Hostinger/Passenger)
dotenv.config({ path: path.join(BACKEND_ROOT, '.env') });

// Connect to MongoDB
connectDB().then(() => {
  seedAdminUser();
  seedTeamMembers();
  seedColleges();
  seedSuccessStories();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ensure local uploads directory exists on disk
const uploadDir = getUploadPath();
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/colleges', collegeRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SS Education API is running successfully.' });
});

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
