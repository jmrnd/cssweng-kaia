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

    getLogin: (req, res) => {
        if( req.session.authorized && req.session.rememberMe ) {
            res.redirect('/homepage');
        } else {
            res.render('login.ejs');
        }
    }, 

    /*
        TODO: Login User
        - post request
        - remember me session
        - handles user authentication
        - checks provided username and password against DB
        - sets up a session if login is successful
        - returns the appropriate responses for success or failure
    */
    postLogin: async (req, res) => {        
        try {
            const { email, password, rememberMe } = req.body;
            const user = await User.login( email, password );

            if( user.status !== 200 ) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } 

            // - If remember me option was checked
            req.session.rememberMe = rememberMe === 'true';
            req.session.authorized = true;
            req.session.userRole = User.getHighestRole(email);

            if( req.session.userRole == 'admin' ) {
                return res.status(201).json({ message: "Registration successful." });
            } else {
                return res.status(201).json({ message: "Registration successful." });
            }   

        } catch( error ) {
            console.error(error); 
            res.status(500).json({ message: 'An error occurred during login. Please try again.' });
        }
    },


    logout: (req, res) => {
        req.session.destroy();
        res.render('homepage'); 
    },

    /**
        ` This function should execute when the user sends a POST request to path '/register',
        which occurs when the register button is pressed in the registration page. It assumes
        the registration data being received is complete, i.e., the input error handling is 
        done on the front-end.
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
    }
}

module.exports = UserController;