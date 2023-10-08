const productGrid = document.getElementById('product-grid');
const categoryLinks = document.querySelectorAll('.category-link');
const categoryTitle = document.getElementById('category-title');
const pathCategory = document.getElementById('path-category');


/*
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through the
    products properly.
*/
function parseProducts() {
    return JSON.parse(products);
}

/*
    ` This function filters and displays products based on the selected
    category. By default, the selected category is the very first category,
    i.e., the category with the lowest categoryID.
*/
document.addEventListener('DOMContentLoaded', () => {
    try {
        parseProducts().forEach((product) => {
            if( product.categoryID == selectedCategory ) {
                generateProductItem(product);
            }
        });
    } catch( error ) {
        console.log( error );
    }
});


/*
    ` Sets up an event listener for the category links to filter and display
    products. When a category link is clicked, it retrieves the selected 
    category ID and name. Afterwards, it updates the category path, category
    title and displays the product items for the selected category.
*/
categoryLinks.forEach((categoryLink) => {
    try {
        categoryLink.addEventListener('click', (e) => {
            e.preventDefault();
    
            selectedCategory = categoryLink.getAttribute('data-id');
            const categoryName = categoryLink.getAttribute('data-name');

            pathCategory.innerHTML = `${categoryName}`;
            productGrid.innerHTML = '';
            categoryTitle.innerHTML = `
                <span class = "category-title">${categoryName} <span>COLLECTION</span></span>
            `;
    
            parseProducts().forEach((product) => {
                if( product.categoryID == selectedCategory ) {
                    generateProductItem(product);
                }
            });
        })
    } catch( error ) {
        console.log(error);
    }
});

/*
    ` This function generates the HTML structure for a product item
    and adds it to the productGrid. It takes a single 'product' object
    as a parameter and constructs the product's display with its details.

    The expected 'product' object contains: 
        productID, productName, productDescription, 
        price, stockQuantity, categoryID
*/
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