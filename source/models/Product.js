const db = require('../config/database.js');

class Product {

    static async createProduct( name, description, price, stock ) {
        const sql = `
            INSERT INTO products(
                productName,
                productDescription,
                price,
                stockQuantity
            ) 
            VALUES( ?, ?, ?, ? )
        `;

        try {
            const values = [name, description, price, stock ];
            const [newProduct, _] = await db.execute(sql, values);
            // const { productID } = await this.getHighestProductID();
            return { status: 201, message: "Registration succesful." };
        } catch( error ) {
            console.log( "createProduct() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }

/*
    static async getHighestProductID() {
        const sql = `
        SELECT * FROM products ORDER BY productID DESC LIMIT 1;` 

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
*/
    static async getAllProducts() {
        const sql = `SELECT * FROM products`;
        try {
            const [rows, _] = await db.execute(sql);
            if( rows.length === 0) {
                return { status: 404, message: "No products found." };
            }        
            return { status: 200, message: "Products retrieved successfully.", products: rows };
        } catch( error ) {
            console.error("getAllProducts() Error: ", error);
            return { status: 500, message: "Internal server error." };
        }
    }

    static async getBottomMostCategories() {
        const sql = `
            SELECT DISTINCT c1.categoryName AS categoryName
            FROM productCategories c1
            LEFT JOIN productCategories c2 ON c1.categoryID = c2.parentCategoryID
            WHERE c2.categoryID IS NULL;
        `;

        try {
            const [rows, _] = await db.execute(sql);
            const categories = rows.map((row => row.categoryName))
            return { status: 201, message: "Categories retrieved successfully.", categories: categories };
        } catch( error ) {
            console.log( "getBottomMostCategories() Error: ", error );
            return { status: 500, message: "Internal server error." };
        }
    }
}

module.exports = Product;