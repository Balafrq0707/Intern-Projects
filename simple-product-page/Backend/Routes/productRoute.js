  const express = require('express');
  const router = express.Router();
  const Product = require('../Model/productModel');
  const sequelize = require('../db/connectDB'); 
  const Rating = require('../Model/ratingModel');
 

  Product.hasMany(Rating, { foreignKey: 'productId' });
  Rating.belongsTo(Product, { foreignKey: 'productId' });

  // GET all products
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll({
        attributes: ['id', 'title', 'description', 'price', 'image', 'inventory', 'rating', 'numRatings']
      });


      const updatedProducts = products.map(product => {
        console.log('Raw product image value:', product.image);

        return {
          ...product.toJSON(),
         image: product.image || null

        };
      });

      res.status(200).json(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  router.post('/products/:id/decrement-inventory', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a valid positive number.' });
    }

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      if (product.inventory < quantity) {
        return res.status(400).json({ message: 'Insufficient inventory.' });
      }

      product.inventory -= quantity;
      await product.save();

      res.status(200).json({ message: 'Inventory updated successfully.' });
    } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

 router.post('/products/:id/rate', async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, userId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentTotalRating = product.rating * product.numRatings; 
    const newNumRatings = product.numRatings + 1;
    const newAverageRating = (currentTotalRating + rating) / newNumRatings;

    product.rating = parseFloat(newAverageRating.toFixed(1)); 
    product.numRatings = newNumRatings;

    await product.save();

    const plainProduct = product.toJSON();
    plainProduct.image = plainProduct.image
      ? `http://localhost:3001/images/${encodeURIComponent(plainProduct.image)}`
      : null;

    res.json(plainProduct);

  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.findAll({
      where: { category },
      attributes: ['id', 'title', 'description', 'price', 'image', 'inventory', 'rating', 'numRatings', 'category']
    });

    const updatedProducts = products.map(product => ({
      ...product.toJSON(),
      image: product.image || null
    }));

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products for this category' });
  }
});

router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});


module.exports = router;
