/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Product = require('./models/product');
const seedProducts = require('./helpers/seedProducts');

async function seedDatabase() {
  console.log('Seeding guest user...');
  await User.deleteMany();
  const passwordHash = await bcrypt.hash('1', 10);
  await User.create({ username: 'Guest', passwordHash });

  console.log('Seeding products...');
  await Product.deleteMany();
  const savePromises = seedProducts.map((product) => Product.create(product));
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
