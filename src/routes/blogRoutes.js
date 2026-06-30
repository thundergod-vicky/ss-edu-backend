import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

router.post('/', protect, upload.single('image'), createBlog);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
