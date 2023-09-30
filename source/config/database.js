/*|********************************************************

    Sets up the MySQL database connection pool using the
    'mysql2' library. The connection pool is exported for
    use in other parts of the application.

    NOTES: 
    - This process does not automatically create the 
    database and assumes it already exists. 
    
    - Before establishing a connection, manually create 
    the database using MySQL. Use the 'schema.sql' file
    included in the 'config' folder.
    
    - Afterwards, make sure to update the credentials in 
    the '.env' file.

**********************************************************/ 
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, 
});

module.exports = pool.promise();