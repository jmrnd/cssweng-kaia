// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('../controller/UserController.js');
const AdminController = require('../controller/AdminController.js');
const multer = require('../config/multer.js');

router.get('/homepage', UserController.homepage );
router.get('/login', UserController.getLogin );
router.post('/login', UserController.postLogin );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );
router.get('/productCatalog', UserController.productCatalog );
router.get('/upload', UserController.getUpload );
router.get('/viewProduct', UserController.viewProduct );
router.get('/wishlist', UserController.wishlist );
router.post('/wishlistProduct', UserController.wishlistProduct );
router.post('/wishlistProduct', UserController.viewCart );


router.get('/inventory', AdminController.inventory );
router.get('/registerProduct', AdminController.getRegisterProduct );
router.post('/registerProduct', AdminController.postRegisterProduct );
router.get('/editProduct', AdminController.editProduct );
router.post('/deleteProduct', AdminController.deleteProduct );
router.post('/updateProduct', AdminController.updateProduct );
router.post('/uploadProductImage', multer.single("product"), AdminController.uploadImage );
router.post('/createProductImage', AdminController.createProductImage );
router.post('/deleteProductImage', AdminController.deleteProductImage );


router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/admin', (req, res) => {
    res.redirect('/inventory');
});


router.post('/upload', multer.single("product"), UserController.postUpload );

module.exports = router;