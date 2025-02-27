/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Product = require('./models/product');
const seedProducts = require('./helpers/seedProducts');

async function seedDatabase() {
  const userPromises = [];
  const productPromises = [];
  console.log('Seeding rating users...');
  await User.deleteMany();

  for (let i = 0; i < 679; i += 1) {
    userPromises.push(
      User.create({
        username: crypto.randomUUID(),
        passwordHash: crypto.randomUUID(),
      }),
    );
  }

  await Promise.all(userPromises);
  console.log('Seeding guest user...');
  const passwordHash = await bcrypt.hash('1', 10);
  await User.create({ username: 'Guest', passwordHash });

  console.log('Seeding products...');
  await Product.deleteMany();
  const users = await User.find().exec();

  seedProducts.forEach((product) => {
    const newProduct = new Product({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });

    for (let i = 0; i < product.rating.count; i += 1) {
      newProduct.ratings.push({
        rate: product.rating.rate,
        user: users[i]._id,
      });
    }

    productPromises.push(newProduct.save());
  });

  await Promise.all(productPromises);
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
