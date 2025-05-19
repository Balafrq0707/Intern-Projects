const {DataTypes} = require('sequelize');
const sequelize = require('../db/connectDB')

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'orders', 
      key: 'id',       
    }
  },
  product_id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'products',
      key: 'id',
    }
  }, 
  quantity: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }, 
  price_per_unit: {
    type: DataTypes.DECIMAL, 
    allowNull: false
  }, 
  total_price: {
    type: DataTypes.DECIMAL, 
    allowNull: false
  }
}, {
  tableName: 'order_items', 
  timestamps: false,
});

module.exports = OrderItem;
