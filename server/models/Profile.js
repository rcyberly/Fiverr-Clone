// server/models/Profile.js

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // An array of strings for skills
    required: true,
  },
  portfolio: {
    type: [String], // An array of URLs to portfolio work
  },
  // You can add more fields like social media links, reviews, etc.
});

module.exports = mongoose.model('Profile', ProfileSchema);