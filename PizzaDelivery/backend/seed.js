const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Pizza = require('./models/Pizza');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

dotenv.config();

const users = [
  {
    name: 'Shop Owner (Admin)',
    email: 'admin@pizzashop.com',
    password: 'adminpassword123',
    phone: '9876543210',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'John Doe (User)',
    email: 'user@pizzashop.com',
    password: 'userpassword123',
    phone: '9123456780',
    role: 'user',
    isVerified: true,
  },
];

const pizzas = [
  {
    name: 'Margherita Classic',
    description: 'Classic delight with 100% real Mozzarella cheese & fresh basil on home-style marinara sauce.',
    price: 199,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Garden Fresh Veggie Paradise',
    description: 'A colorful overload of gold corn, black olives, crisp onions, capsicum, and juicy red tomatoes.',
    price: 299,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Paneer Tikka Supreme',
    description: 'Delectable chunks of marinated paneer tikka, red paprika, sliced onions, and capsicum with spicy mint drizzle.',
    price: 349,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Ultimate Chicken Pepperoni',
    description: 'Double portion of savory chicken pepperoni topped with loaded Mozzarella cheese and spicy oregano sprinkle.',
    price: 449,
    category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'BBQ Chicken Delight',
    description: 'Chunks of sweet-tangy BBQ chicken, caramelized red onions, roasted garlic, and smoky BBQ drizzle.',
    price: 399,
    category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
  },
];

const inventoryItems = [
  // 5 Pizza Bases
  { category: 'base', name: 'Classic Thin Crust', quantity: 50, threshold: 20, price: 0, unit: 'crusts' },
  { category: 'base', name: 'Hand Tossed Thick Crust', quantity: 45, threshold: 20, price: 20, unit: 'crusts' },
  { category: 'base', name: 'Ultimate Cheese Burst', quantity: 30, threshold: 20, price: 60, unit: 'crusts' },
  { category: 'base', name: 'Organic Whole Wheat', quantity: 25, threshold: 15, price: 40, unit: 'crusts' },
  { category: 'base', name: 'Gluten-Free Artisan Base', quantity: 15, threshold: 10, price: 70, unit: 'crusts' },

  // 5 Pizza Sauces
  { category: 'sauce', name: 'Zesty Italian Marinara', quantity: 60, threshold: 20, price: 0, unit: 'servings' },
  { category: 'sauce', name: 'Smoky Honey BBQ', quantity: 40, threshold: 20, price: 15, unit: 'servings' },
  { category: 'sauce', name: 'Rich Creamy Alfredo', quantity: 35, threshold: 15, price: 25, unit: 'servings' },
  { category: 'sauce', name: 'Herb Basil Pesto', quantity: 25, threshold: 15, price: 30, unit: 'servings' },
  { category: 'sauce', name: 'Spicy Buffalo Drizzle', quantity: 45, threshold: 20, price: 10, unit: 'servings' },

  // 5 Cheese Types
  { category: 'cheese', name: 'Gooey Mozzarella', quantity: 50, threshold: 20, price: 0, unit: 'grams' },
  { category: 'cheese', name: 'Sharp Golden Cheddar', quantity: 40, threshold: 20, price: 30, unit: 'grams' },
  { category: 'cheese', name: 'Shaved Herb Parmesan', quantity: 30, threshold: 15, price: 40, unit: 'grams' },
  { category: 'cheese', name: 'Dairy-Free Vegan Cheese', quantity: 20, threshold: 10, price: 50, unit: 'grams' },
  { category: 'cheese', name: 'Lite / No Cheese', quantity: 100, threshold: 0, price: 0, unit: 'portions' },

  // Veggies & Meats (Toppings)
  { category: 'veggies', name: 'Fresh Button Mushrooms', quantity: 40, threshold: 20, price: 25, unit: 'servings' },
  { category: 'veggies', name: 'Salty Black Olives', quantity: 35, threshold: 15, price: 25, unit: 'servings' },
  { category: 'veggies', name: 'Crispy Sweet Corn', quantity: 50, threshold: 20, price: 20, unit: 'servings' },
  { category: 'veggies', name: 'Red Jalapeño Peppers', quantity: 30, threshold: 15, price: 25, unit: 'servings' },
  { category: 'veggies', name: 'Caramelized Sweet Onions', quantity: 55, threshold: 20, price: 15, unit: 'servings' },
  { category: 'veggies', name: 'Roasted Red Bell Peppers', quantity: 40, threshold: 15, price: 20, unit: 'servings' },
  { category: 'veggies', name: 'Juicy Roma Tomatoes', quantity: 45, threshold: 20, price: 15, unit: 'servings' },
  { category: 'veggies', name: 'Fresh Baby Spinach', quantity: 20, threshold: 10, price: 20, unit: 'servings' },
  { category: 'veggies', name: 'Classic Chicken Pepperoni', quantity: 25, threshold: 15, price: 60, unit: 'servings' },
  { category: 'veggies', name: 'Grilled Herb Chicken Chunks', quantity: 30, threshold: 15, price: 50, unit: 'servings' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizza-delivery');
    console.log('Connected to Database for seeding...');

    // Clear existing collection records
    await User.deleteMany();
    await Pizza.deleteMany();
    await Inventory.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing records...');

    // Seed Users (they will be hashed by pre-save middleware)
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
    }
    console.log('Seeded User accounts successfully.');

    // Seed Pizzas
    await Pizza.insertMany(pizzas);
    console.log('Seeded Pizza varieties successfully.');

    // Seed Inventory items
    await Inventory.insertMany(inventoryItems);
    console.log('Seeded Inventory stock ingredients successfully.');

    console.log('✅ Seeding completed! Database is fully populated.');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
