CREATE DATABASE `kaiadb`;
USE `kaiadb`;

-- Users table
CREATE TABLE IF NOT EXISTS users(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
CREATE TRIGGER afterUserInsert
AFTER INSERT ON users FOR EACH ROW
BEGIN
  INSERT INTO userRoles( userID, roleID )
  VALUES( NEW.userID, 1 ); -- Assuming 'guest' has roleID = 1
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

-- Products table
CREATE TABLE IF NOT EXISTS products(
    productID INT PRIMARY KEY AUTO_INCREMENT,
	productName VARCHAR(255) NOT NULL,
    productDescription TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT DEFAULT 0 NOT NULL,
    categoryID INT DEFAULT NULL,
	FOREIGN KEY (categoryID) REFERENCES productCategories(categoryID)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist(
	userID INT,
    productID INT,
	dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (productID) REFERENCES products(productID)
);

-- Shopping Cart table
CREATE TABLE IF NOT EXISTS shoppingCart (
	userID INT,
	productID INT,
	quantity INT,
    dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (productID) REFERENCES products(productID)
);

CREATE TABLE IF NOT EXISTS productImages (
  imageID INT PRIMARY KEY AUTO_INCREMENT,
  productID INT,
  imageFileName VARCHAR(255) NOT NULL,
  FOREIGN KEY (productID) REFERENCES products(productID)
    ON DELETE CASCADE  -- Cascade delete if a product is deleted
    ON UPDATE CASCADE  -- Cascade update if a product's ID changes
);


-- Product Image table
CREATE TABLE IF NOT EXISTS wishlist(
	userID INT,
    productID INT,
	dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (productID) REFERENCES products(productID)
);