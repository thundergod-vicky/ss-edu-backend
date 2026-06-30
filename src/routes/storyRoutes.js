import express from 'express';
import {
  getStories,
  createStory,
  updateStory,
  deleteStory
} from '../controllers/storyController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getStories);

router.post('/', protect, upload.single('image'), createStory);
router.put('/:id', protect, upload.single('image'), updateStory);
router.delete('/:id', protect, deleteStory);

export default router;
