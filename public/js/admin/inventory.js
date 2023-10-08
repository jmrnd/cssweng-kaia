const productContainers = document.getElementById('product-containers');

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
        const categoryDropdown = document.getElementById('category-dropdown');
        const searchBar = document.getElementById('search-bar');
        const productContainers = document.getElementById('product-containers');

        // - Function to filter and generate product items
        function filterAndGenerateProducts() {
            productContainers.innerHTML = '';
            const query = searchBar.value.trim().toLowerCase();
            const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
            const categoryID = selectedOption.getAttribute('data-id');
            const categoryName = selectedOption.textContent; // Use textContent

            parseProducts().forEach((product) => {
                const isIncluded = product.productName.toLowerCase().includes(query);
                const isSameCategory = product.categoryID == categoryID;
                const isCategoryAll = categoryName === 'all';
                const isQueryEmpty = query === '';

                if( isIncluded && (isSameCategory || isCategoryAll)) {
                    generateProductItem(product);
                } else if( isCategoryAll && (isIncluded || isQueryEmpty)) {
                    generateProductItem(product);
                } else if( !isCategoryAll && isIncluded && isSameCategory ) {
                    generateProductItem(product);
                }
            });
        }

        // - Event listeners 
        categoryDropdown.addEventListener('change', filterAndGenerateProducts);
        searchBar.addEventListener('input', filterAndGenerateProducts);
    } catch( error ) {
        console.log("inventory.js DOMContentLoaded error: " + error.message);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    try {

        /***********************************************
                      FILTER BY CATEGORY          
        ***********************************************/
        const categoryDropdown = document.getElementById('category-dropdown');
    
        categoryDropdown.addEventListener('change', () => {
            // - Retrieve the selected category name and ID
            const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
            const categoryID = selectedOption.getAttribute('data-id');
            const categoryName = categoryDropdown.value;
            productContainers.innerHTML = '';

            // - Get search bar value
            const searchBar = document.getElementById('search-bar');
            const query = searchBar.value.trim().toLowerCase();

            if( categoryName === 'all' ) {
                parseProducts().forEach((product) => {
                    const isIncluded = product.productName.toLowerCase().includes(query);
                    if( isIncluded || query === '' ) {
                        generateProductItem(product);
                    }
                });
            } else if( categoryName !== 'all' ) {
                parseProducts().forEach((product) => {
                    const isIncluded = product.productName.toLowerCase().includes(query);
                    const sameCategory = product.categoryID == categoryID;
                    if( isIncluded && sameCategory  ) {
                        generateProductItem(product);
                    }
                });
            }
        });
    
        /***********************************************
                      FILTER BY PRODUCT NAME          
        ***********************************************/
        const searchBar = document.getElementById('search-bar');
    
        searchBar.addEventListener('input', () => {
            productContainers.innerHTML = '';
            const query = searchBar.value.trim().toLowerCase();
            const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
            const categoryID = selectedOption.getAttribute('data-id');
            const categoryName = categoryDropdown.value;

            parseProducts().forEach((product) => {
                const isIncluded = product.productName.toLowerCase().includes(query);
                const sameCategory = product.categoryID == categoryID;

                if( isIncluded && (sameCategory || categoryName === 'all') ) {
                    generateProductItem(product);
                }
            });
        });
    } catch( error ) {
        console.log( "inventory.js DOMContentLoaded error" + error );
    }
});

function generateProductItem( product ) {
    var productItem = document.createElement('div');
    productItem.className = 'product-container';
    productItem.innerHTML = `
        <span> [#${product.productID}] </span>
        <span>Name: ${product.productName} | </span>
        <span>Price: $${product.price} | </span>
        <span>Stock: ${product.stockQuantity} | </span>
    `;

    productContainers.appendChild(productItem);
}

function filterProducts(query) {
    return products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );
}
