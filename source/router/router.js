// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('../controller/UserController.js');

// router.get('/', UserController.homepage );
router.get('/login', UserController.getLogin );
router.post('/login', UserController.postLogin );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );



router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/homepage', (req, res) => {
    res.render('homepage');
});


module.exports = router;