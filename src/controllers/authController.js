import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { getUploadPath } from '../utils/paths.js';

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id, user.username)
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin profile (displayName, bio, profilePic)
// @route   GET /api/auth/profile
// @access  Public
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ username: 'admin' }).select('-password');
    if (admin) {
      return res.json({
        displayName: admin.displayName,
        bio: admin.bio,
        profilePic: admin.profilePic
      });
    } else {
      return res.status(404).json({ message: 'Admin user not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update Admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      if (req.file) {
        try {
          fs.unlinkSync(getUploadPath(req.file.filename));
        } catch (e) {}
      }
      return res.status(404).json({ message: 'User not found' });
    }

    const { displayName, bio, password } = req.body;

    if (displayName) user.displayName = displayName;
    if (bio) user.bio = bio;

    if (password) {
      user.password = password;
    }

    if (req.file) {
      if (user.profilePic) {
        try {
          const filename = path.basename(user.profilePic);
          const localFilePath = getUploadPath(filename);
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log(`Deleted old profile pic: ${localFilePath}`);
          }
        } catch (error) {
          console.error(`Failed to delete profile pic file: ${error.message}`);
        }
      }
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(getUploadPath(req.file.filename));
      } catch (e) {}
    }
    return res.status(500).json({ message: error.message });
  }
};

// Seed function to create the default administrator if table is empty
export const seedAdminUser = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'ssadmin2026';
      await User.create({
        username: 'admin',
        password: defaultPassword,
        displayName: 'SS Education',
        bio: 'Dedicated contributor at SS Education, bringing years of experience in career guidance, entrance exams, and academic admissions services.'
      });
      console.log('--------------------------------------------------');
      console.log('Database seeded with default Admin user:');
      console.log('Username: admin');
      console.log(`Password: ${defaultPassword}`);
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};
