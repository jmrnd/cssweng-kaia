// - Express
const express = require('express');
const router = express.Router();

// - Modules
const UserController = require('./controller/UserController.js')

router.get('/', UserController.homepage );
router.post('/login', UserController.login );
router.get('/logout', UserController.logout );
router.post('/register', UserController.register );

module.exports = router;