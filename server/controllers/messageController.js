const Message = require('../models/Message');

// @desc    Get messages between two users
// @route   GET /api/messages/:receiverId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.receiverId },
                { sender: req.params.receiverId, recipient: req.user.id }
            ]
        }).sort('createdAt');

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    const { recipient, content } = req.body;
    try {
        const newMessage = new Message({
            sender: req.user.id,
            recipient,
            content
        });

        const message = await newMessage.save();
        res.status(201).json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
