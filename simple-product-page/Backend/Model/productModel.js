const { DataTypes } = require('sequelize');
const sequelize = require('../db/connectDB'); 

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
  }, 
  title: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  description: {
    type: DataTypes.STRING, 
    allowNull: true, 
  }, 
  quantity: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL, 
    allowNull: false,
  }
}, {
  tableName: 'products', 
  timestamps: false,      
});

module.exports = Product;
