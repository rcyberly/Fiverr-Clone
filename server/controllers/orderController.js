// server/controllers/orderController.js

const Order = require('../models/Order');
const Gig = require('../models/Gig');
const User = require('../models/User');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (only for clients)
const createOrder = async (req, res) => {
  const { gigId, quantity, messageToFreelancer } = req.body;
  const clientId = req.user._id; // Get client ID from the token

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const newOrder = new Order({
      gig: gig._id,
      client: clientId,
      freelancer: gig.freelancer,
      quantity,
      price: gig.price * quantity,
      messageToFreelancer,
      status: 'Pending',
    });

    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for a specific user (client or freelancer)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.isFreelancer; // Assuming you have this field in your user model

  try {
    let orders;
    if (userRole) {
      // Get orders where the user is the freelancer
      orders = await Order.find({ freelancer: userId })
        .populate('client', 'name')
        .populate('gig', 'title');
    } else {
      // Get orders where the user is the client
      orders = await Order.find({ client: userId })
        .populate('freelancer', 'name')
        .populate('gig', 'title');
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (e.g., from 'Pending' to 'In Progress' or 'Completed')
// @route   PUT /api/orders/:id
// @access  Private (only for the freelancer)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const userId = req.user._id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the authenticated user is the freelancer for this order
    if (order.freelancer.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this order' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};

// server/controllers/orderController.js
// ... (existing code for createOrder and getOrders)

// @desc    Accept an order
// @route   PUT /api/orders/:id/accept
// @access  Private (Freelancer only)
const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.freelancer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    order.status = 'Accepted';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//_________________________________________________________________________________________________________________

// added new code  

// @desc    Mark an order as completed
// @route   PUT /api/orders/:id/complete
// @access  Private (Freelancer only)
const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.freelancer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    order.status = 'Completed';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // ... existing functions
  acceptOrder,
  completeOrder,
};