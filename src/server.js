import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

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
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  const memory = process.memoryUsage();
  const ramUsed = (memory.heapUsed / 1024 / 1024).toFixed(2) + ' MB';

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SS Education API Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090e;
      --card-bg: #0d1117;
      --border: #21262d;
      --text: #c9d1d9;
      --text-muted: #8b949e;
      --primary: #ff4757;
      --success: #2ea44f;
      --warning: #dbab09;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .container {
      width: 100%;
      max-width: 600px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .logo-section {
      display: flex;
      flex-direction: column;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.025em;
    }
    .subtitle {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      margin-top: 0.2rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(46, 164, 79, 0.1);
      border: 1px solid rgba(46, 164, 79, 0.2);
      color: var(--success);
      padding: 0.4rem 0.8rem;
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--success);
    }
    .section-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.015);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
    }
    .metric-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 0.2rem;
    }
    .metric-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
    }
    .endpoint-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
    }
    .endpoint-path {
      font-family: monospace;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      transition: color 0.2s;
    }
    .endpoint-path:hover {
      color: var(--primary);
    }
    .endpoint-status {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-ok { color: var(--success); }
    .status-protected { color: var(--warning); }
    .footer {
      text-align: center;
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <h1 class="title">SS Education</h1>
        <span class="subtitle">API GATEWAY STATUS</span>
      </div>
      <div class="status-badge">
        <div class="status-dot"></div>
        <span>SYSTEM ONLINE</span>
      </div>
    </div>

    <h2 class="section-title">System Metrics</h2>
    <div class="grid">
      <div class="metric-card">
        <div class="metric-label">Database Connection</div>
        <div class="metric-value" style="color: ${dbStatus === 'Connected' ? 'var(--success)' : 'var(--primary)'}">${dbStatus}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Uptime</div>
        <div class="metric-value">${uptimeStr}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Memory Usage</div>
        <div class="metric-value">${ramUsed}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Environment</div>
        <div class="metric-value" style="text-transform: uppercase;">${process.env.NODE_ENV || 'development'}</div>
      </div>
    </div>

    <h2 class="section-title">API Health Checkpoints</h2>
    <div class="endpoint-list">
      <div class="endpoint-item">
        <a href="/api/blogs" target="_blank" class="endpoint-path">GET /api/blogs</a>
        <span class="endpoint-status status-ok">Public [Active]</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/stories" target="_blank" class="endpoint-path">GET /api/stories</a>
        <span class="endpoint-status status-ok">Public [Active]</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/team" target="_blank" class="endpoint-path">GET /api/team</a>
        <span class="endpoint-status status-ok">Public [Active]</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/colleges" target="_blank" class="endpoint-path">GET /api/colleges</a>
        <span class="endpoint-status status-ok">Public [Active]</span>
      </div>
      <div class="endpoint-item">
        <span class="endpoint-path">/api/auth/*</span>
        <span class="endpoint-status status-protected">Auth Required</span>
      </div>
      <div class="endpoint-item">
        <span class="endpoint-path">/api/leads/*</span>
        <span class="endpoint-status status-protected">Auth Required</span>
      </div>
    </div>

    <div class="footer">
      Node ${process.version} &bull; Port ${PORT} &bull; SS Education Service API
    </div>
  </div>
</body>
</html>`);
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
