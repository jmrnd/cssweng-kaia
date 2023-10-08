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
const User = require('../models/User.js');

const UserController = {

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
                res.render('login.ejs');
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
            const user = await User.login( email, password );

            if( user.status !== 200 ) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } 

            // - If remember me option was checked
            req.session.rememberMe = rememberMe === 'true';
            req.session.authorized = true;
            req.session.email = email;
            req.session.userRole = await User.getHighestRole(email);

            if( req.session.userRole == 'admin' ) {
                return res.status(201).json({ message: "Login successful." });
            } else {
                return res.status(201).json({ message: "Login successful." });
            }   

        } catch( error ) {
            console.error(error); 
            return res.status(500).json({ message: 'An error occurred during login. Please try again.' });
        }
    },

    logout: (req, res) => {
        try {
            req.session.destroy();
            res.render('homepage'); 
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
            if( req.session.authorized ) {
                res.render('homepage.ejs');
            } else {
                res.redirect('/login');
            }
        } catch( error ) {
            console.log( "homepage() error: ", error );
        }
    } 
}

module.exports = UserController;