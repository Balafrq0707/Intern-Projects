const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const Staff = require('../Model/staffModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { staffname, email, password, role } = req.body;

  try {
    const existingStaff = await Staff.findOne({ where: { email } });

    if (existingStaff) {
      return res.status(409).json({ message: 'Staff already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await Staff.create({
      staffname,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign(
      { id: newStaff.id, email: newStaff.email, staffname: newStaff.staffname, role: newStaff.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      staff: {
        id: newStaff.id,
        staffname: newStaff.staffname,
        email: newStaff.email,
        role: newStaff.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:staffName', async(req,res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    }

    try{ 
      const staff = await Staff.findOne({ where: { email } });

    if (!staff) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ email, staffname: staff.staffname, id: staff.id,  role: staff.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
     res.status(200).json({
      message: 'Login successful',
      token,
      staff: {
        id: staff.id,
        staffname: staff.staffname,
        email: staff.email,
        role: staff.role
      }
    });
    }
    catch(error){
        res.status(500).json({ message: error.message });

    }
}); 

module.exports = router;
