import express from 'express';
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  importLeads
} from '../controllers/leadController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Public submission path
router.post('/', createLead);

// Protected admin paths
router.get('/', protect, getLeads);
router.post('/import', protect, importLeads);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

export default router;
