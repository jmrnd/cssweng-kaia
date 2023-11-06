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

    static async getAllVariationsOfProduct( productID ) {
        const sql = `
            SELECT variationID, hexColor, variationName, stockQuantity
            FROM productsVariation
            WHERE productID = ?;
        `;

        try {
            const values = [ productID ];
            const [rows, _] = await db.execute( sql, values );
            if( rows.length === 0 ) {
                return { status: 404, variations: null };
            } return { status: 200, variations: rows };

        } catch( error ) {
            console.log( "Image.js / getAllImagesOfProduct Error: ", error );
            return { status: 500, message: "Internal server error.", variations: null };
        }
    }
}

module.exports = Variation;