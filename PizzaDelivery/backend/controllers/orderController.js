const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Pizza = require('../models/Pizza');
const { checkAndAlertStock } = require('../utils/stockAlert');

// Helper to deduct stock for ingredients
const deductInventoryStock = async (items) => {
  for (const item of items) {
    if (item.isCustom) {
      const details = item.customDetails;
      // Deduct base
      if (details.base) {
        await Inventory.findByIdAndUpdate(details.base, {
          $inc: { quantity: -item.quantity },
        });
      }
      // Deduct sauce
      if (details.sauce) {
        await Inventory.findByIdAndUpdate(details.sauce, {
          $inc: { quantity: -item.quantity },
        });
      }
      // Deduct cheese
      if (details.cheese) {
        await Inventory.findByIdAndUpdate(details.cheese, {
          $inc: { quantity: -item.quantity },
        });
      }
      // Deduct toppings/veggies
      if (details.veggies && details.veggies.length > 0) {
        for (const veggieId of details.veggies) {
          await Inventory.findByIdAndUpdate(veggieId, {
            $inc: { quantity: -item.quantity },
          });
        }
      }
    } else {
      // For standard pizzas, deduct standard amounts
      // 1 thin crust base, 1 marinara sauce, 1 mozzarella cheese, 1 veggie
      const defaultBase = await Inventory.findOne({ category: 'base' });
      const defaultSauce = await Inventory.findOne({ category: 'sauce' });
      const defaultCheese = await Inventory.findOne({ category: 'cheese' });
      const defaultVeggie = await Inventory.findOne({ category: 'veggies' });

      if (defaultBase) {
        await Inventory.findByIdAndUpdate(defaultBase._id, {
          $inc: { quantity: -item.quantity },
        });
      }
      if (defaultSauce) {
        await Inventory.findByIdAndUpdate(defaultSauce._id, {
          $inc: { quantity: -item.quantity },
        });
      }
      if (defaultCheese) {
        await Inventory.findByIdAndUpdate(defaultCheese._id, {
          $inc: { quantity: -item.quantity },
        });
      }
      if (defaultVeggie) {
        await Inventory.findByIdAndUpdate(defaultVeggie._id, {
          $inc: { quantity: -item.quantity },
        });
      }
    }
  }

  // Check and send alert email if any item drops below threshold
  await checkAndAlertStock();
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { items, totalAmount, paymentDetails, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      paymentStatus: 'Paid', // Assuming Razorpay is verified before calling this
      paymentDetails,
      shippingAddress,
      status: 'Order Received',
    });

    await order.save();

    // Deduct stock from Inventory
    await deductInventoryStock(items);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza')
      .populate('items.customDetails.base')
      .populate('items.customDetails.sauce')
      .populate('items.customDetails.cheese')
      .populate('items.customDetails.veggies')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.pizza')
      .populate('items.customDetails.base')
      .populate('items.customDetails.sauce')
      .populate('items.customDetails.cheese')
      .populate('items.customDetails.veggies')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Please provide status' });
  }

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
