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
        TODO: Login User
        - post request
        - remember me session
        - handles user authentication
        - checks provided username and password against DB
        - sets up a session if login is successful
        - returns the appropriate responses for success or failure
    */
    postLogin: (req, res) => {        
        try {
            const { email, password } = req.body;
            const user = User.login( email, password );

            if( !user ) {
                return res.status(401).json({ message: 'Invalid credentials'})
            } 

            /*
                Insert session management
            */

            const userRole = User.getHighestRole(email);
            if( userRole == "admin" ) {
                // - redirect to admin dashboard
            } else {
                // - redirect to customer view
            }   

        } catch( error ) {

        }
    },

    /*
        TODO: Logout User
        - get request
        - destroys the user's session
        - sends a response indicating a succesful logout
    */
    logout: (req, res) => {
        
    },

    /*
        TODO: Register User
        - post request
        - input validation (might do it somewhere else to include sanitization)
        - check if the user is a duplicate (email)
        - [DONE] password hashing with bcrypt inside the User model
        - error handling
        - returns the appropriate responses for success or failure
    */
    register: (req, res) => {
        const { firstName, lastName, email, password } = req.body;

        try {
            const isEmailRegistered = User.doesEmailExist( email );
            if( isEmailRegistered ) {
                return res.status(400).json({ message: "This email is already registered." });
            }
            User.register( firstName, lastName, email, password );
            return res.status(201).json({ message: "User registered succesfully." });
        } catch( error ) {
            console.error( "Error registering user: ", error );
            return res.status(500).json({ message: "Registration failed." });
        }
    }
}

module.exports = UserController;