# SS Education Backend

This is the NodeJS + Express + MongoDB backend for the SS Education Admin Panel.

## Features
- **Admin Authentication**: Secure JWT-based authentication with bcrypt-hashed passwords.
- **Dynamic Blogs**: Full CRUD support for blog articles, including image upload and auto-cleanup.
- **Success Stories**: CRUD support for student success stories with image upload.
- **Lead Viewer**: Read-only lead logging and viewing support for admin oversight.
- **Local Storage File Uploads**: Uses Multer to save uploaded media locally on the server (ideal for Hostinger persistent storage).

## Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local community edition or Atlas URI)

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root of this directory and configure the variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ss_education
   JWT_SECRET=your_jwt_secret_key_here
   ADMIN_PASSWORD=ssadmin2026
   ```

3. **Development Mode (with auto-reload)**:
   ```bash
   npm run dev
   ```

4. **Production Mode**:
   ```bash
   npm start
   ```

## Database Initialization
On the first server boot, if the database has no admin users, the server will automatically seed an admin account:
- **Username**: `admin`
- **Password**: The value defined in `ADMIN_PASSWORD` in your `.env` file (defaults to `ssadmin2026`).

## Image Uploads
Uploaded images are stored in `public/uploads/` and served statically. For instance, if the server runs on `http://localhost:5000`, the images will be served at `http://localhost:5000/uploads/filename.png`.
When a blog post or success story is deleted, the backend automatically deletes the corresponding image from the disk to save space.
