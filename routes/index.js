const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.post('/users', userController.createUser);
router.post('/users/login', userController.login);
router.get('/products', productController.getProducts);
router.get('/products/random', productController.getRandomProduct);
router.get('/products/:productId', productController.getOneProduct);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/users/current-user', userController.getCurrentUser);
router.put('/users/cart', userController.updateCart);

router.post('/products', productController.createProduct);
router.put('/products/checkout', productController.checkoutProducts);
router.put('/ratings', ratingController.updateRating);
router.delete('/ratings', ratingController.deleteRating);

module.exports = router;
