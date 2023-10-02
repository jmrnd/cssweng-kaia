/*|********************************************************

    Configures the Express session middleware. It handles
    session management which includes the session data
    encryption, defining the session cookie settings, and
    configuring the session behavior.

**********************************************************/ 
require('dotenv').config();
const session = require('express-session');

module.exports = session({
    secret: process.env.SESSION_SECRET, 
    cookie: { 
        maxAge: 3 * 7 * 24 * 60 * 60 * 1000 
    },
    resave: false,
    saveUninitialized: true,
});