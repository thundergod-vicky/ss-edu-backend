import express from 'express';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.post('/', protect, upload.single('image'), createTeamMember);
router.put('/:id', protect, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
