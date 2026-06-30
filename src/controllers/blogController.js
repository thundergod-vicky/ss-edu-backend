import Blog from '../models/Blog.js';
import fs from 'fs';
import path from 'path';
import { getUploadPath } from '../utils/paths.js';

// Helper function to delete local image file
const deleteLocalImage = (imagePath) => {
  if (!imagePath) return;
  try {
    const filename = path.basename(imagePath);
    const localFilePath = getUploadPath(filename);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Deleted image from disk: ${localFilePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file from disk: ${error.message}`);
  }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      blog.views += 1;
      await blog.save();
      return res.json(blog);
    } else {
      return res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  const { title, excerpt, content, category, author, slug, date } = req.body;

  if (!title || !excerpt || !content || !category || !author) {
    if (req.file) {
      deleteLocalImage(req.file.filename);
    }
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const blogSlug = slug || title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const formattedDate = date || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  try {
    const slugExists = await Blog.findOne({ slug: blogSlug });
    if (slugExists) {
      if (req.file) deleteLocalImage(req.file.filename);
      return res.status(400).json({ message: 'A blog post with this slug or title already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
      title,
      slug: blogSlug,
      excerpt,
      content,
      category,
      author,
      image: imageUrl,
      date: formattedDate
    });

    return res.status(201).json(blog);
  } catch (error) {
    if (req.file) deleteLocalImage(req.file.filename);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      if (req.file) deleteLocalImage(req.file.filename);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const { title, excerpt, content, category, author, slug, date } = req.body;

    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.author = author || blog.author;
    blog.date = date || blog.date;

    if (slug) {
      const slugExists = await Blog.findOne({ slug, _id: { $ne: blog._id } });
      if (slugExists) {
        if (req.file) deleteLocalImage(req.file.filename);
        return res.status(400).json({ message: 'Another blog with this slug already exists' });
      }
      blog.slug = slug;
    }

    if (req.file) {
      if (blog.image) {
        deleteLocalImage(blog.image);
      }
      blog.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    return res.json(updatedBlog);
  } catch (error) {
    if (req.file) deleteLocalImage(req.file.filename);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (blog.image) {
        deleteLocalImage(blog.image);
      }
      await blog.deleteOne();
      return res.json({ message: 'Blog post removed successfully' });
    } else {
      return res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
