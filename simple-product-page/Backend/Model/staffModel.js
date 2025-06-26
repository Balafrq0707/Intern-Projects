  const { DataTypes } = require('sequelize');
  const sequelize = require('../db/connectDB'); 

  const staff = sequelize.define('Staff', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    staffname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'Staff'
    }
  }, {
    tableName: 'staff', 
    timestamps: false,   
  });

  module.exports = staff;
