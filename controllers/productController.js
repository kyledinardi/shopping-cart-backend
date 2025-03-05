const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { body } = require('express-validator');
const { unlink } = require('fs/promises');
const cloudinary = require('cloudinary').v2;
const { Types } = require('mongoose');
const Product = require('../models/product');

const storage = multer.diskStorage({
  destination: 'temp/',

  filename(req, file, cb) {
    cb(null, `${crypto.randomUUID()}.${file.originalname.split('.').pop()}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10_000_000 } });

exports.createProduct = [
  upload.single('image'),
  body('title').trim(),
  body('price').trim(),
  body('category').trim(),
  body('description').trim(),

  asyncHandler(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    const image = result.secure_url;
    unlink(req.file.path);

    const { title, category, price, description } = req.body;
    const product = new Product({ title, category, price, description, image });
    await product.save();
    return res.json({ product });
  }),
];

exports.getProducts = asyncHandler(async (req, res, next) => {
  const {
    rating = 0,
    minPrice = 0,
    maxPrice = 10000,
    search = '',
    category,
    sort,
  } = req.query;

  let sortOptions = { averageRating: 'desc' };

  if (sort) {
    const [field, value] = sort.split('-');
    sortOptions = { [field]: value };
  }

  const filters = {
    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    averageRating: { $gte: Number(rating) },

    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
  };

  if (category && category !== 'all') {
    filters.category = category;
  }

  const products = await Product.find(filters).sort(sortOptions).exec();
  return res.json({ products });
});

exports.getRandomProduct = asyncHandler(async (req, res, next) => {
  const products = await Product.aggregate([{ $sample: { size: 1 } }]);
  return res.json({ product: products[0] });
});

exports.getOneProduct = asyncHandler(async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.productId)) {
    const err = new Error('Product not found');
    err.status = 404;
    return next(err);
  }

  const product = await Product.findById(req.params.productId).exec();

  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    return next(err);
  }

  return res.json({ product });
});

exports.checkoutProducts = asyncHandler(async (req, res, next) => {
  const productPromises = req.body.cartContents.map(async (item) => {
    const product = await Product.findById(item.product._id);
    product.purchaseCount += item.quantity;
    return product.save();
  });

  const products = await Promise.all(productPromises);
  return res.json(products);
});
