const db = require('../config/database.js');
const bcrypt = require('bcrypt');

class User {

    /** 
        ` Authenticate a user by comparing their provided email 
        and password with the database. Passwords are securely
        hashed using bcrpyt.

        @returns {Object}   the appropriate status code and message:
            - If registration is successful, it also returns the user data
            - If an error occurs during password hash or database insertion, 
            it returns a 500 status instead
    */
    static async login( email, password ) {
        const sql = `SELECT * FROM users WHERE email = ?`;

        try {
            const [userRows] = await db.execute(sql, [email]);

            // - If there are no rows returned, then email is not in the database
            if( userRows.length === 0 ) {
                return { status: 404, message: "Email does not exist." };
            } 

            const user = userRows[0];
            const passwordMatch = await bcrypt.compare( password, user.password );

            if( passwordMatch ) {
                return { status: 200, message: "Login successful." };
            } else {
                return { status: 401, message: "Incorrect password." };
            }
        } catch( error ) {
            console.log( "User Login Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

    /** 
        ` Register a new user by securely hashing their password
        and storing their information in the database.

        @returns {Object}   the appropriate status code and message:
            - If registration is successful, it also returns the user data
            - If an error occurs during password hash or database insertion, 
            it returns a 500 status instead
    */
    static async register( firstName, lastName, email, password ) {
        const sql = `
            INSERT INTO users(
                firstName,
                lastName,
                email,
                password
            ) 
            VALUES( ?, ?, ?, ? )
        `;

        try {
            // - Hash the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            // - Insert user into the database
            const values = [firstName, lastName, email, hash];
            const [newUser, _] = await db.execute(sql, values);    
            return { status: 201, message: "Registration successful.", user: newUser };

        } catch( error ) {
            console.log( "User Register Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

    /** 
        ` Check if a user with the given email already exists in the database. 

        @returns {Boolean}  true if the email is registered, false otherwise
    */
    static async doesEmailExist( email ) {
        const sql = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;

        try {
            const [rows, _] = await db.execute(sql, [email]);
            const count = rows[0].count;
            return count > 0 ? true : false;    // Returns true if counter > 0
        } catch( error ) {
            console.log( "Error: ", error );
            return false;
        }
    }


    /** 
        ` Retrieves the highest role associated with a given email address. 
        
        - It looks up the user's role in the 'userRoles' table, where each "role" 
        is associated with an ID ranging from 1 (Guest) to 3 (Admin). 

        - The 'userRoles' table manages all the roles that the user currently has

        @returns {string}  the role name if email is registered, null otherwise
    */
    static async getHighestRole( email ) {
        const sql = `
            SELECT u.firstName, u.lastName, u.email, r.roleName, r.roleID
            FROM users u
                INNER JOIN userRoles ur ON u.userID = ur.userID
                INNER JOIN roles r on ur.roleID = r.roleID
            WHERE u.email = ?
            ORDER BY r.roleID DESC;
        `;
        
        const [rows, _] = await db.execute(sql, [email]);
        if( rows.length > 0 ) {
            return rows[0].roleName;
        } else {
            return null;
        }
    }
}

module.exports = User;

/*
async function main() {
    try {
      // Replace with a valid email and password for testing
      const firstName = 'Sebastien Michael';
      const lastName = 'Dela Cruz'
      const email = 'sebastien_delacruz@dlsu.edu.ph';
      const password = '2211qq11';
  
      const result = await User.login(email, password);
      // const register = await User.register( firstName, lastName, email, password );

      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
}

main();
*/
