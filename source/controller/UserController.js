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
const bcrypt = require('bcrypt');

const UserController = {

    /*
        TODO: Login User
        - post request
        - handles user authentication
        - checks provided username and password against DB
        - sets up a session if login is successful
        - returns the appropriate responses for success or failure
    */
    login: (req, res) => {

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
        - password hashing with bcrypt
        - error handling
        - returns the appropriate responses for success or failure
    */
        register: (req, res) => {

    },
}

module.exports = UserController;