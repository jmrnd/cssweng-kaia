const db = require('../config/database.js');

class Variation {
    
    static async createVariation( productID, name, color, stock ) {
        const sql = `
            INSERT INTO productsVariation(
                productID,
                variationName,
                hexColor,
                stockQuantity
            ) 
            VALUES( ?, ?, ?, ? )
        `;

        try {
            const values = [ productID, name, color, stock ];
            await db.execute(sql, values);
            return { status: 201, message: "Registration successful." };
        } catch( error ) {
            console.log( "createVariation() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }
}

module.exports = Variation;