const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  totalCartQuantity: { type: Number, required: true, default: 0 },

  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = model('User', UserSchema);
