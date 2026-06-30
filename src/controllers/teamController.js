import TeamMember from '../models/TeamMember.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({}).sort({ createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private
export const createTeamMember = async (req, res) => {
  const { name, role, bio } = req.body;

  if (!name || !role || !bio) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join('public/uploads', req.file.filename));
      } catch (e) {}
    }
    return res.status(400).json({ message: 'Please provide all required fields (name, role, bio)' });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const member = await TeamMember.create({
      name,
      role,
      bio,
      image: imagePath
    });
    res.status(201).json(member);
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join('public/uploads', req.file.filename));
      } catch (e) {}
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      if (req.file) {
        try {
          fs.unlinkSync(path.join('public/uploads', req.file.filename));
        } catch (e) {}
      }
      return res.status(404).json({ message: 'Team member not found' });
    }

    const { name, role, bio } = req.body;
    if (name) member.name = name;
    if (role) member.role = role;
    if (bio) member.bio = bio;

    if (req.file) {
      // delete old image if exists
      if (member.image) {
        try {
          const filename = path.basename(member.image);
          const localPath = path.join('public/uploads', filename);
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
            console.log(`Deleted old team image: ${localPath}`);
          }
        } catch (error) {
          console.error(`Failed to delete old team image: ${error.message}`);
        }
      }
      member.image = `/uploads/${req.file.filename}`;
    }

    const updated = await member.save();
    res.json(updated);
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join('public/uploads', req.file.filename));
      } catch (e) {}
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // delete image file from disk
    if (member.image) {
      try {
        const filename = path.basename(member.image);
        const localPath = path.join('public/uploads', filename);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log(`Deleted team image: ${localPath}`);
        }
      } catch (error) {
        console.error(`Failed to delete team image file: ${error.message}`);
      }
    }

    await member.deleteOne();
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed function
export const seedTeamMembers = async () => {
  try {
    const count = await TeamMember.countDocuments();
    if (count === 0) {
      const defaultMembers = [
        {
          name: "S.K. Basu",
          role: "Founder & Director",
          bio: "15+ years of experience in educational consultancy.",
          image: ""
        },
        {
          name: "Anita Sharma",
          role: "Chief Counselor",
          bio: "Expert in MBBS and Medical admissions.",
          image: ""
        },
        {
          name: "Rahul Verma",
          role: "Head of Operations",
          bio: "Specializes in Engineering college placements.",
          image: ""
        }
      ];
      await TeamMember.insertMany(defaultMembers);
      console.log('Seeded database with default Team Members!');
    }
  } catch (error) {
    console.error('Error seeding team members:', error.message);
  }
};
