import express from 'express';
import { getColleges, createCollege, updateCollege, deleteCollege } from '../controllers/collegeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', getColleges);
router.post('/', protect, createCollege);
router.put('/:id', protect, updateCollege);
router.delete('/:id', protect, deleteCollege);

export default router;
