const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;

// Initialize Razorpay only if valid keys are provided
const isPlaceholderKey = (key) => !key || key.startsWith('rzp_test_placeholder');

if (!isPlaceholderKey(process.env.RAZORPAY_KEY_ID) && !isPlaceholderKey(process.env.RAZORPAY_KEY_SECRET)) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Razorpay instance:', error.message);
  }
} else {
  console.log('⚠️ Razorpay keys are placeholder values. Using simulated/mock payment flow.');
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/checkout
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  const { amount } = req.body; // Amount is in INR

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Please provide amount' });
  }

  // Razorpay accepts amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amount * 100);

  try {
    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };

      const order = await razorpayInstance.orders.create(options);
      
      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        isMock: false,
      });
    } else {
      // Mock payment flow
      const mockOrderId = `mock_order_${Math.random().toString(36).substring(2, 15)}`;
      return res.status(200).json({
        success: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: 'rzp_test_mockKey123',
        isMock: true,
        message: 'Using simulation mode since no valid Razorpay keys were provided in .env',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, isMock } = req.body;

  if (isMock || !razorpayInstance) {
    // Automatically verify mock payments
    console.log('💸 Mock payment verified successfully.');
    return res.status(200).json({
      success: true,
      message: 'Mock payment verified successfully!',
    });
  }

  try {
    // Generate signature to match
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (isSignatureValid) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully!',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
