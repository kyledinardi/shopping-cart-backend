const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

exports.createUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username must not be empty')

    .custom(async (username) => {
      const usernameInDatabase = await User.findOne({ username }).exec();

      if (usernameInDatabase) {
        throw new Error('A user already exists with this username');
      }
    }),

  body('password', 'Password must not be empty').trim().notEmpty(),

  body('passwordConfirm', 'Passwords did not match')
    .trim()
    .custom((password, { req }) => password === req.body.password),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, passwordHash });
    await user.save();
    return res.json({ user });
  }),
];

exports.login = (req, res, next) => [
  body('username').trim().escape(),
  body('password').trim().escape(),

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = new Error(info ? info.message : 'User not found');
      error.status = 403;
      return next(error);
    }

    req.login(user, { session: false }, (err2) => {
      if (err2) {
        return next(err2);
      }

      const payload = { id: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.json({ user, token });
    });

    return null;
  })(req, res, next),
];

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('cart.product').exec();
  return res.json({ user });
});

exports.updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantityDelta } = req.body;
  const user = await User.findById(req.user.id).exec();

  const productInCart = user.cart.find(
    (cartItem) => cartItem.product._id.toString() === productId,
  );

  if (productInCart) {
    if (productInCart.quantity + quantityDelta < 1) {
      const i = user.cart.indexOf(productInCart);
      user.cart.splice(i, 1);
    } else {
      productInCart.quantity += quantityDelta;
    }
  } else {
    user.cart.push({ product: productId, quantity: quantityDelta });
  }

  user.totalCartQuantity += quantityDelta;
  await user.save();
  await user.populate('cart.product');
  return res.json({ cart: user.cart, totalQuantity: user.totalCartQuantity });
});
