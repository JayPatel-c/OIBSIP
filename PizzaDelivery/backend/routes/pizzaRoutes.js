const express = require('express');
const {
  getPizzas,
  getPizzaIngredients,
  createPizza,
  updatePizza,
  deletePizza,
} = require('../controllers/pizzaController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', getPizzas);
router.get('/ingredients', getPizzaIngredients);

// Admin only routes for managing pizza varieties
router.post('/', protect, authorizeAdmin, createPizza);
router.put('/:id', protect, authorizeAdmin, updatePizza);
router.delete('/:id', protect, authorizeAdmin, deletePizza);

module.exports = router;
