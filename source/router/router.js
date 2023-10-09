// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('../controller/UserController.js');
const AdminController = require('../controller/AdminController.js');


router.get('/homepage', UserController.homepage );
router.get('/login', UserController.getLogin );
router.post('/login', UserController.postLogin );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );
router.get('/productCatalog', UserController.productCatalog );

router.get('/inventory', AdminController.inventory );
router.get('/registerProduct', AdminController.getRegisterProduct );
router.post('/registerProduct', AdminController.postRegisterProduct );

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/admin', (req, res) => {
    res.redirect('/inventory');
});

module.exports = router;