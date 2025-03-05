/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Product = require('./models/product');
const Rating = require('./models/rating');
const seedProducts = require('./helpers/seedProducts');

async function seedDatabase() {
  console.log('Seeding rating users...');
  await User.deleteMany();
  const userPromises = [];

  for (let i = 0; i < 68; i += 1) {
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

  const productPromises = seedProducts.map((seedProduct) =>
    Product.create({
      title: seedProduct.title,
      price: seedProduct.price,
      description: seedProduct.description,
      category: seedProduct.category,
      image: seedProduct.image,
      purchaseCount: Math.ceil(Math.random() * 1000),
      ratingCount: Math.round(seedProduct.rating.count / 10),
      averageRating: seedProduct.rating.rate,
    }),
  );

  await Promise.all(productPromises);
  console.log('Seeding ratings...');
  const ratingPromises = [];
  const users = await User.find().exec();
  const products = await Product.find().exec();

  seedProducts.forEach((seedProduct) => {
    const matchedProduct = products.find(
      (product) => product.title === seedProduct.title,
    );

    for (let i = 0; i < Math.round(seedProduct.rating.count / 10); i += 1) {
      ratingPromises.push(
        Rating.create({
          user: users[i]._id,
          product: matchedProduct._id,
          rate: seedProduct.rating.rate,
        }),
      );
    }
  });

  await Promise.all(ratingPromises);
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
