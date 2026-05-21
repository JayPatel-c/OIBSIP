const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);

// Admin only order management routes
router.get('/', authorizeAdmin, getAllOrders);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

module.exports = router;
