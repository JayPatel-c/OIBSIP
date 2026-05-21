const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        isCustom: {
          type: Boolean,
          default: false,
        },
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
        },
        customDetails: {
          base: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
          },
          sauce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
          },
          cheese: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
          },
          veggies: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Inventory',
            },
          ],
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
      default: 'Order Received',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
