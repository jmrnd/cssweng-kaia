// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('../controller/UserController.js');
const AdminController = require('../controller/AdminController.js');


// router.get('/', UserController.homepage );
router.get('/login', UserController.getLogin );
router.post('/login', UserController.postLogin );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );

router.get('/inventory', AdminController.inventory );
router.get('/registerProduct', AdminController.getRegisterProduct );
router.post('/registerProduct', AdminController.postRegisterProduct );

router.get('/', (req, res) => {
    res.redirect('/homepage');
});

router.get('/homepage', (req, res) => {
    res.render('product-catalog');
});

router.get('/product', (req, res) => {
    res.render('product');
});

module.exports = router;