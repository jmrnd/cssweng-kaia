// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('../controller/UserController.js');
const AdminController = require('../controller/AdminController.js');
const multer = require('../config/multer.js');

// - Middlewares
const middleware = require("../controller/Middleware");

router.use( middleware.fetchUser );

router.get('/homepage', UserController.homepage );
router.get('/login', UserController.getLogin );
router.post('/login', UserController.postLogin );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );
router.get('/productCatalog', UserController.productCatalog );
router.get('/upload', UserController.getUpload );
router.post('/upload', multer.single("product"), UserController.postUpload );
router.get('/viewProduct', UserController.viewProduct );
router.post('/checkWishlistStatus', UserController.wishlistProduct );
router.get('/wishlist', UserController.wishlist );
router.post('/wishlistProduct', UserController.wishlistProduct );
router.get('/shoppingCart', UserController.shoppingCart );
router.post('/productToShoppingCart', UserController.productToShoppingCart );
router.post('/updateShoppingCartItemQuantity', UserController.updateShoppingCartItemQuantity );
router.get('/checkout', UserController.checkout );

router.get('/inventory', AdminController.inventory );
router.get('/registerProduct', AdminController.getRegisterProduct );
router.post('/registerProduct', AdminController.postRegisterProduct );
router.post('/createProductVariations', AdminController.createProductVariations );
router.get('/viewProductAdmin', AdminController.viewProductAdmin );
router.get('/editProduct', AdminController.editProduct );
router.post('/deleteProduct', AdminController.deleteProduct );
router.post('/updateProduct', AdminController.updateProduct );
router.post('/uploadTemporaryImage', multer.single("product"), AdminController.uploadTemporaryImage );
router.post('/uploadImageReference', AdminController.uploadImageReference );
router.post('/createProductImage', AdminController.createProductImage );
router.post('/deleteProductImage', AdminController.deleteProductImage );

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/admin', (req, res) => {
    res.redirect('/inventory');
});


module.exports = router;