const asyncHandler = require('express-async-handler');
const { Types } = require('mongoose');
const Product = require('../models/product');

function notFoundHandler() {
  const err = new Error('Product not found');
  err.status = 404;
  return err;
}

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().exec();
  return res.json(products);
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.productId)) {
    return next(notFoundHandler());
  }

  const product = await Product.findById(req.params.productId).exec();

  if (!product) {
    return next(notFoundHandler());
  }

  return res.json(product);
});
