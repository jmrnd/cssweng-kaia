/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const productContainers = document.getElementById('product-containers');

/***********************************************
                  PRODUCT ITEMS                   
***********************************************/
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log( parseWishlist );


    } catch( error ) {
        console.log( "inventory.js DOMContentLoaded error: " + error );
    }
});

function parseWishlist() {
    return JSON.parse(wishlist);
}


function generateProductItem( product ) {
    const { productName, productDescription, price } = product;
    const {  productID, categoryID, imageID, filePath } = product;

    const productContainer = document.createElement('div');
    productContainer.className = 'product-container';
    productContainer.innerHTML = `
        <div class = "product-item">
            <div class = "image-container">
                <img src = "${filePath}" class = "item-icon">
                <span class = "product-name"> ${productName} </span> 
            </div>
            <span class = "product-stock"> Stock </span> 
            <span class = "product-price"> ${productPrice} </span> 
            <div>
                <span class = "add-to-cart-button"> Add to Cart </span>
            </div>
        </div>
    `;
    return productContainer;
}


/*
    <div class = "product-container">
        <div class = "product-item">
            <div class = "image-container">
                <img src = "images/kaia/maya_top_1.jpg" class = "item-icon">
                <span class = "product-name"> Name </span> 
            </div>
            <span class = "product-stock"> Stock </span> 
            <span class = "product-price"> Price </span> 
            <div>
                <span class = "add-to-cart-button"> Add to Cart </span>
            </div>
        </div>
    </div>

*/