const db = require('../config/database.js');

class Product {
    
    static async createProduct( name, description, price, categoryID ) {
        const sql = `
            INSERT INTO products(
                productName,
                productDescription,
                price,
                categoryID
            ) 
            VALUES( ?, ?, ?, ? )
        `;

        try {
            const values = [ name, description, price, categoryID ];
            const [result] = await db.execute(sql, values);
            const productID = result.insertId;

            return { status: 201, message: "Registration successful.", productID: productID };
        } catch( error ) {
            console.log( "createProduct() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

    static async deleteProduct( productID ) {
        const sql = `
            DELETE FROM products p WHERE p.productID = ?;
        `;

        try {
            const value = [ productID ];
            await db.execute(sql, value);
            return { status: 201, message: "Product deletion was successful." }; 
        } catch( error ) {
            console.log( "deletProduct() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

    static async updateProduct( product ) {
        const sql = `
            UPDATE products
            SET productName = ?, productDescription = ?, price = ?
            WHERE productID = ?;
        `;

        try {
            const { productID, productName, productDescription, price } = product;
            const values = [productName, productDescription, price, productID];
            await db.execute(sql, values);
            return { status: 200, message: "Product was successfuly updated." };
        } catch( error ) {
            console.log( "updateProduct() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

    static async getHighestProductID() {
        const sql = `SELECT * FROM products ORDER BY productID DESC LIMIT 1;` 
        try {
          const [rows, _] = await db.execute(sql);
      
          if( rows.length === 0 ) {
                return { status: 404, message: "No products found." };
          }
    
          const product = rows[0];
          return { status: 200, message: "Product retrieved successfully.", productID: product.productID };

        } catch( error ) {
            console.log( "getHighestProductID Error: " + error );
            return { status: 500, message: "Internal server error." };
        }
    }

    static async getAllProducts() {
        const sql = `SELECT * FROM products`;
        try {
            const [rows, _] = await db.execute(sql);
            if( rows.length === 0) {
                return { status: 404, message: "No products found.", products: null };
            }        
            return { status: 200, message: "Products retrieved successfully.", products: rows };
        } catch( error ) {
            console.error( "getAllProducts() Error: ", error );
            return { status: 500, message: "Internal server error.", products: null };
        }
    }

    static async getAllProductsWithImages() {
        const sql = `
            SELECT p.productID, p.categoryID, p.productName, p.productDescription, p.price, i.imageID, i.filePath
            FROM products p
            LEFT JOIN (
                SELECT pi.productID, MAX(i.imageID) AS maxImageID
                FROM productImages pi
                LEFT JOIN imageReferences i ON pi.imageID = i.imageID
                GROUP BY pi.productID
            ) AS maxImages ON p.productID = maxImages.productID
            LEFT JOIN imageReferences i ON maxImages.maxImageID = i.imageID
            ORDER BY i.imageID ASC
        `;  

        try {
            const [rows, _] = await db.execute(sql);
            if (rows.length === 0) {
                return { status: 404, message: "No products found.", products: null };
            }
            return { status: 200, message: "Products retrieved successfully.", products: rows };
        } catch (error) {
            console.error("getAllProducts() Error: ", error);
            return { status: 500, message: "Internal server error.", products: null };
        }
    }

    static async getProductByID( productID ) {
        if( productID === undefined ) {
            return { status: 400, message: "Invalid productID", product: null };
        }

        const sql = `SELECT * FROM products WHERE productID = ?;`

        try {
            const [productRows, _] = await db.execute(sql, [productID]);

            // - If there are no rows, product dooes not exist
            if( productRows.length === 0 ) {
                return { status: 404, message: "Product does not exist", product: null };
            }

            const product = productRows[0];
            return { status: 401, message: "Product retrieved by id", product: product };   

        } catch( error ) {
            console.log( "getProductByID() Error: ", error );
            return { status: 500, message: "Internal server error.", product: null };
        }
    }

    static async getProductWithImageByID( productID ) {
        if( productID === undefined ) {
            return { status: 400, message: "Invalid productID", product: null };
        }

        const sql = `
            SELECT p.*, i.filePath
            FROM products p    
            LEFT JOIN productImages pi ON p.productID = pi.productID
            LEFT JOIN imageReferences i ON pi.imageID = i.imageID
            WHERE p.productID = ?
            ORDER BY i.imageID DESC;
        `
        
        try {
            const [productRows, _] = await db.execute(sql, [productID]);

            // - If there are no rows, product dooes not exist
            if( productRows.length === 0 ) {
                return { status: 404, message: "Product does not exist", product: null };
            }

            const product = productRows[0];
            return { status: 401, message: "Product retrieved by id", product: product };   

        } catch( error ) {
            console.log( "getProductByID() Error: ", error );
            return { status: 500, message: "Internal server error.", product: null };
        }
    }

    /*
        Will return category name and category ID
    */
    static async getBottomMostCategories() {
        const sql = `
            SELECT DISTINCT 
                c1.categoryID AS categoryID,
                c1.categoryName AS categoryName
            FROM productCategories c1
            LEFT JOIN productCategories c2 ON c1.categoryID = c2.parentCategoryID
            WHERE c2.categoryID IS NULL;
        `;

        try {
            const [categories, _] = await db.execute(sql);
            return { status: 201, message: "Categories retrieved successfully.", categories: categories };
        } catch( error ) {
            console.log( "getBottomMostCategories() Error: ", error );
            return { status: 500, message: "Internal server error.", categories: null };
        }
    }

    static async getCategoryIdFromName( categoryName ) {
        const sql = `
            SELECT categoryID
            FROM productCategories
            WHERE categoryName = ?;
        `
        try {
            const [rows] = await db.execute(sql, [categoryName]);
            // - If there are no rows returned, then category is not in the database
            if( rows.length === 0 ) {
                return { status: 404, message: "Category does not exist.", categoryID: null };
            } else if( rows.length > 0 ) {
                return { status: 200, message: "Success!", categoryID: rows[0].categoryID };
            }

        } catch( error ) {
            console.log( "getBottomMostCategories() Error: ", error );
            return { status: 500, message: "Internal server error.", categoryID: null };
        }
    }
}

module.exports = Product;