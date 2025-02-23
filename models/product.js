const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },

  rating: {
    rate: { type: Number, required: true },
    count: { type: Number, required: true, default: 0 },
  },
});

module.exports = model('Product', ProductSchema);
