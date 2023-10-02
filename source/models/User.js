const db = require('../config/database.js');
const bcrypt = require('bcrypt');

class User {

    /*
        FIXME: Add success/error status code
    */
    async login( email, password ) {
        const sql = `SELECT * FROM users WHERE email = ?`;

        try {
            const [userRows, _] = db.execute(sql, [email]);
            if( userRows.length === 0 ) {
                return null;    // - email does not exist
            } 
            const user = userRows[0];
            const passwordMatch = await bcrypt.compare( password, user.password );
            if( passwordMatch ) {
                return user;
            } else {
                return null;
            }
        } catch( error ) {
            console.log( "User Login Error: ", error );
            return null;
        }
    }

    /*
        FIXME: Add success/error status code
    */
    static register( firstName, lastName, email, password ) {
        const sql = `
            INSERT INTO users(
                firstName,
                lastName,
                email,
                password
            ) 
            VALUES( ? ? ? ? )
        `;

        try {
            // - Hash the password
            const salt = bcrypt.genSalt(10);
            const hash = bcrypt.hash(password, salt);

            // - Insert to the database
            const values = [firstName, lastName, email, hash];
            const [newUser, _] = db.execute(sql, values);    
            return newUser;
        } catch( error ) {
            console.log( "User Register Error: ", error );
            return null;
        }
    }

    /*
        FIXME: Add success/error status code
    */
    static doesEmailExist( email ) {
        const sql = `SELECT COUNT(*) AS count FROM users WHERE email = ${email}`;

        try {
            const [rows, _] = db.execute(sql, [email]);
            const count = rows[0].count;
            return count > 0;
        } catch( error ) {
            console.log( "Error: ", error );
            return false;
        }
    }

    /*
        FIXME: Add success/error status code
    */
    static getHighestRole( email ) {
        const sql = `
            SELECT u.firstName, u.lastName, u.email, r.roleName, r.roleID
            FROM users u
                INNER JOIN userRoles ur ON u.userID = ur.userID
                INNER JOIN roles r on ur.roleID = r.roleID
            WHERE u.email = ?
            ORDER BY r.roleID DESC;
        `
        
        const [rows, _] = db.execute(sql, [email]);
        if( rows.length > 0 ) {
            return rows[0].roleName;
        } else {
            return null;
        }
    }
}

module.exports = User;