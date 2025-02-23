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
