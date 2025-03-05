const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const Rating = require('../models/rating');

exports.getOneRating = asyncHandler(async (req, res, next) => {
  const rating = await Rating.findOne({
    user: req.user._id,
    product: req.params.productId,
  });

  return res.json(rating);
});

exports.updateRating = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.productId).exec();
  const { averageRating, ratingCount } = product;
  const newRating = Number(req.body.rating);

  const currentRating = await Rating.findOne({
    user: req.user._id,
    product: product._id,
  });

  if (currentRating) {
    const ratingSum =
      averageRating * ratingCount - currentRating.rate + newRating;

    product.averageRating = ratingSum / ratingCount;
    currentRating.rate = newRating;
    await currentRating.save();
  } else {
    await Rating.create({
      user: req.user._id,
      product: product._id,
      rate: newRating,
    });

    const ratingSum = averageRating * ratingCount + newRating;
    product.averageRating = ratingSum / (ratingCount + 1);
    product.ratingCount += 1;
  }

  await product.save();
  return res.json({ product });
});

exports.deleteRating = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.productId).exec();

  const currentRating = await Rating.findOne({
    user: req.user._id,
    product: req.body.productId,
  });

  if (currentRating) {
    const { averageRating, ratingCount } = product;

    if (ratingCount === 1) {
      product.averageRating = null;
    } else {
      const ratingSum = averageRating * ratingCount - currentRating.rate;
      product.averageRating = ratingSum / (ratingCount - 1);
    }

    product.ratingCount -= 1;
    await product.save();
    await currentRating.deleteOne();
  }

  return res.json({ product });
});
