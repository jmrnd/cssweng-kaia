const db = require('../config/database.js');
class Wishlist {
    
    static async checkWishlistStatus( userID, productID ) {
        const sql = `
            SELECT COUNT(*) AS count
            FROM wishlist
            WHERE userID = ? AND productID = ?;
        `;
    
        try {
            const [rows] = await db.execute(sql, [userID, productID]);
            if (rows[0].count > 0) {
                return { status: 200, message: "Product is wishlisted." };
            } else {
                return { status: 404, message: "Product is not wishlisted." };
            }
        } catch (error) {
            console.log("checkWishlistStatus() Error:", error);
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }

    static async addToWishlist( userID, productID ) {
        const sql = `
            INSERT INTO wishlist (userID, productID)
            VALUES (?, ?);
        `;
    
        try {
            await db.execute(sql, [userID, productID]);
            return { status: 201, message: "Product added to wishlist." };
        } catch (error) {
            console.log("addToWishlist() Error:", error);
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }
    
    static async removeFromWishlist( userID, productID ) {
        const sql = `
            DELETE FROM wishlist
            WHERE userID = ? AND productID = ?;
        `;
    
        try {
            await db.execute(sql, [userID, productID]);
            return { status: 200, message: "Product removed from wishlist." };
        } catch (error) {
            console.log("removeFromWishlist() Error:", error);
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }

    static async getUserWishlist( userID ) {
        const sql = `
            SELECT
                p.productID,
                p.categoryID,
                p.productName,
                p.productDescription,
                p.price,
                i.imageID,
                i.filePath,
                COALESCE(SUM(v.stockQuantity), 0) AS stockQuantity
            FROM products p
            INNER JOIN wishlist w ON p.productID = w.productID
            LEFT JOIN (
                SELECT pi.productID, MIN(i.imageID) AS minImageID
                FROM productImages pi
                LEFT JOIN imageReferences i ON pi.imageID = i.imageID
                GROUP BY pi.productID
            ) AS minImages ON p.productID = minImages.productID
            LEFT JOIN imageReferences i ON minImages.minImageID = i.imageID
            LEFT JOIN productsVariation v ON p.productID = v.productID
            WHERE w.userID = ?
            GROUP BY p.productID, p.categoryID, p.productName, p.productDescription, p.price, i.imageID, i.filePath;
        `;

        try {
            const [rows] = await db.execute(sql, [userID]);
            return { status: 200, wishlist: rows };
        } catch (error) {
            console.log("getWishlistedProductsByUserID Error:", error);
            return { status: 500, message: "Internal server error: " + error.message };
        }
    }
}

module.exports = Wishlist;