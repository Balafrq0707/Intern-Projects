const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const authRouter = require('./Routes/authRoute');
const productRouter = require('./Routes/productRoute')
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use('/auth', authRouter); 
app.use('/api', productRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});