const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/Test_Backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const Product = require('./Route/Product.Route');
const Category = require('./Route/Category.Route');
const Roilnvest = require('./Route/Roilinvest.Route');
const User = require('./Route/User.Route');

app.use('/api/product', Product);
app.use('/api/category', Category);
app.use('/api/roilnvest', Roilnvest);
app.use('/api/user', User);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
