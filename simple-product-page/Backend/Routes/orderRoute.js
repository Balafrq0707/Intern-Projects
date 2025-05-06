const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router(); 

router.post('/orders', (req, res) => {
    const orderData = req.body;
  
    
    const ordersPath = path.join(__dirname, 'order.json');
    fs.readFile(ordersPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading orders file' });
      }
      const orders = JSON.parse(data);
      orders.orders.push(orderData);
  
      fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ message: 'Error saving orders file' });
        }
        res.status(200).json({ message: 'Order placed successfully!' });
      });
    });
  });

  module.exports = router;
