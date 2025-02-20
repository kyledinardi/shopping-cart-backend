/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');
const products = require('./helpers/products');

async function seedDatabase() {
  console.log('Seeding products...');
  await Product.deleteMany();

  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB connection is not ready');
    return;
  }

  const savePromises = products.map((product) => {
    const newProduct = new Product(product);
    return newProduct.save();
  });

  await Promise.all(savePromises);
  console.log('Seeding complete');
  mongoose.connection.close();
}

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => seedDatabase())

  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
