CREATE DATABASE `kaiadb`;
USE `kaiadb`;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Set the auto-increment starting value and maximum value for userID
ALTER TABLE users
AUTO_INCREMENT = 10000000;

-- Roles table
CREATE TABLE IF NOT EXISTS roles(
    roleID INT PRIMARY KEY AUTO_INCREMENT,
	roleName VARCHAR(255) NOT NULL
);
INSERT INTO roles (roleName) VALUES ('guest'), ('customer'), ('admin');

-- UserRoles table 
-- intermediate table to link users to roles
CREATE TABLE IF NOT EXISTS userRoles(
    userID INT,
    roleID INT,
    PRIMARY KEY (userID, roleID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (roleID) REFERENCES roles(roleID)
);

/*
	` afterUserInsert trigger - after a new row has been added to the
    Users table, it inserts a new row into the userRoles table and gives
    the new user the lowest role, which is 'Guest' with the roleID of 1.
*/
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON users FOR EACH ROW
BEGIN
  INSERT INTO userRoles( userID, roleID )
  VALUES( NEW.userID, 2 ); -- Assuming 'customer' has roleID = 2
END;
$$ DELIMITER ;

/*
    ` productCategory table - manages product categories in a hierarchical structure. 
    It supports parent-child relationships, which allows for the creation of subcategories.
    
    For example, you can have: 
        - a top-level category "Women", 
        - a mid-level category "Tops", and
        - a low-level categories "Shirts", "Tank Tops", "Blouses"

    @TODO:
    1. Add foreign key restraints for parentCategoryID 
        - Cannot be added direclty since top-level categories would have the FK as NULL
*/
CREATE TABLE IF NOT EXISTS productCategories( 
    categoryID INT PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(255) NOT NULL,
    parentCategoryID INT,
    FOREIGN KEY (parentCategoryID) REFERENCES productCategories(categoryID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

INSERT INTO productCategories (categoryName, parentCategoryID) VALUES ('Dresses', NULL), ('Bottoms', NULL), ('Tops', NULL), ('Coords', NULL);
-- INSERT INTO productCategories (categoryName, parentCategoryID) VALUES ('Casual', 1), ('Formal', 1);
-- INSERT INTO productCategories (categoryName, parentCategoryID) VALUES ('Jeans', 2), ('Pants', 2), ('Skirts', 2), ('Shorts', 2), ('Leggings', 2);
-- INSERT INTO productCategories (categoryName, parentCategoryID) VALUES ('T-Shirts', 3), ('Blouses', 3), ('Sweaters', 3), ('Tank Tops', 3), ('Crop Tops', 3);

CREATE TABLE IF NOT EXISTS products (
    productID INT PRIMARY KEY AUTO_INCREMENT,
	categoryID INT DEFAULT NULL,
	productName VARCHAR(255) NOT NULL,
    productDescription TEXT,
    price DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (categoryID) REFERENCES productCategories(categoryID)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

-- Set the auto-increment starting value and maximum value for productID
ALTER TABLE products
AUTO_INCREMENT = 20000000;

CREATE TABLE IF NOT EXISTS productsVariation (
    variationID INT PRIMARY KEY AUTO_INCREMENT,
    productID INT NOT NULL,
    variationName VARCHAR(255) NOT NULL,
    hexColor CHAR(7) NOT NULL,
    stockQuantity INT DEFAULT 0 NOT NULL,
    FOREIGN KEY (productID) REFERENCES products(productID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Set the auto-increment starting value and maximum value for productsVariation
ALTER TABLE productsVariation
AUTO_INCREMENT = 30000000;

CREATE TABLE IF NOT EXISTS shoppingCart (
	userID INT NOT NULL,
	productID INT NOT NULL,
	quantity INT NOT NULL,
	dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (productID) REFERENCES products(productID)
);

CREATE TABLE IF NOT EXISTS wishlist (
	userID INT NOT NULL,
    productID INT NOT NULL,
	dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (productID) REFERENCES products(productID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS imageReferences (
    imageID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    originalName VARCHAR(255) NOT NULL,
	fileName VARCHAR(255) NOT NULL,
	destination VARCHAR(255) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
	dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID)
);

-- Set the auto-increment starting value and maximum value for imageReference
ALTER TABLE imageReferencesse
AUTO_INCREMENT = 90000000;

CREATE TABLE IF NOT EXISTS productImages (
    imageID INT PRIMARY KEY,
    productID INT,
	FOREIGN KEY (imageID) REFERENCES imageReferences(imageID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (productID) REFERENCES products(productID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);