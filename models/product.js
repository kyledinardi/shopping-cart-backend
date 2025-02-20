const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: { rate: Number, count: { type: Number, default: 0 } },
});

module.exports = model('Product', ProductSchema);
