import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  sourcePage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Follow-up', 'Closed'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
