const express = require('express');
const passport = require('passport');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/users', userController.createUser);
router.post('/users/login', userController.login);
router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProduct);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/user', userController.getCurrentUser);
router.put('/cart', userController.updateCart);

module.exports = router;
