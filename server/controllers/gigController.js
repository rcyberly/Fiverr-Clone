// server/controllers/gigController.js

const Gig = require('../models/Gig');
const User = require('../models/User'); 

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private (only for authenticated users)
const createGig = async (req, res) => {
  const { title, description, price, category, images } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const gig = new Gig({
      title,
      description,
      price,
      category,
      images,
      freelancer: userId,
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gigs with search and filter functionality
// @route   GET /api/gigs?keywords=...&minPrice=...&maxPrice=...
// @access  Public
const getGigs = async (req, res) => {
  try {
    const { keywords, minPrice, maxPrice } = req.query;
    let query = {};

    // Search by keywords (case-insensitive)
    if (keywords) {
      query.title = { $regex: keywords, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const gigs = await Gig.find(query).populate('freelancer', 'name');
    res.json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name');

    if (gig) {
      res.json(gig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private (only for the gig's creator)
const updateGig = async (req, res) => {
  const { title, description, price, category, images } = req.body;
  const userId = req.user._id;

  try {
    const gig = await Gig.findById(req.params.id);

    if (gig) {
      if (gig.freelancer.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      gig.title = title || gig.title;
      gig.description = description || gig.description;
      gig.price = price || gig.price;
      gig.category = category || gig.category;
      gig.images = images || gig.images;

      const updatedGig = await gig.save();
      res.json(updatedGig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private (only for the gig's creator)
const deleteGig = async (req, res) => {
  const userId = req.user._id;

  try {
    const gig = await Gig.findById(req.params.id);

    if (gig) {
      if (gig.freelancer.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      await gig.deleteOne();
      res.json({ message: 'Gig removed' });
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
};