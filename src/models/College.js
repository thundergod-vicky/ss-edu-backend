import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['btech-karnataka', 'btech-other-states', 'mbbs-admission-india', 'management-other-courses']
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const College = mongoose.model('College', collegeSchema);
export default College;
