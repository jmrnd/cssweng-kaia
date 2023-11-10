const productContainers = document.getElementById("product-container");
const categoryDropdown = document.getElementById("category-dropdown");
const searchBar = document.getElementById("search-bar");

const productsPerPage = 12;
let currentPage = 1;

/*
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through the
    products properly.
*/
function parseProducts() {
    return JSON.parse(products);
}

/*
    ` Generate products after the DOMContent loads
*/
document.addEventListener("DOMContentLoaded", () => {
    try {
        filterAndGenerateProducts();
    } catch (error) {
        console.log("inventory.js DOMContentLoaded error: " + error);
    }
});

// - Function to filter and generate product items
// - Also includes the pagination function
function filterAndGenerateProducts() {
    try {
        productContainers.innerHTML = "";
        const query = searchBar.value.trim().toLowerCase();
        const selectedOption =
            categoryDropdown.options[categoryDropdown.selectedIndex];
        const categoryID = selectedOption.getAttribute("data-id");
        const categoryName = selectedOption.getAttribute("data-name");

        const filteredProducts = parseProducts().filter((product) => {
            const isIncluded = product.productName
                .toLowerCase()
                .includes(query);
            const isSameCategory = product.categoryID == categoryID;
            const isCategoryAll = categoryName === "all";
            const isQueryEmpty = query === "";

            if (isIncluded && (isSameCategory || isCategoryAll)) {
                return true;
            } else if (isCategoryAll && (isIncluded || isQueryEmpty)) {
                return true;
            } else if (!isCategoryAll && isIncluded && isSameCategory) {
                return true;
            } else if (isCategoryAll && isQueryEmpty) {
                return true;
            } else {
                return false;
            }
        });

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;

        for (
            let i = startIndex;
            i < endIndex && i < filteredProducts.length;
            i++
        ) {
            generateProductItem(filteredProducts[i]);
        }
        addPaginationControls(filteredProducts.length);
        currentPage = 1;
    } catch (error) {
        console.log("filterAndGenerateProducts() error: " + error);
    }
}

function generateProductItem(product) {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.setAttribute("data-product-id", product.productID);

    const productIcon = document.createElement("div");
    productIcon.className = "item-icon-col";

    if (product.filePath) {
        productIcon.innerHTML = `
            <img src = "${product.filePath}" class = "item-icon">
        `;
    } else {
        productIcon.innerHTML = `
            <img src = "images/kaia/maya_top_1.jpg" class = "item-icon">
        `;
    }

    const productName = document.createElement("div");
    productName.className = "item-name";
    productName.textContent = `${product.productName}`.toUpperCase();

    productItem.appendChild(productIcon);
    productItem.appendChild(productName);

    productItem.addEventListener("click", async function (e) {
        try {
            const response = await fetch(
                `/viewProductAdmin?productID=${product.productID}`,
                {
                    method: "GET",
                }
            );

            if (response.status === 200) {
                window.location.href = `/viewProductAdmin?productID=${product.productID}`;
            } else {
                console.log("Request failed!");
            }
        } catch (error) {
            console.log(error);
        }
    });

    productContainers.appendChild(productItem);
}

function addPaginationControls(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            filterAndGenerateProducts();
        });
        paginationContainer.appendChild(pageButton);
    }
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    pagination.appendChild(paginationContainer);
}

categoryDropdown.addEventListener("change", filterAndGenerateProducts);
searchBar.addEventListener("input", filterAndGenerateProducts);

/* Filter and generate products without pagination
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
*/
