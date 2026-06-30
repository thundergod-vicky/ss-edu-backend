import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  package: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  testimonial: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Story = mongoose.model('Story', storySchema);
export default Story;
