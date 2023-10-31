const db = require('../config/database.js');

class Image {

    static async uploadImage( userID, originalName, fileName, destination, filePath ) {
        const sql = `
            INSERT INTO imageReferences( 
                userID,
                originalName, 
                fileName, 
                destination, 
                filePath 
            ) 
            VALUES( ?, ?, ?, ?, ? )
        `;

        try {
            const values = [ userID, originalName, fileName, destination, filePath ];
            await db.execute(sql, values);
            return { status: 200, message: "Upload image successful." };
        } catch( error ) {
            console.error( "uploadImage() error:", error );
            return res.status(500).json({ message: "Upload image failed." });
        }
    }

    static async getImageByFileName( fileName ) {
        const sql = 'SELECT * FROM imageReferences WHERE fileName = ?';

        try {
            const [image] = await db.execute(sql, [fileName]);

            if( image.length === 0 ) {
                return { status: 404, message: 'Image not found' };
            } 
            return { status: 200, message: 'Image found', image: image[0] };

        } catch (error) {
            console.error('getImageByFileName() error:', error );
            return { status: 500, message: 'Error retrieving image' };
        }
    } 
    
    static async createProductImage( productID, imageID ) {
        const sql = 'INSERT INTO productImages (productID, imageID) VALUES (?, ?)';

        try {
            const values = [ productID, imageID ];
            const [result] = await db.execute(sql, values);

            if( result.affectedRows === 1 ) {
                return { status: 201, message: 'Product image created' };
            } else {
                return { status: 500, message: 'Failed to create product image' };
            }
        } catch( error ) {
            console.error( "uploadImage() error:", error );
            return res.status(500).json({ message: "Upload image failed." });
        }
    }

    static async getAllProductImages() {
        const sql = `SELECT * FROM productImages`;
        try {
            const [rows, _] = await db.execute(sql);
            if( rows.length === 0 ) {
                return { status: 404, message: "No product images found.", images: null };
            }        
            return { status: 200, message: "Product images retrieved successfully.", images: rows };
        } catch( error ) {
            console.error( "getAllProductImages() Error: ", error );
            return { status: 500, message: "Internal server error.", images: null };
        }
    }
}

module.exports = Image;