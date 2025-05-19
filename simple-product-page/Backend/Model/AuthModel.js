  const { DataTypes } = require('sequelize');
  const sequelize = require('../db/connectDB'); 

  const user = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
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
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users', 
    timestamps: false,   
  });

  module.exports = user;
