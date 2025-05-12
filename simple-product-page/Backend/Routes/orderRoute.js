const express = require('express');
const pool = require('../db/connectDB');

const router = express.Router();

router.get('/orders', async(req, res)=>{
  try{
    const [orders] = await pool.query('select id, user_id from orders'); 
    res.json(orders); 
  }
  catch(error){
            res.status(500).json({ message: err.message });
  }
})

router.post('/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { userName, email, orderItems } = req.body;

    if (!userName || !email || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    await connection.beginTransaction();

    // Step 1: Find or create the user
    const [userRows] = await connection.query(
      `SELECT id FROM users WHERE userName = ? AND email = ?`,
   [userName, email]
    );

    let user_id;
    if (userRows.length > 0) {
      user_id = userRows[0].id;
    } else {
      const [insertUser] = await connection.query(
        'INSERT INTO users (user_name, email) VALUES (?, ?)',
        [userName, email]
      );
      user_id = insertUser.insertId;
    }

    // Step 2: Create the order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id) VALUES (?)',
      [user_id]
    );
    const order_id = orderResult.insertId;

    // Step 3: Insert order items
    for (const item of orderItems) {
      const { id: product_id, qty: quantity, price } = item;
      const total_price = quantity * price;

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [order_id, product_id, quantity, price, total_price]
      );
    }

    await connection.commit();

    res.status(201).json({ message: 'Order placed successfully', order_id });

  } catch (err) {
    await connection.rollback();
    console.error('Order creation failed:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  } finally {
    connection.release();
  }
});

router.get('/orders/user/:userId/details', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orderDetails] = await pool.query(
      `SELECT 
        o.id AS order_id,
        o.user_id,
        oi.product_id,
        p.title AS product_title,
        p.description,
        oi.quantity,
        oi.price_per_unit,
        oi.total_price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?`,
      [userId]
    );

    res.json(orderDetails);
  } catch (err) {
    console.error('Error fetching detailed orders:', err);
    res.status(500).json({ message: 'Failed to retrieve detailed order info.' });
  }
});



module.exports = router; 
