const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const authRouter = require('./Routes/authRoute');
const productRouter = require('./Routes/productRoute');
const orderRouter = require('./Routes/orderRoute');
const profileRouter = require('./Routes/profileRoute');
const dashAuthRouter = require('./Routes/dashAuthRoute');
const dashboardRouter = require('./Routes/dashboardRoute'); 
const sequelize = require('./db/connectDB');
require('./Model/AuthModel');
require('./Model/orderItemsModel');
require('./Model/orderModel');
require('./Model/productModel');
require('./Model/staffModel')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'utils')));


app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', orderRouter);
app.use('/profile', profileRouter);
app.use('/dashboard/auth', dashAuthRouter); 
app.use('/dashboard',dashboardRouter);


sequelize.sync()  
  .then(() => {
    console.log('Models synced with database.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Sequelize sync failed:', err);
  });
