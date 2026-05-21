const Inventory = require('../models/Inventory');
const sendEmail = require('./email');

const checkAndAlertStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$quantity', '$threshold'] },
    });

    if (lowStockItems.length > 0) {
      console.log(`⚠️ ALERT: ${lowStockItems.length} inventory items are below their warning threshold!`);

      const adminEmail = process.env.ADMIN_EMAIL || 'pizza-admin@pizzadeliveryshop.com';
      const subject = '⚠️ URGENT: Pizza Store Low Stock Alert!';
      
      let itemDetailsText = 'The following items are running low:\n\n';
      let itemDetailsHtml = '<h3>The following items are running low:</h3><ul>';

      lowStockItems.forEach((item) => {
        const detail = `- ${item.name} (${item.category}): Current Stock is ${item.quantity} ${item.unit} (Threshold is ${item.threshold})\n`;
        itemDetailsText += detail;
        itemDetailsHtml += `<li><strong>${item.name}</strong> (${item.category}): Current Stock is <span style="color:red; font-weight:bold;">${item.quantity}</span> ${item.unit} (Threshold: ${item.threshold})</li>`;
      });

      itemDetailsHtml += '</ul><br/><p>Please restock immediately from the Admin Dashboard.</p>';

      await sendEmail({
        email: adminEmail,
        subject,
        message: itemDetailsText,
        html: itemDetailsHtml,
      });
    }
  } catch (error) {
    console.error('Error checking stock levels:', error.message);
  }
};

module.exports = { checkAndAlertStock };
