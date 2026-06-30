import express from 'express';
import { loginUser, getAdminProfile, updateAdminProfile } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile', getAdminProfile);
router.put('/profile', protect, upload.single('profilePic'), updateAdminProfile);

export default router;
