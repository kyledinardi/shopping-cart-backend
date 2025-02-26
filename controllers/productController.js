const asyncHandler = require('express-async-handler');
const { Types } = require('mongoose');
const Product = require('../models/product');

function notFoundHandler() {
  const err = new Error('Product not found');
  err.status = 404;
  return err;
}

exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, rating, minPrice, maxPrice, search, sort } = req.query;
  const sortOptions = {};

  if (sort) {
    const [field, value] = sort.split('-');
    sortOptions[field] = value;
  } else {
    sortOptions.rating = 'desc';
  }

  const filters = {
    'rating.rate': { $gte: rating ? Number(rating) : 0 },
    
    price: {
      $gte: minPrice ? Number(minPrice) : 0,
      $lte: maxPrice ? Number(maxPrice) : 10000,
    },
  };

  if (category && category !== 'all') {
    filters.category = category;
  }

  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filters).sort(sortOptions).exec();
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
