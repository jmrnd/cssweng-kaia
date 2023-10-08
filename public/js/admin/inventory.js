
const productContainers = document.getElementById('product-containers');

document.addEventListener('DOMContentLoaded', () => {
    let parsedProducts;
    if( products !== null ) {
        parsedProducts = JSON.parse(products);
    }
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

        if( parsedProducts !== null && categoryName === 'all' ) {
            parsedProducts.forEach((product) => {
                generateProductItem(product);
            });
        } else if( parsedProducts !== null && categoryName !== 'all' ) {
            parsedProducts.forEach((product) => {
                if( product.categoryID == categoryID ) {
                    generateProductItem(product);
                }
            });
        }
    });

    /***********************************************
                FILTER BY CATEGORY NAME          
    ***********************************************/
    const searchBar = document.getElementById('search-bar');

    searchBar.addEventListener('input', () => {
        productContainers.innerHTML = '';
        const query = searchBar.value.trim().toLowerCase();
        parsedProducts.forEach((product) => {
            if( product.productName.toLowerCase().includes(query) ) {
                generateProductItem(product);
            }
        });
    });
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
