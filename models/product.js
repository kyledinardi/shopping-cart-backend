const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },

    ratings: [
      {
        rate: { type: Number, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },

  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

function getAverageRating() {
  if (this.ratings.length === 0) {
    return 0;
  }

  const ratingSum = this.ratings.reduce((sum, rating) => sum + rating.rate, 0);
  return Math.round((ratingSum / this.ratings.length) * 10) / 10;
}

ProductSchema.virtual('averageRating').get(getAverageRating);
module.exports = model('Product', ProductSchema);
