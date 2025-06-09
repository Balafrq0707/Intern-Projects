const express = require('express');
const router = express.Router();
const User = require('../Model/AuthModel');
const Order = require('../Model/orderModel');
const OrderItem = require('../Model/orderItemsModel');
const Product = require('../Model/productModel');
const authenticateToken = require('../Middleware/authMiddleware')
const authorizeUser = require('../Middleware/UserMiddleware')
const upload = require('../Middleware/profileMiddleware');
const cloudinary = require('../cloudConfig');
const fs = require('fs'); 

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

router.get('/:userId', authenticateToken, authorizeUser,  async (req, res) => {
  const { userId } = req.params;
  console.log("Authenticated user:", req.user);
  
  try {
    const userProfile = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'userName', 'email', 'Location', 'profile_img'],
      include: [
        {
          model: Order,
          attributes: ['id'],
          include: [
            {
              model: OrderItem,
              attributes: ['quantity', 'total_price'],
              include: [
                {
                  model: Product,
                  attributes: ['title']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userProfile.toJSON());

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.id; 
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'profile-images'
    });

    fs.unlinkSync(filePath);

   await User.update(
      { profile_img: result.secure_url },
      { where: { id: userId } }
    );

    res.status(200).json({
      message: 'Image uploaded and profile updated successfully',
      imageUrl: result.secure_url
    });

  } catch (err) {
    res.status(500).json({ error: 'Image upload failed', details: err.message });
  }
});

module.exports = router;