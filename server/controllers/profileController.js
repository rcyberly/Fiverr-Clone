// server/controllers/profileController.js

const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Create or update a user profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  const { bio, skills, portfolio } = req.body;
  const profileFields = {};
  profileFields.user = req.user._id;
  if (bio) profileFields.bio = bio;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }
  if (portfolio) {
    profileFields.portfolio = portfolio.split(',').map(item => item.trim());
  }

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update the profile if it exists
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create a new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'email']);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:id
// @access  Public
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'email']);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfile,
  getProfileByUserId,
};