const productContainers = document.getElementById('product-containers');
const categoryDropdown = document.getElementById('category-dropdown');
const searchBar = document.getElementById('search-bar');

/*
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through the
    products properly.
*/
function parseProducts() {
    return JSON.parse(products);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        filterAndGenerateProducts();        
    } catch( error ) {
        console.log( "inventory.js DOMContentLoaded error: " + error );
    }
});



// - Function to filter and generate product items
function filterAndGenerateProducts() {
    try {
        productContainers.innerHTML = '';
        const query = searchBar.value.trim().toLowerCase();
        const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
        const categoryID = selectedOption.getAttribute('data-id');
        const categoryName = selectedOption.getAttribute('data-name'); 
    
        parseProducts().forEach((product) => {
            const isIncluded = product.productName.toLowerCase().includes(query);
            const isSameCategory = product.categoryID == categoryID;
            const isCategoryAll = categoryName === 'all';
            const isQueryEmpty = query === '';
    
            console.log( categoryName );
            console.log( "isCategoryAll " + isCategoryAll );
            console.log( "isQueryEmpty " + isQueryEmpty );
    
            if( isIncluded && (isSameCategory || isCategoryAll)) {
                generateProductItem(product);
            } else if( isCategoryAll && (isIncluded || isQueryEmpty)) {
                generateProductItem(product);
            } else if( !isCategoryAll && isIncluded && isSameCategory ) {
                generateProductItem(product);
            } else if( isCategoryAll && isQueryEmpty ) {
                generateProductItem(product);
            }
        });
    } catch( error ) {
        console.log( "filterAndGenerateProducts() error: " + error );
    }
}

function generateProductItem( product ) {
    const productContainer = document.createElement('div');
    productContainer.className = 'product-container';

    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    /*
    productItem.innerHTML = `
        <span> [#${product.productID}] </span>
        <span>Name: ${product.productName} | </span>
        <span>Price: $${product.price} | </span>
        <span>Stock: ${product.stockQuantity} | </span>
    `;
    */

    const productIcon = document.createElement('div');
    productIcon.className = 'item-icon-col';
    productIcon.innerHTML = `
        <img src = "images/kaia/maya_top_1.jpg" class = "item-icon">
    `;
    
    const productName = document.createElement('div');
    productName.className = 'item-name';
    productName.textContent =  `${product.productName}`;

    productItem.appendChild(productIcon);
    productItem.appendChild(productName);
    productContainers.appendChild(productItem);
}

function filterProducts(query) {
    return products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );
}

categoryDropdown.addEventListener('change', filterAndGenerateProducts);
searchBar.addEventListener('input', filterAndGenerateProducts);