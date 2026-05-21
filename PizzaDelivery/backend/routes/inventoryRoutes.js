const express = require('express');
const {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// All routes require protection and Admin authorization
router.use(protect);
router.use(authorizeAdmin);

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

router.route('/:id')
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;
