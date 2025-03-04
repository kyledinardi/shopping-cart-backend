const { Schema, model } = require('mongoose');

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rate: { type: Number, required: true },
});

module.exports = model('Rating', RatingSchema);
