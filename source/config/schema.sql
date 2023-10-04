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
	roleName ENUM('guest', 'customer', 'admin') NOT NULL
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

-- Products table
CREATE TABLE IF NOT EXISTS products(
    productID INT PRIMARY KEY AUTO_INCREMENT,
	productName VARCHAR(255) NOT NULL,
    productDescription TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT NOT NULL
);

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
)