    /*|********************************************************

    This controller handles user-related authentication,
    functionality, and administrative operations, such as
    user registration, login, logout, profile management,
    and more.

    NOTE: Customer CRUD operations should not be able to
        view the admin page or perform administrative 
        operations.

**********************************************************/
const db = require('../config/database.js');
const multer = require('../config/multer.js');
const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Image = require('../models/Image.js');

const UserController = {

    getUpload: (req, res ) => {
        try {
            res.render('users/upload.ejs');
        } catch( error ) {
            console.log( "getUpload() error: ", error );
        }
    },

    postUpload: async (req, res) => {
        try {
            if( req.file ) {
                const userID = req.session.userID; 
                const originalName = req.file.originalname;
                const fileName = req.file.filename;
                const destination = req.file.destination;
                const filePath = destination.replace( 'public', '' ) + '/' + fileName;
                
                const upload = await Image.uploadImage( userID, originalName, fileName, destination, filePath );
                if( upload.status !== 200 ) {
                    return res.status(401).json({ message: 'Image upload failed' });
                }
                return res.status(200).send( "Image Uploaded" );
            } else {
                return res.status(404).send( "File not found." );
            }
        } catch( error ) {
            console.log( "Error: File upload failed" );
            return res.status(500).send( "File upload failed: " + error );
        }   
    },

    /*
        ` This function is called when the user sends a GET request to path '/login'. 
        If the user is already authorized and has chosen the "remember me" option, it
        redirects them to the homepage.
    */
    getLogin: (req, res) => {
        try {
            if( req.session.authorized && req.session.rememberMe ) {
                res.redirect('/homepage');
            } else {
                res.render('users/login.ejs');
            }
        } catch( error ) {
            console.log( "getLogin() error: ", error );
        }
    }, 

    /*
        ` This function is called when the user sends a POST request to path '/login',
        which occurs when the login button is pressed in the login page. It assumes the 
        login data being received is complete, i.e., the input error handling is done on 
        the front-end.
        
        When successful, it handles user authentication, session management, and provides 
        appropriate responses for both successful and failed login attempts. This function 
        is used for all users regardless of their roles (e.g. Guests, Admins).

        TODO: 
            - Create middleware to validate and sanitize the inputs
    */
    postLogin: async (req, res) => {        
        try {
            if( req.session.authorized && req.session.rememberMe ) {
                res.redirect('/homepage');
            }

            const { email, password, rememberMe } = req.body;
            const login = await User.login( email, password );

            if( login.status !== 200 ) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } 

            // - Perform queries
            const {userID} = await User.getUserID(email);
            const {highestRole} = await User.getHighestRole(email);

            req.session.rememberMe = rememberMe === 'true';
            req.session.authorized = true;
            req.session.email = email;
            req.session.userID = userID;
            req.session.userRole = highestRole;

            if( req.session.userRole == 'admin' ) {
                return res.status(200).json({ message: "Admin login successful." });
            } else {
                return res.status(201).json({ message: "User login successful." });
            }   
        } catch( error ) {
            console.error(error); 
            return res.status(500).json({ message: 'An error occurred during login. Please try again.' });
        }
    },

    logout: (req, res) => {
        try {
            req.session.destroy();
            res.render('users/homepage'); 
        } catch( error ) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred during login. Please try again." });
        }
    },

    /**
        ` This function should execute when the user sends a POST request to path '/register',
        which occurs when the register button is pressed in the registration page. It assumes
        the registration data being received is complete, i.e., the input error handling is 
        done on the front-end.

        TODO: 
            - Create middleware to validate and sanitize the inputs
    */
    register: async (req, res) => {   
        try {
            const { name, email, password } = req.body;
            const isEmailRegistered = await User.doesEmailExist( email );

            if( isEmailRegistered ) {
                console.log( "The email: \"" + email + "\" is already registered" );
                return res.status(400).json({ message: "This email is already registered." });
            }
            User.register( name.firstName, name.lastName, email, password );
            return res.status(201).json({ message: "Registration successful." });
        } catch( error ) {
            console.error( "Error registering user: ", error );
            return res.status(500).json({ message: "Registration failed." });
        }
    },

    /*
    */
   homepage: async (req, res) => {
        try {
            if( true ) {
                res.render('users/homepage.ejs');
            } else {
                res.redirect('/login');
            }
        } catch( error ) {
            console.log( "homepage() error: ", error );
        }
    },

    /*
    */
    productCatalog: async (req, res) => {
        try {
            // if( req.session.authorized ) {
            if( true ) {
                const { categories } = await Product.getBottomMostCategories();
                const { products } = await Product.getAllProductsWithImages();
                res.status(200).render('users/productCatalog.ejs', { categories: categories, products: products });
            } else {
                res.redirect('/login');
            }
        } catch( error ) {
            console.log( "productCatalog() error: ", error );
        }
    },

    viewProduct: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if( true ) {
            const productID = req.query.productID;
            const { categories } = await Product.getBottomMostCategories();
            const { product } = await Product.getProductWithImageByID(productID);
            res.status(200).render('./users/viewProduct.ejs', { categories: categories, product: product });
        } else {
            res.redirect('/');
        }
    },

    wishlist: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if( true ) {
            res.status(200).render('./users/wishlist.ejs' );
        } else {
            res.redirect('/');
        }
    },

    wishlistProduct: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if( true ) {


        } else {
            res.redirect('/');
        }
    },

    viewCart: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if( true ) {
            const productID = req.query.productID;
            const { categories } = await Product.getBottomMostCategories();
            const { product } = await Product.getProductWithImageByID(productID);
            res.status(200).render('./users/viewProduct.ejs', { categories: categories, product: product });
        } else {
            res.redirect('/');
        }
    },

    // viewProfile change when needed
    viewProfile: async (req, res) => {
        if( true ) {
            res.status(200).render('./users/viewProfile.ejs' );

        } else {
            res.redirect('/');
        }
    },
}

module.exports = UserController;