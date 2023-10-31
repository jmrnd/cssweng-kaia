/*|********************************************************

    This controller handles user-related authentication,
    functionality, and administrative operations, such as
    user registration, login, logout, profile management,
    and more.

    NOTE: Customer CRUD operations should not be able to
        view the admin page or perform administrative 
        operations.

**********************************************************/
const db = require('../config/database.js');
const Product = require('../models/Product.js');
const Image = require('../models/Image.js');

const AdminController = {

    /** 
        ` Handles the GE Trequest to display the inventory page, which is only
        accessible to admins. If the user is authorized as an admin, it retrieves
        all the relevant product details and renders 'inventory.ejs'. Otherwise,
        it redirects to the homepage.
    */
    inventory: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const { categories } = await Product.getBottomMostCategories();
            const { products } = await Product.getAllProductsWithImages();
            res.render('./admin/inventory.ejs', { categories: categories, products: products });
        } else {
            res.redirect('/');
        }
    },
    
    /** 
        ` Handles the GET request to display the register product page, which is 
        only accessible to admins. If the user is authorized as an admin, it 
        retrieves the bottom-most categories and renders 'registerProduct.ejs'. 
        Otherwise, it redirects to the homepage.
    */
    getRegisterProduct: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const { categories } = await Product.getBottomMostCategories();
            res.status(200).render('./admin/registerProduct.ejs', { categories: categories });
        } else {
            res.redirect('/');
        }
    },

    // - Creates the product
    postRegisterProduct: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const { name, description, price, stock, categoryID } = req.body;
            const result = await Product.createProduct(name, description, price, stock, categoryID);
            if( result.status == 201 ) {
                return res.status(201).json({ message: "Product created", productID: result.productID });
            } else {
                return res.status(500).json({ message: "Product not created" } );
            }
        } else {
            res.redirect('/');
        }
    },

    uploadImage: async (req, res) => {
        try {
            if( req.file ) {
                const userID = req.session.userID; 
                const originalName = req.file.originalname;
                const fileName = req.file.filename;
                const destination = req.file.destination;
                const filePath = destination.replace( 'public/', '' ) + '/' + fileName;
                const upload = await Image.uploadImage( userID, originalName, fileName, destination, filePath );

                if( upload.status !== 200 ) {
                    return res.status(401).json({ message: 'Image upload failed' });
                }

                const { image } = await Image.getImageByFileName( fileName );
                return res.status(200).json({ message: "Image uploaded", image: image } );
            } else {
                return res.status(404).send( "File not found." );
            }
        } catch( error ) {
            console.log( "Error: File upload failed", error );
            res.status(500).send( "File upload failed: " + error );
        }   
    },

    // - receives an imageReference object as result
    createProductImage: async (req, res) => {
        try {
            const { imageID } = req.body;
            const { productID } = await Product.getHighestProductID();
            await Image.createProductImage( productID, imageID );
            return res.status(201);
        } catch( error ) {
            console.log( "Error: Create product image failed" );
            res.status(500).send( "Create product image error: " + error );
        }
    },

    deleteProductImage: async (req, res) => {
        try {
        } catch( error ) {
        }   
    },

    editProduct: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const productID = req.query.productID;
            const { categories } = await Product.getBottomMostCategories();
            const { product } = await Product.getProductByID(productID);
            res.status(200).render('./admin/editProduct.ejs', { categories: categories, product: product });
        } else {
            res.redirect('/');
        }
    },

    deleteProduct: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const { productID } = req.body;
            const result = await Product.deleteProduct(productID);
            if( result.status == 201 ) {
                return res.status(201).json({ message: "Product deleted" });
            } else {
                return res.status(500).json({ message: "Product not deleted" } );
            }
        }
    },

    updateProduct: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const product = req.body;
            const response = await Product.updateProduct( product );
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            return res.status(500).json({ message: "Product not updated" } );
        }
    }
}

module.exports = AdminController;