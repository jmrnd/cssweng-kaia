function parseWishlist() {
    return JSON.parse(wishlist);
}

/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const productContainers = document.getElementById('product-containers');
const wishlistItems = document.getElementById('wishlist-items');

/***********************************************
                  PRODUCT ITEMS                   
***********************************************/
document.addEventListener('DOMContentLoaded', () => {
    try {
        generateProductContainers();
    } catch( error ) {
        console.log( "wishlist error", error );
    }
});

function generateProductContainers() {
    const parsedWishlist = parseWishlist();

    wishlistItems.textContent = `${parsedWishlist.length} Item(s)`;

    for( const product of parsedWishlist ) {
        generateProductItem(product);
    }
}

function generateProductItem( product ) {
    const { productName, price, stockQuantity } = product;
    const { productID, categoryID, imageID, filePath } = product;

    const productContainer = document.createElement('div');
    productContainer.className = 'product-container';
    productContainer.innerHTML = `
        <div class = "product-item">
            <div class = "image-container">
                <img src = "${filePath}" class = "item-icon">
                <span class = "product-name"> ${productName} </span> 
            </div>
            <span class = "product-stock"> Stock: ${stockQuantity} </span> 
            <span class = "product-price"> PHP ${price} </span> 
            <div>
                <span class = "add-to-cart-button"> Add to Cart </span>
            </div>
        </div>
    `;
    
    productContainers.appendChild(productContainer);
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