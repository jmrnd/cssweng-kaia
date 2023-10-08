/*
    - Have a default category selected
    - Get the category id
    - Display products if category id matches

*/
const productGrid = document.getElementById('product-grid');

let parsedProducts;
if( products !== null ) {
    parsedProducts = JSON.parse(products);
}    

document.addEventListener('DOMContentLoaded', () => {
    try {
        parsedProducts.forEach((product) => {
            if( product.categoryID == selectedCategory ) {
                generateProductItem(product);
            }
        });


    } catch( error ) {
        console.log( error );
    }
});

const categoryLinks = document.querySelectorAll('.category-link');
try {
    categoryLinks.forEach( (categoryLink) => {
        categoryLink.addEventListener('click', (e) => {
    
            e.preventDefault();
            selectedCategory = categoryLink.getAttribute('data-id');
            productGrid.innerHTML = '';
    
            parsedProducts.forEach((product) => {
                if( product.categoryID == selectedCategory ) {
                    generateProductItem(product);
                }
            });
        })
    });
} catch( error ) {
    console.log( error );
}

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