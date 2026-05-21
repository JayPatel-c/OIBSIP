const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/checkout', createPaymentOrder);
router.post('/verify', verifyPayment);

module.exports = router;
