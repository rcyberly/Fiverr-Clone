const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/gigs
// @desc    Create a new gig
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, price, skills } = req.body;
    try {
        const newGig = new Gig({
            user: req.user.id,
            title,
            description,
            price,
            skills: skills.split(',').map(skill => skill.trim()),
            username: req.user.username
        });
        const gig = await newGig.save();
        res.status(201).json(gig);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/gigs
// @desc    Get all gigs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const gigs = await Gig.find().sort({ date: -1 });
        res.json(gigs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/gigs/my-gigs
// @desc    Get gigs for the authenticated user
// @access  Private
router.get('/my-gigs', protect, async (req, res) => {
    try {
        const gigs = await Gig.find({ user: req.user.id }).sort({ date: -1 });
        res.json(gigs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/gigs/:id
// @desc    Get a single gig by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ msg: 'Gig not found' });
        }
        res.json(gig);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Gig not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/gigs/:id
// @desc    Update a gig
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { title, description, price, skills } = req.body;
    try {
        let gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ msg: 'Gig not found' });
        }

        // Check if the user owns the gig
        if (gig.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedFields = {
            title,
            description,
            price,
            skills: skills.split(',').map(skill => skill.trim())
        };

        gig = await Gig.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        res.json(gig);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/gigs/:id
// @desc    Delete a gig
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ msg: 'Gig not found' });
        }

        // Check if the user owns the gig
        if (gig.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Gig.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Gig removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Gig not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;


