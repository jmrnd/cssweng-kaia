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

const AdminController = {

    // - GET request
    inventory: async (req, res) => {
        if( req.session.authorized && req.session.userRole == 'admin' ) {
        // if( true ) {
            const { categories } = await Product.getBottomMostCategories();
            const { products } = await Product.getAllProducts();
            res.render('./admin/inventory.ejs', { categories: categories, products: products });
        } else {
            res.redirect('/');
        }
    },
    
    // - View for page
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
            const { name, description, price, stock, categoryID } = req.body;
            const result = await Product.createProduct(name, description, price, stock, categoryID);
            if( result.status == 201 ) {
                return res.status(201).json({ message: "Product created", productID: result.productID });
            } else {
                return res.status(500).json({ message: "Product not created"} );
            }
        } else {
            res.redirect('/');
        }
    }
}

module.exports = AdminController;