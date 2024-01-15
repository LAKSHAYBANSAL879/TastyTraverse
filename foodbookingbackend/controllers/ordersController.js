const Orders=require('../models/ordersModel');
exports.newOrder= async (req, res) => {
    try {
      const { totalCost, totalItems, items, customerName } = req.body;
        const orderData = {
        totalCost,
        totalItems,
        items,
        customerName,
      
            };
        const newOrder = new Orders(orderData);
      await newOrder.save();
      res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  exports.getAllOrders= async (req, res) => {
    try {
        const allOrders = await Orders.find();

        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            data: allOrders,
        });
    } catch (error) {
        console.error('Error fetching all orders:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching all orders',
            error: error.message,
        });
    }
};
