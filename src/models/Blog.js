import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  views: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
