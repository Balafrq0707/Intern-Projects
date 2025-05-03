require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../lib/users.json');
const sessionPath = path.join(__dirname, '../lib/session.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const router = express.Router();

router.get('/users', async (req, res) => {
    res.json(db); 
});



router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const userExists = db.some(user => user.email === email);
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        db.push({ userName, email, password: hashPassword });

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
          });

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { userName, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const validUser = db.find(user => user.email === email);
        if (!validUser) {
            return res.status(400).json({ message: "Not a valid email, try again" });
        }

        const isMatch = await bcrypt.compare(password, validUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ email, userName: validUser.userName }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        });

        
        fs.writeFileSync(sessionPath, JSON.stringify({ userName: validUser.userName }), 'utf-8');

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userName: validUser.userName,
                email: validUser.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;



