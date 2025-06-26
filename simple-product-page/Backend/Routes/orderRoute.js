const express = require('express');
const router = express.Router();
const sequelize = require('../db/connectDB')
const User = require('../Model/AuthModel');
const Order = require('../Model/orderModel');
const OrderItem = require('../Model/orderItemsModel');
const Product = require('../Model/productModel');
const { Op } = require('sequelize');
const authenticateToken = require('../Middleware/authMiddleware')


User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });


router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({ attributes: ['id', 'user_id'] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Graph Route
router.get('/orders/summary', async (req, res) => {
  try {
    const ordersByDate = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json(ordersByDate);
  } catch (err) {
    console.error('Failed to fetch orders summary:', err);
    res.status(500).json({ message: 'Failed to get orders summary', error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  const { userName, email, orderItems } = req.body;

  if (!userName || !email || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const transaction = await sequelize.transaction();

  try {
    let user = await User.findOne({ where: { username: userName, email }, transaction });

    if (!user) {
      user = await User.create({ username: userName, email }, { transaction });
    }

    const order = await Order.create({ user_id: user.id }, { transaction });

    for (const item of orderItems) {
      const { id: product_id, qty: quantity, price } = item;
      const total_price = quantity * price;

      await OrderItem.create({
        order_id: order.id,
        product_id,
        quantity,
        price_per_unit: price,
        total_price
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Order placed successfully', order_id: order.id });

  } catch (err) {
    await transaction.rollback();
    console.error('Order creation failed:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

// GET detailed order info by userId
router.get('/orders/user/:userId/details', async (req, res) => {
  const userId = req.params.userId;

  try {
    const orderDetails = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['title', 'description']
            }
          ]
        }
      ]
    });

    const response = orderDetails.flatMap(order =>
      order.OrderItems.map(item => ({
        order_id: order.id,
        user_id: order.user_id,
        product_id: item.product_id,
        product_title: item.Product.title,
        description: item.Product.description,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.total_price
      }))
    );

    res.json(response);
  } catch (err) {
    console.error('Error fetching detailed orders:', err);
    res.status(500).json({ message: 'Failed to retrieve detailed order info.' });
  }
});
  router.get('/dashboard/allOrders', async (req, res) => {
  try {
    const orders = await User.findAll({
      attributes:['id','userName','email', 'Location'],
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              attributes: ['quantity', 'total_price', 'product_id'],
              include: [
                {
                  model: Product,
                  attributes: ['id', 'title']
                }
              ]
            }
          ]
        }
      ]
    });

    const plainOrders = orders.map(user => user.toJSON());
    console.log(plainOrders[0].Orders[0].OrderItems[0].Product.id); 
    res.json(plainOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete('/orders/:id/:productId', async (req, res) => {
  const { id: orderId, productId } = req.params;
  const t = await sequelize.transaction();

  try {
    // First, delete the OrderItem
    const deleteOrderItem = await OrderItem.destroy({
      where: {
        order_id: orderId,
        product_id: productId,
      },
      transaction: t,
    });

    // Then, delete the Order if it no longer has items
    const remainingItems = await OrderItem.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

    let deleteOrder = 0;

    if (remainingItems.length === 0) {
      deleteOrder = await Order.destroy({
        where: { id: orderId },
        transaction: t,
      });
    }

    await t.commit();

    if (deleteOrderItem) {
      return res.status(200).json({
        message: `Order item deleted${deleteOrder ? ' and order removed' : ''}.`,
      });
    } else {
      return res.status(404).json({ message: 'Order item not found.' });
    }
  } catch (err) {
    await t.rollback();
    console.error(`Error deleting order ${orderId}:`, err);
    return res.status(500).json({ message: 'Failed to delete order.' });
  }
});


module.exports = router;