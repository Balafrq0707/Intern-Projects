const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

pool.getConnection()
    .then(() => console.log('MySQL connected successfully!'))
    .catch((err) => console.error('Error connecting to DB:', err));

module.exports = pool;
