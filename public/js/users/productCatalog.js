/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const productGrid = document.getElementById("product-grid");
const categoryLinks = document.querySelectorAll(".category-link");
const categoryTitle = document.getElementById("category-title");
const pathCategory = document.getElementById("path-category");
const productFilter = document.getElementById("product-filter");
let selectedCategoryID = 1;

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
document.addEventListener("DOMContentLoaded", () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get("category");

        switch (selectedCategory) {
            case "Dresses":
                {
                    changePathAndTitle(selectedCategory);
                    selectedCategoryID = 1;
                }
                break;
            case "Bottoms":
                {
                    changePathAndTitle(selectedCategory);
                    selectedCategoryID = 2;
                }
                break;
            case "Tops":
                {
                    changePathAndTitle(selectedCategory);
                    selectedCategoryID = 3;
                }
                break;
            case "Coords":
                {
                    changePathAndTitle(selectedCategory);
                    selectedCategoryID = 4;
                }
                break;
            default:
                break;
        }

        if (parseProducts() === null) {
            return;
        }

        parseProducts().forEach((product) => {
            if (product.categoryID == selectedCategoryID) {
                generateProductItem(product);
            }
        });
    } catch (error) {
        console.log(error);
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
        categoryLink.addEventListener("click", (e) => {
            e.preventDefault();

            selectedCategoryID = categoryLink.getAttribute("data-id");
            const categoryName = categoryLink.getAttribute("data-name");

            changePathAndTitle(categoryName);
            if (parseProducts() === null) {
                return;
            }

            parseProducts().forEach((product) => {
                if (product.categoryID == selectedCategoryID) {
                    generateProductItem(product);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});

function changePathAndTitle(categoryName) {
    pathCategory.innerHTML = `${categoryName}`;
    productGrid.innerHTML = "";
    categoryTitle.innerHTML = `
    <span class = "category-title">${categoryName} <span>COLLECTION</span></span>
    `;
}

/*
    ` This function generates the HTML structure for a product item
    and adds it to the productGrid. It takes a single 'product' object
    as a parameter and constructs the product's display with its details.

    The expected 'product' object contains: 
        productID, productName, productDescription, 
        price, stockQuantity, categoryID
*/
function generateProductItem(product) {
    const productItem = document.createElement("div");
    productItem.className = "product-item";

    // - Image
    const anchor = document.createElement("a");
    if (product.filePath) {
        anchor.innerHTML = `<img src = "${product.filePath}">`;
    } else {
        // - FIXME: Hardcoded
        switch (product.categoryID) {
            case 1:
                anchor.innerHTML = `<img src = "/images/kaia/sky_linen_dress_1.jpg">`;
                break;
            case 2:
                anchor.innerHTML = `<img src = "/images/kaia/faye_linen_shorts_10.png">`;
                break;
            case 3:
                anchor.innerHTML = `<img src = "/images/kaia/lane_top_2.jpg">`;
                break;
            case 4:
                anchor.innerHTML = `<img src = "/images/kaia/cara_linen_coordinates_10.png">`;
                break;
            default:
                anchor.innerHTML = `<img src = "/images/kaia/iris_linen_top_1.jpg">`;
                break;
        }
    }

    // - Product details
    const productDetails = document.createElement("div");
    productDetails.className = "product-details";

    // - Product details inner
    const productDetailsInner = document.createElement("div");
    productDetailsInner.className = "product-details-inner";
    productDetailsInner.innerHTML = `
        <span class = "product-name">
            <a href = "#" class = "link-unstyled"> ${product.productName} </a>
        </span>
        <span class = "product-price"> 
            PHP 
            <span>${product.price} </span>  
        </span>
    `;

    productDetails.appendChild(productDetailsInner);
    productItem.appendChild(anchor);
    productItem.appendChild(productDetails);

    // - Add event listener that clicks
    productItem.addEventListener("click", async function (e) {
        try {
            const response = await fetch(
                `/viewProduct?productID=${product.productID}`,
                {
                    method: "GET",
                }
            );

            if (response.status === 200) {
                window.location.href = `/viewProduct?productID=${product.productID}`;
            } else {
                console.log("Request failed!");
            }
        } catch (error) {
            console.log(error);
        }
    });

    productGrid.appendChild(productItem);
}

/*
    ` This function filters and displays products based on the selected
    option from the product filter dropdown. It retrieves the selected
    filter option, sorts the products accordingly, clears the existing
    product grid, and then displays the filtered products.

    The expected filter values:
        - 'filter-name-asc'   :   Sort products by name in ascending order
        - 'filter-name-desc'  :   Sort products by name in descending order
        - 'filter-price-asc'  :   Sort products by price in ascending order
        - 'filter-price-desc' :   Sort products by price in descending order
        - 'filter-all'        :   Show all products without filtering
*/
productFilter.addEventListener("change", () => {
    const selectedFilter = productFilter.value;

    // Get the products and sort them based on the selected filter
    const products = parseProducts();
    let filteredProducts = [];

    switch (selectedFilter) {
        case "filter-name-asc":
            {
                filteredProducts = products.sort((a, b) =>
                    a.productName.localeCompare(b.productName)
                );
            }
            break;
        case "filter-name-desc":
            {
                filteredProducts = products.sort((a, b) =>
                    b.productName.localeCompare(a.productName)
                );
            }
            break;
        case "filter-price-asc":
            {
                filteredProducts = products.sort((a, b) => a.price - b.price);
            }
            break;
        case "filter-price-desc":
            {
                filteredProducts = products.sort((a, b) => b.price - a.price);
            }
            break;
        default:
            {
                filteredProducts = products;
            }
            break;
    }

    // Clear the product grid
    productGrid.innerHTML = "";

    // Display the filtered products
    filteredProducts.forEach((product) => {
        if (product.categoryID == selectedCategoryID) {
            generateProductItem(product);
        }
    });
});
