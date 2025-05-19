const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../db/connectDB')


const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT id, title, description, price, quantity FROM products');
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
