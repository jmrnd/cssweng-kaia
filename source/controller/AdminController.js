/*|********************************************************

    This controller handles user-related authentication,
    functionality, and administrative operations, such as
    user registration, login, logout, profile management,
    and more.

    NOTE: Customer CRUD operations should not be able to
        view the admin page or perform administrative 
        operations.

**********************************************************/
const db = require("../config/database.js");
const fse = require("fs-extra");
const Product = require("../models/Product.js");
const Image = require("../models/Image.js");
const Variation = require("../models/Variation.js");

const AdminController = {
    /** 
        ` Handles the GE Trequest to display the inventory page, which is only
        accessible to admins. If the user is authorized as an admin, it retrieves
        all the relevant product details and renders 'inventory.ejs'. Otherwise,
        it redirects to the homepage.
    */
    inventory: async (req, res) => {
        try {
            // if( req.session.authorized && req.session.userRole == 'admin' ) {
            if (true) {
                const { categories } = await Product.getBottomMostCategories();
                const { products } = await Product.getAllProductsWithImages();
                res.render("./admin/inventory.ejs", {
                    categories: categories,
                    products: products,
                });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.log("AdminController.js - inventory() Error: ", error);
        }
    },

    viewProductAdmin: async (req, res) => {
        try {
            // if( req.session.authorized && req.session.userRole == 'admin' ) {
            if (true) {
                const productID = req.query.productID;
                const { categories } = await Product.getBottomMostCategories();
                const { product } = await Product.getProductWithImageByID(
                    productID
                );
                const { images } = await Image.getAllImagesOfProduct(productID);
                const { variations } =
                    await Variation.getAllVariationsOfProduct(productID);

                res.status(200).render("./admin/adminProductView.ejs", {
                    categories: categories,
                    product: product,
                    productID: productID,
                    productImages: images,
                    variations: variations,
                });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.log(
                "AdminController.js - viewProductAdmin() Error: ",
                error
            );
        }
    },

    editProduct: async (req, res) => {
        try {
            // if( req.session.authorized && req.session.userRole == 'admin' ) {
            if (true) {
                const productID = req.query.productID;
                const { categories } = await Product.getBottomMostCategories();
                const { product } = await Product.getProductWithImageByID(
                    productID
                );
                const { images } = await Image.getAllImagesOfProduct(productID);
                const { variations } =
                    await Variation.getAllVariationsOfProduct(productID);

                res.status(200).render("./admin/editProduct.ejs", {
                    categories: categories,
                    product: product,
                    productID: productID,
                    productImages: images,
                    variations: variations,
                });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.log("AdminController.js - editProduct() Error: ", error);
        }
    },

    /** 
        ` Handles the GET request to display the register product page, which is 
        only accessible to admins. If the user is authorized as an admin, it 
        retrieves the bottom-most categories and renders 'registerProduct.ejs'. 
        Otherwise, it redirects to the homepage.
    */
    getRegisterProduct: async (req, res) => {
        if (req.session.authorized && req.session.userRole == "admin") {
            const { categories } = await Product.getBottomMostCategories();
            res.status(200).render("./admin/registerProduct.ejs", {
                categories: categories,
            });
        } else {
            res.redirect("/");
        }
    },

    // - Creates the product
    postRegisterProduct: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if (true) {
            const { name, description, price, categoryID } = req.body;
            const result = await Product.createProduct(
                name,
                description,
                price,
                categoryID
            );

            if (result.status == 201) {
                return res.status(201).json({
                    message: "Product created",
                    productID: result.productID,
                });
            } else {
                return res.status(500).json({ message: "Product not created" });
            }
        } else {
            res.redirect("/");
        }
    },

    // - Creates the product
    createProductVariations: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if (true) {
            const { productID, variations } = req.body;
            const errorMessages = [];

            for (const variation of variations) {
                const { name, color, stock } = variation;
                const result = await Variation.createVariation(
                    productID,
                    name,
                    color,
                    stock
                );

                if (result.status !== 201) {
                    errorMessages.push(`${name}`);
                }
            }

            if (errorMessages.length === 0) {
                return res
                    .status(201)
                    .json({ message: "All variations created" });
            } else {
                return res.status(500).json({
                    message: "Some variations are not created",
                    errors: errorMessages,
                });
            }
        } else {
            res.redirect("/");
        }
    },

    deleteProduct: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        if (true) {
            const { productID } = req.body;
            const result = await Product.deleteProduct(productID);
            if (result.status == 201) {
                return res.status(201).json({ message: "Product deleted" });
            } else {
                return res.status(500).json({ message: "Product not deleted" });
            }
        }
    },

    updateProduct: async (req, res) => {
        if (req.session.authorized && req.session.userRole == "admin") {
            // if( true ) {
            const product = req.body;
            const response = await Product.updateProduct(product);
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            return res.status(500).json({ message: "Product not updated" });
        }
    },

    uploadTemporaryImage: async (req, res) => {
        try {
            if (req.file) {
                const userID = req.session.userID;
                const originalName = req.file.originalname;
                const fileName = req.file.filename;
                const destination = req.file.destination;
                const filePath =
                    destination.replace("public/", "/") + "/" + fileName;
                const image = {
                    userID,
                    originalName,
                    fileName,
                    destination,
                    filePath,
                };
                return res
                    .status(200)
                    .json({ message: "Image uploaded", image: image });
            } else {
                return res.status(404).send("File not found.");
            }
        } catch (error) {
            console.log("Error: File upload failed", error);
            res.status(500).send("File upload failed: " + error);
        }
    },

    uploadImageReference: async (req, res) => {
        // if( req.session.authorized && req.session.userRole == 'admin' ) {
        try {
            if (req.body.imageDetails) {
                const { imageDetails } = req.body;
                const errorMessages = [];
                const uploadedImagesID = [];

                console.log(imageDetails);
                for (const imageDetail of imageDetails) {
                    // - Change path from temporary to product
                    const {
                        userID,
                        originalName,
                        fileName,
                        destination,
                        filePath,
                    } = imageDetail;
                    const newDestination = destination.replace(
                        "/temporary",
                        "/products"
                    );
                    const newFilePath = filePath.replace(
                        "/temporary",
                        "/products"
                    );

                    // - Move image from temporary to product
                    const sourcePath = filePath.replace(
                        "/upload",
                        "./public/upload"
                    );
                    const destinationPath = newFilePath.replace(
                        "/upload",
                        "./public/upload"
                    );
                    fse.move(sourcePath, destinationPath);

                    // - Add path to database
                    const result = await Image.uploadImage(
                        userID,
                        originalName,
                        fileName,
                        newDestination,
                        newFilePath
                    );

                    if (result.status === 200) {
                        uploadedImagesID.push(result.imageID);
                    } else {
                        errorMessages.push(`${originalName}`);
                    }
                }

                if (errorMessages.length == 0) {
                    return res.status(200).json({
                        message: "All images uploaded",
                        imagesID: uploadedImagesID,
                    });
                } else {
                    return res.status(500).json({
                        message: "Some images are not created",
                        errors: errorMessages,
                        imageDetails: imageUploaded,
                    });
                }
            } else {
                return res.status(404).send("Files not found.");
            }
        } catch (error) {
            console.log("Error: File upload failed", error);
            res.status(500).send("File upload failed: " + error);
        }
    },

    createProductImage: async (req, res) => {
        try {
            // if( req.session.authorized && req.session.userRole == 'admin' ) {
            if (true) {
                const { productID, imagesID } = req.body;
                const errorMessages = [];

                for (const imageID of imagesID) {
                    const result = await Image.createProductImage(
                        productID,
                        imageID
                    );

                    if (result.status !== 201) {
                        errorMessages.push(`${imageID}`);
                    }
                }

                if (errorMessages.length === 0) {
                    return res
                        .status(201)
                        .json({ message: "All product images created" });
                } else {
                    return res.status(500).json({
                        message: "Some product images are not created",
                        errors: errorMessages,
                    });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.log("Error: Create product image failed");
            res.status(500).send("Create product image error: " + error);
        }
    },

    deleteProductImage: async (req, res) => {
        try {
        } catch (error) {}
    },
};

module.exports = AdminController;
