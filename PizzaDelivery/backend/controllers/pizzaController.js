const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

// @desc    Get all standard pizza varieties
// @route   GET /api/pizzas
// @access  Public
exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.status(200).json({ success: true, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all ingredients (bases, sauces, cheese, veggies) for builder
// @route   GET /api/pizzas/ingredients
// @access  Public
exports.getPizzaIngredients = async (req, res) => {
  try {
    const ingredients = await Inventory.find({ isAvailable: true });

    // Group ingredients by category
    const grouped = {
      bases: ingredients.filter((i) => i.category === 'base'),
      sauces: ingredients.filter((i) => i.category === 'sauce'),
      cheese: ingredients.filter((i) => i.category === 'cheese'),
      veggies: ingredients.filter((i) => i.category === 'veggies'),
    };

    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new pizza variety (Admin only)
// @route   POST /api/pizzas
// @access  Private/Admin
exports.createPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pizza variety (Admin only)
// @route   PUT /api/pizzas/:id
// @access  Private/Admin
exports.updatePizza = async (req, res) => {
  try {
    let pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete pizza variety (Admin only)
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin
exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    await pizza.deleteOne();
    res.status(200).json({ success: true, message: 'Pizza deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
