const db = require('../config/database.js');

class ShoppingCart {

    static async checkShoppingCartStatus( userID, variationID ) {
        const sql = `
            SELECT COUNT(*) AS count
            FROM shoppingCart
            WHERE userID = ? AND variationID = ?;
        `;
    
        try {
            const values = [userID, variationID]
            const [rows] = await db.execute(sql, values);
            if (rows[0].count > 0) {
                return { status: 200, message: "Product is in shopping cart." };
            } else {
                return { status: 204, message: "Product is not in shopping cart." };
            }
        } catch (error) {
            console.log( "checkShoppingCartStatus() Error:", error );
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }

    static async addToShoppingCart( userID, variationID, quantity ) {
        const sql = `
            INSERT INTO shoppingCart (userID, variationID, quantity)
            VALUES (?, ?, ?);
        `;
    
        try {
            const values = [userID, variationID, quantity];
            await db.execute(sql, values);
            return { status: 201, message: "Product added to shopping cart." };
        } catch (error) {
            console.log( "addToShoppingCart() Error:", error );
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }
    
    static async removeFromShoppingCart( userID, variationID ) {
        const sql = `
            DELETE FROM shoppingCart
            WHERE userID = ? AND variationID = ?;
        `;
    
        try {
            const values = [userID, variationID];
            await db.execute(sql, values);
            return { status: 200, message: "Product removed from shopping cart." };
        } catch (error) {
            console.log( "removeFromShoppingCart() Error:", error );
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }

    static async getUserShoppingCart( userID ) {
        const sql = `
            WITH RankedImages AS (
                SELECT
                    pi.productID,
                    pi.imageID,
                    ROW_NUMBER() OVER (PARTITION BY pi.productID ORDER BY pi.imageID) AS row_num
                FROM productImages pi
            )
            SELECT
                sc.userID, sc.variationID, pv.variationName, sc.quantity, sc.dateAdded, 
                p.productID, p.categoryID, p.productName, p.price, ri.imageID AS imageID,
                ir.filePath, pv.hexColor, pv.stockQuantity
            FROM shoppingCart sc
            JOIN productsVariation pv ON sc.variationID = pv.variationID
            JOIN products p ON pv.productID = p.productID
            LEFT JOIN RankedImages ri ON p.productID = ri.productID AND ri.row_num = 1
            LEFT JOIN imageReferences ir ON ri.imageID = ir.imageID
            WHERE sc.userID = ?;
        `;

        try {
            const [rows] = await db.execute(sql, [userID]);
            if( rows.length === 0 ) {
                return { status: 404, shoppingCart: null };
            }

            return { status: 200, shoppingCart: rows };
        } catch (error) {
            console.log( "getUserShoppingCart() Error:", error );
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }

    static async updateItemQuantity( userID, variationID, newQuantity ) {
        const sql = `
            UPDATE shoppingCart SET quantity = ?
            WHERE userID = ? AND variationID = ?;
        `;

        try {
            const values = [newQuantity, userID, variationID];
            await db.execute(sql, values);
            return { status: 200, message: "Product quantity updated in shopping cart." };
        } catch (error) {
            console.log( "updateItemQuantity() Error:", error );
            return { status: 500, message: "Internal server error: " + error.message };
        }

    }
}

module.exports = ShoppingCart;