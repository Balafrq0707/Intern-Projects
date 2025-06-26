const mysql = require('mysql2/promise'); 
const sequelize = require('sequelize');

const host =  process.env.DB_HOST;
const user =  process.env.DB_USER;
const password =  process.env.DB_PASS; 
const database =  process.env.DB_NAME; 
const port = process.env.DB_PORT;
const dialect = process.env.DB_DIALECT;

const connectDB = new sequelize(database, user, password, {
    host: host, 
    port: port, 
    dialect: dialect
} )

connectDB.authenticate().then(()=>{
    console.log('Connection successful')
}).catch((error)=>{
    console.error(error)
})

module.exports = connectDB;
