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
const Variation = require('../models/Variation.js');
const Wishlist = require('../models/Wishlist.js');
const ShoppingCart = require('../models/ShoppingCart.js');
const Middleware = require('./Middleware.js');


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

            console.log( "login", login );

            req.session.rememberMe = rememberMe === 'true';
            req.session.authorized = true;
            req.session.email = email;
            req.session.username = login.username;
            req.session.userID = userID;
            req.session.userRole = highestRole;

            const username = req.session.username;

            if( req.session.userRole == 'admin' ) {
                return res.status(200).json({ message: "Admin login successful.", role: 'admin', username: username });
            } else {
                return res.status(201).json({ message: "User login successful.", role: 'customer', username: username });
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
            const { name, username, email, password } = req.body;
            const isEmailRegistered = await User.doesEmailExist( email );
            const isUsernameRegistered = await User.doesUsernameExist( username );

            if( isEmailRegistered ) {
                console.log( "The email: \"" + email + "\" is already registered" );
                return res.status(400).json({ message: "This email is already registered." });
            } else if( isUsernameRegistered ) {
                console.log( "The email: \"" + username + "\" is already registered" );
                return res.status(400).json({ message: "This username is already registered." });
            }
            User.register( name.firstName, name.lastName, username, email, password );
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
            const { categories } = await Product.getBottomMostCategories();
            const { products } = await Product.getAllProductsWithImages();
            res.status(200).render('users/productCatalog.ejs', { categories: categories, products: products });
        } catch( error ) {
            console.log( "productCatalog() error: ", error );
        }
    },

    viewProduct: async (req, res) => {
        try {
            const productID = req.query.productID;
            const { categories } = await Product.getBottomMostCategories();
            const { product } = await Product.getProductWithImageByID(productID);
            const { images } = await Image.getAllImagesOfProduct(productID);
            const { variations } = await Variation.getAllVariationsOfProduct(productID);

            res.status(200).render('./users/viewProduct.ejs', { 
                categories: categories, product: product, productID: productID, 
                productImages: images, variations: variations
            });
        } catch( error ) {
            console.log( error );
        }
    },

    wishlist: async (req, res) => {
        try {
            if( req.session.authorized ) {
                const userID = req.session.userID;
                const { wishlist } = await Wishlist.getUserWishlist( userID );
                res.status(200).render('./users/wishlist.ejs', { wishlist: wishlist });
            } else {
                res.redirect('/');
            }
        } catch( error ) {
            console.log( error );
        }
    },

    wishlistProduct: async (req, res) => {
        // if( req.session.authorized ) {
        if( true ) {
            try { 
                const { productID } = req.body;
                const userID = req.session.userID; 
                const parsedProductID = parseInt(productID.replace(/\D/g, ''));

                const wishlistStatus = await Wishlist.checkWishlistStatus( userID, parsedProductID );

                if( wishlistStatus.status === 200 ) {
                    const response = await Wishlist.removeFromWishlist( userID, parsedProductID );
                    return res.status(response.status).json({ message: "Product removed from wishlist." });
                } else if( wishlistStatus.status === 404 ) {
                    const response = await Wishlist.addToWishlist( userID, parsedProductID );
                    return res.status(response.status).json({ message: "Product added to wishlist." });
                } else {
                    return res.status(wishlistStatus.status).json({ message: wishlistStatus.message });
                }
            } catch( error ) {
                console.log( "wishlistProduct Error:", error );
                res.status(500).json({ message: "Internal server error." });
            }
        }
    },

    shoppingCart: async (req, res) => {
        try {
            if( req.session.authorized ) {
                const userID = req.session.userID;
                const { shoppingCart, status } = await ShoppingCart.getUserShoppingCart( userID );
                if( status === 200 ) {
                    res.status(200).render('./users/shoppingCart.ejs', { shoppingCart: shoppingCart });
                } else if( status === 404 ) {
                    res.status(404).render('./users/shoppingCart.ejs', { shoppingCart: shoppingCart });
                }
            } else {
                res.redirect('/');
            }
        } catch( error ) {
            console.log( error );
        }
    },

    productToShoppingCart: async (req, res) => {
        try {
            if( req.session.authorized ) {
                const { variationID, quantity } = req.body;
                const userID = req.session.userID; 
                // const parsedVariationID = parseInt(variationID.replace(/\D/g, ''));
                // const parsedQuantity = parseInt(quantity.replace(/\D/g, ''));

                const shoppingCartStatus = await ShoppingCart.checkShoppingCartStatus( userID, variationID );
    
                if( shoppingCartStatus.status === 200 ) {
                    const response = await ShoppingCart.removeFromShoppingCart( userID, variationID );
                    return res.status(response.status).json({ message: "Product removed from cart." });
                } else if( shoppingCartStatus.status === 204 ) {
                    const response = await ShoppingCart.addToShoppingCart( userID, variationID, quantity );
                    return res.status(response.status).json({ message: "Product added to cart." });
                } else {
                    return res.status(shoppingCartStatus.status).json({ message: shoppingCartStatus.message });
                }
            }
        } catch( error ) {
            console.log( "addToCart Error:", error );
            res.status(500).json({ message: "Internal server error." });
        }
    },
}

module.exports = UserController;