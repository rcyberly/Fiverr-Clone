// server/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
// Corrected line: Import the protect function directly, not by destructuring
const protect = require('../middleware/authMiddleware');

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.route('/').post(protect, sendMessage);

// @route   GET /api/messages/:receiverId
// @desc    Get messages between the authenticated user and another user
// @access  Private
router.route('/:receiverId').get(protect, getMessages);

module.exports = router;