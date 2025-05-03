const express = require('express');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../lib/products.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const router = express.Router();

router.get('/products', async (req, res) => {
    res.json(db); 
});

module.exports = router;
