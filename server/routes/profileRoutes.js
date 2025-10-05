// server/routes/profileRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrUpdateProfile,
  getProfile,
  getProfileByUserId,
} = require('../controllers/profileController');

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update a user profile
// @access  Private
router.route('/').post(protect, createOrUpdateProfile);

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.route('/me').get(protect, getProfile);

// @route   GET /api/profile/user/:id
// @desc    Get profile by user ID
// @access  Public
router.route('/user/:id').get(getProfileByUserId);

module.exports = router;