const { DataTypes } = require('sequelize');
const sequelize = require('../db/connectDB'); 

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    user_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'orders',
    timestamps: true,
}
)

module.exports = Order; 