const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Veg', 'Non-Veg'],
      default: 'Veg',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', PizzaSchema);
