const asyncHandler = require('express-async-handler');
const { Types } = require('mongoose');
const Product = require('../models/product');

function notFoundHandler() {
  const err = new Error('Product not found');
  err.status = 404;
  return err;
}

exports.getProducts = asyncHandler(async (req, res, next) => {
  const {
    category,
    rating,
    minPrice = 0,
    maxPrice = 10000,
    search = '',
    sort,
  } = req.query;

  const sortOptions = {};

  if (sort) {
    const [field, value] = sort.split('-');
    sortOptions[field] = value;
  }

  const filters = {
    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },

    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
  };

  if (category && category !== 'all') {
    filters.category = category;
  }

  if (sort) {
    const [field, value] = sort.split('-');
    sortOptions[field] = value;
  }

  let products = await Product.find(filters).sort(sortOptions).exec();

  if (rating) {
    products = products.filter(
      (product) => product.averageRating >= Number(rating),
    );
  }

  if (!sort || sort.split('-')[0] === 'rating') {
    products.sort((a, b) => b.averageRating - a.averageRating);
  }

  return res.json({ products });
});

exports.getOneProduct = asyncHandler(async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.productId)) {
    return next(notFoundHandler());
  }

  const product = await Product.findById(req.params.productId).exec();

  if (!product) {
    return next(notFoundHandler());
  }

  return res.json({ product });
});
