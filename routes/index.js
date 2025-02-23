const express = require('express');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/users', userController.createUser);
router.post('/users/login', userController.login);
router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProduct);

module.exports = router;
