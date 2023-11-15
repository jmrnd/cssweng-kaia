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
    
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
        <div class = "image-container">
            <img src = "${filePath}" class = "item-icon">
            <span class = "product-name"> ${productName} </span> 
        </div>
        <span class = "product-stock"> Stock: ${stockQuantity} </span> 
        <span class = "product-price"> PHP ${price} </span> 
    `;

    const productButtonContainer = document.createElement('div');
    productButtonContainer.setAttribute( 'product-id', productID );
    productButtonContainer.innerHTML = `<span class = "add-to-cart-button"> View Product </span>`;

    productButtonContainer.addEventListener('click', async function(e) {
        try {
            const response = await fetch( `/viewProduct?productID=${productID}`, {
                method: 'GET'
            });

            if( response.status === 200 ) {
                window.location.href = `/viewProduct?productID=${productID}`;
            } else {
                console.log( "Request failed!" );
            }
        } catch( error ) {
            console.log( error );
        }
    });  

    productItem.appendChild(productButtonContainer)
    productContainer.appendChild(productItem);
    productContainers.appendChild(productContainer);

}
