const express = require('express');
const router = express.Router();
const User = require('../Model/AuthModel');
const Order = require('../Model/orderModel');
const OrderItem = require('../Model/orderItemsModel');
const Product = require('../Model/productModel'); 

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

router.get('/allOrders', async(req, res)=>{
    try{
        const userProfile = await User.findAll({
        attributes: ['id', 'userName', 'email', 'Location'],
        include: [
            {
            model: Order,
            attributes: ['id','createdAt'],
            include: [
                {
                model: OrderItem,
                attributes: ['quantity', 'total_price'],
                include: [
                    {
                    model: Product,
                    attributes: ['title']
                    }
                ]
                }
            ]
            }
        ]
        });
        if (!userProfile) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json(userProfile);

        }
        catch(error){
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
});

module.exports = router; 