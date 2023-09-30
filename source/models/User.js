const db = require('../config/database.js');
const bcrypt = require('bcrypt');


class User {
    constructor( firstName, lastName, email, password ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;           // Not yet hashed
    }

    async register() {
        // - Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;

        let sql = `
            INSERT INTO users(
                firstName,
                lastName,
                email,
                password
            ) 
            VALUES( 
                ${this.firstName},
                ${this.lastName},
                ${this.email},
                ${this.password}
            )
        `

        // - Insert to the database
        const [newUser, _] = await db.execute(sql);
        return newUser;
    }
}