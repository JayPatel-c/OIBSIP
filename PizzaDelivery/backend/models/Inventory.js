const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['base', 'sauce', 'cheese', 'veggies'],
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [0, 'Quantity cannot be less than 0'],
      default: 100,
    },
    unit: {
      type: String,
      default: 'units',
    },
    threshold: {
      type: Number,
      default: 20,
    },
    price: {
      type: Number,
      default: 0, // additional price for this ingredient in custom builder
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', InventorySchema);
