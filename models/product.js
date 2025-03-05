const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  purchaseCount: { type: Number, default: 0, required: true },
  ratingCount: { type: Number, default: 0, required: true },
  averageRating: { type: Number, default: 0 },
});

module.exports = model('Product', ProductSchema);
