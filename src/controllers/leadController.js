import Lead from '../models/Lead.js';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res) => {
  const { name, phone, email, state, branch, college, sourcePage, notes } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and Phone number are required' });
  }

  try {
    const lead = await Lead.create({
      name,
      phone,
      email,
      state,
      branch,
      college,
      sourcePage,
      notes
    });
    return res.status(201).json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead details (status, notes, etc.)
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const { status, notes } = req.body;

    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    const updatedLead = await lead.save();
    return res.json(updatedLead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      return res.json({ message: 'Lead removed successfully' });
    } else {
      return res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Import bulk leads
// @route   POST /api/leads/import
// @access  Private
export const importLeads = async (req, res) => {
  const { leads } = req.body;

  if (!leads || !Array.isArray(leads)) {
    return res.status(400).json({ message: 'Invalid payload: expected an array of leads' });
  }

  try {
    let importedCount = 0;
    let skippedCount = 0;

    for (const item of leads) {
      const { name, phone, email, state, branch, college, sourcePage, notes, status } = item;

      if (!name || !phone) {
        skippedCount++;
        continue;
      }

      // Check if lead already exists with the same phone
      const exists = await Lead.findOne({ phone: phone.toString().trim() });
      if (exists) {
        skippedCount++;
        continue;
      }

      await Lead.create({
        name: name.toString().trim(),
        phone: phone.toString().trim(),
        email: email ? email.toString().trim() : '',
        state: state ? state.toString().trim() : '',
        branch: branch ? branch.toString().trim() : '',
        college: college ? college.toString().trim() : '',
        sourcePage: sourcePage ? sourcePage.toString().trim() : '',
        notes: notes ? notes.toString().trim() : '',
        status: status || 'New'
      });
      importedCount++;
    }

    return res.status(200).json({
      message: `Import complete. Imported: ${importedCount}, Skipped/Duplicates: ${skippedCount}`,
      importedCount,
      skippedCount
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
