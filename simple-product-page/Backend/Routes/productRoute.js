  const express = require('express');
  const router = express.Router();
  const Product = require('../Model/productModel');
  const sequelize = require('../db/connectDB'); 
  const Rating = require('../Model/ratingModel');
  const cloudinary = require('../cloudConfig'); 
  const upload = require('../Middleware/productMiddleware');
  const verifyToken = require('../Middleware/staffAuth'); 

  Product.hasMany(Rating, { foreignKey: 'productId' });
  Rating.belongsTo(Product, { foreignKey: 'productId' });

  // GET all products
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll({
        attributes: ['id', 'title', 'description', 'price', 'image', 'inventory', 'rating', 'numRatings']
      });


      const updatedProducts = products.map(product => {
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

// Dashboard Routes

// Adding new products from dashboard
  router.post('/products', verifyToken, upload.single('image'), async (req, res) => {


  try {
    const { title, description, category, price, inventory } = req.body;
    const role = req.staff.role; 

    console.log(role);

    if(role!== 'admin'){
       return res.status(403).json({ message: 'Access denied. You cannot access this functionality.' });
    }   


    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    };

    const imageUrl = await streamUpload(req.file.buffer);

    // Insert into database using Sequelize
    const product = await Product.create({
      category,
      title,
      description,
      price,
      inventory,
      image: imageUrl,
      rating: 0,
      numRatings: 0,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Updating existing product from dashboard
router.put('/products/:id', verifyToken,  upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, inventory } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update({
      title,
      description,
      category,
      price,
      inventory,
      ...(image && { image }) // only update image if new one provided
    });

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// deleting the product from the dashboard
router.delete('/products/:id', verifyToken, async (req, res) => {
  const role = req.staff.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. You cannot access this functionality.' });
  }

  try {
    await Product.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

module.exports = router;
