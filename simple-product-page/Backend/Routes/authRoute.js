require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const pool = require('../db/connectDB')
const path = require('path');

const router = express.Router();

router.get('/users', async(req,res)=>{
    try{
        const [users] = await pool.query('SELECT id, userName, email from users'); 
        res.json(users); 
    }
     catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/register', async(req,res)=>{
    const {userName, email, password} = req.body; 

    try{
        const [existingUser] = await pool.query ('select * from users where email = ?', [email])
        if(existingUser.length > 0){
             return res.status(409).json({ message: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10); 
        await pool.query('Insert into users (userName, email, password) values (?, ?, ?)', [userName, email, hashPassword]); 
        
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1d',});
        res.status(201).json({ message: 'User registered successfully', token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}); 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign({ email, userName: user.userName }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1d',});

        res.status(200).json({message: 'Login successful', token,
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
