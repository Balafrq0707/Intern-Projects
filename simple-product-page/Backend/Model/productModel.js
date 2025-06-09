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
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, 
  },
  inventory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  numRatings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'products',
  timestamps: false,
});

module.exports = Product;
