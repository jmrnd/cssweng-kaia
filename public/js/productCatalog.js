/*
    - Have a default category selected
    - Get the category id
    - Display products if category id matches

*/
const categoryButtons = document.querySelectorAll('category-header-button');
const productGrid = document.getElementById('product-grid');

document.addEventListener('DOMContentLoaded', () => {

    let parsedProducts;
    if( products !== null ) {
        parsedProducts = JSON.parse(products);
    }    

    parsedProducts.forEach((product) => {
        generateProductItem(product);
    })



    /*
    categoryButtons.forEach((categoryButton) => {
        console.log( "BUTTON WAS CLICKED!" );
    
        let parsedProducts;
        if( products !== null ) {
            parsedProducts = JSON.parse(products);
        }    
    
        categoryButton.addEventListener( 'click', async function(e) {
            try {
                const categoryID = categoryButton.getAttribute('data-id');
                if( parsedProducts !== null ) {
                    parsedProducts.forEach((product) => {
                        if( product.categoryID == categoryID ) {
                            generateProductItem(product);
                        }
                    });
                }
            } catch( error ) {
                console.error( "An error occured: ", error );
            }
        });
    });
    */
});


function generateProductItem( product ) {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';

    // - Image 
    const anchor = document.createElement('a');
    anchor.innerHTML = `
        <img src = "/images/kaia/iris_linen_top_1.jpg">
    `;

    // - Product details
    const productDetails = document.createElement('div');
    productDetails.className = 'product-details';

    // - Product details inner
    const productDetailsInner = document.createElement('div');
    productDetailsInner.className = 'product-details-inner';
    productDetailsInner.innerHTML = `
        <span class = "product-name">
            <a href = "#" class = "link-unstyled"> ${product.productName} </a>
        </span>
        <span class = "product-price"> 
            PHP 
            <span>${product.price} </span>  
        </span>
    `

    productDetails.appendChild(productDetailsInner);
    productItem.appendChild(anchor);
    productItem.appendChild(productDetails);
    productGrid.appendChild(productItem);
}

function filterProducts(query) {
    return products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );
}
