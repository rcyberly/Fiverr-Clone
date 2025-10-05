// server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Public route for creating an order
router.route('/').post(protect, createOrder);

// Protected route to get all orders for a user
router.route('/').get(protect, getOrders);

// Protected route to update an order's status
router.route('/:id').put(protect, updateOrderStatus);

module.exports = router;


//___________________________________________________________________________________________________


// server/routes/orderRoutes.js
// ... (existing code)
const {
  // ... existing functions
  acceptOrder,
  completeOrder,
} = require('../controllers/orderController');

// ... existing routes
router.route('/:id/accept').put(protect, acceptOrder);
router.route('/:id/complete').put(protect, completeOrder);

module.exports = router;