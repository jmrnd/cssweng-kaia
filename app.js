/*|********************************************************

    This Node.js application sets up an Express.js server,
    connects to a MySQL database, and defines middlewares 
    and routes for handling HTTP requests. 

    IMPORTANT NOTES: 
    - This application requires a MySQL database. 
    - Refer to "source/config/database.js" for more details
                        
**********************************************************/
require('dotenv').config();

// - Express
const express = require('express');
const app = express();
const port = process.env.NODE_PORT;

// - Modules
const router = require('./source/router/router');
const session = require('./source/config/session');

async function startServer() {
    app.set('view engine', 'ejs');          // embedded javascript (EJS) as view engine
    app.set('views', './source/views');     // directory for the views folder
    app.use(express.static('public'));      // looks at 'public' folder for static files
    app.use(express.json());                // parse request body as json
    app.use(session);                       // session maanagement
    app.use(router);                        // assign routes

    app.listen(port, () => { 
        console.log(`Server is running at port ${port}`); 
    });
}

startServer();