/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const pathCategory = document.getElementById("path-category");
const feedbackText = document.getElementById("feedback-text");

// - Product
const wishlistButton = document.getElementById("wishlist-button");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");
const numberContainer = document.getElementById("number-container"); // stock quantity

/*
    productItem.addEventListener('click', async function(e) {
        try {
            const response = await fetch( `/viewProductAdmin?productID=${product.productID}`, {
                method: 'GET'
            });

            if( response.status === 200 ) {
                window.location.href = `/viewProductAdmin?productID=${product.productID}`;
            } else {
                console.log( "Request failed!" );
            }
        } catch( error ) {
            console.log( error );
        }
    });   

*/

// - Images
const leftSection = document.getElementById("left-section");
const largeImageContainer = document.getElementById("large-image-container");
const smallImageSection = document.getElementById("small-image-section");

// - Variations
const variationNameLabel = document.getElementById("variation-name");
const variationStockLabel = document.getElementById("variation-stocks");
const variationColorContainer = document.getElementById(
    "variation-color-container"
);

/***********************************************
                   VARIABLES                   
***********************************************/
var imagesArray = [];
var imageIndex = 0;

var variationsArray = [];
var variationIndex = 0;

var selectedQuantity = 1;

/***********************************************
                 FETCH REQUESTS             
***********************************************/
async function fetchPost(URL, formData) {
    var response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return response;
}

/** 
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through an
    object retrieved from a fetch request properly.
*/
function parseObject(object) {
    return JSON.parse(object);
}

/***********************************************
              DOM CONTENT LOADED             
***********************************************/
/**
    ` This function filters and displays products based on the selected
    category. By default, the selected category is the very first category,
    i.e., the category with the lowest categoryID.
*/
document.addEventListener("DOMContentLoaded", () => {
    try {
        generateImages();
        generateVariations();
    } catch (error) {
        console.log(error);
    }
});

/***********************************************
                    IMAGES            
***********************************************/
function generateImages() {
    try {
        imagesArray = parseObject(productImages);

        updateLargeImage(imagesArray[imageIndex].filePath);

        for (let i = 0; i < imagesArray.length; i++) {
            const smallImageContainer = document.createElement("div");
            smallImageContainer.className = "small-image-container";
            smallImageContainer.imageIndex = i;

            const smallImage = document.createElement("img");
            smallImage.className = "small-image";
            smallImage.src = `${imagesArray[i].filePath}`;

            const largeImageURL = imagesArray[i].filePath;

            smallImageContainer.addEventListener("click", function () {
                updateLargeImage(largeImageURL);
                imageIndex = smallImageContainer.imageIndex;
                updateImageHighlight(imageIndex);
            });

            smallImageContainer.appendChild(smallImage);
            smallImageSection.appendChild(smallImageContainer);
        }
        updateImageHighlight(imageIndex);
    } catch (error) {
        console.log(error);
    }
}

function updateLargeImage(filePath) {
    largeImageContainer.innerHTML = `
        <img class = "large-image" src = "${filePath}">
    `;
}

function moveImage(value) {
    const isWithinLowerBounds = imageIndex + value >= 0;
    const isWithinUpperBounds = imageIndex + value < imagesArray.length;

    if (isWithinLowerBounds && isWithinUpperBounds) {
        imageIndex += value;
        updateLargeImage(imagesArray[imageIndex].filePath);
        updateImageHighlight(imageIndex);
    }
}

function updateImageHighlight(imageIndex) {
    const smallImageContainers = document.querySelectorAll(
        ".small-image-container"
    );
    smallImageContainers.forEach((imageContainer) => {
        imageContainer.classList.remove("selected-image");
        if (imageContainer.imageIndex == imageIndex) {
            imageContainer.classList.add("selected-image");
        }
    });
}

/***********************************************
                  VARIATIONS            
***********************************************/
function generateVariations() {
    try {
        variationsArray = parseObject(variations);
        console.log(variationsArray);
        for (let i = 0; i < variationsArray.length; i++) {
            const colorButton = document.createElement("button");
            colorButton.className = "color-button";
            colorButton.style.backgroundColor = `${variationsArray[i].hexColor}`;
            colorButton.style.variationID = `${variationsArray[i].variationID}`;
<<<<<<< Updated upstream
            colorButton.setAttribute("variation-index", i);

=======
            colorButton.setAttribute( 'variation-index', i );
            
>>>>>>> Stashed changes
            const variationName = variationsArray[i].variationName;
            const stockQuantity = variationsArray[i].stockQuantity;

            if (i == 0) {
                updateColorHighlight(colorButton);
            }

            colorButton.addEventListener("click", function () {
                updateVariationName(variationName);
                updateVariationStocks(stockQuantity);
                variationIndex = colorButton.getAttribute("variation-index");
                console.log(variationIndex);
                selectedQuantity = 1;
                updateQuantity(selectedQuantity);
                updateColorHighlight(colorButton);
            });
            variationColorContainer.appendChild(colorButton);
        }

        var currentName = variationsArray[variationIndex].variationName;
        var currentStock = variationsArray[variationIndex].stockQuantity;
        updateVariationName(currentName, currentHex);
        updateVariationStocks(currentStock);
    } catch (error) {
        console.log(error);
    }
}

function updateVariationName(variationName) {
    variationNameLabel.textContent = `${variationName}`;
}

function updateVariationStocks(stockQuantity) {
    variationStockLabel.textContent = `${stockQuantity}`;
}

function updateColorHighlight(currentButton) {
    const colorButtons = document.querySelectorAll(".color-button");
    colorButtons.forEach((button) => button.classList.remove("selected-color"));
    currentButton.classList.add("selected-color");
}

/***********************************************
                  QUANTITY             
***********************************************/
function selectQuantity(value) {
    const selectedVariation = variationsArray[variationIndex];
    const isWithinLowerBounds = selectedQuantity + value > 0;
    const isWithinUpperBounds =
        selectedQuantity + value <= selectedVariation.stockQuantity;

    if (isWithinLowerBounds && isWithinUpperBounds) {
        selectedQuantity += value;
        updateQuantity(selectedQuantity);
    }
}

function updateQuantity(selectedQuantity) {
    numberContainer.value = selectedQuantity;
    numberContainer.textContent = selectedQuantity;
}

/***********************************************
                DELETE BUTTON                   
***********************************************/
deleteButton.addEventListener("click", async function (e) {
    try {
        var modal = createConfirmationPopup();
        modal.classList.add("active");
    } catch (error) {
        console.log(error);
    }
});

function createConfirmationPopup() {
    // - Overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");

    overlay.addEventListener("click", () => {
        modal.classList.remove("active");
        overlay.classList.remove("active");
    });

    // - Modal
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute("id", "modal");

    // - Modal Header
    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalHeader.innerHTML = `
        <div class = "title"> Delete </div>
    `;

    // - Close Button
    const closeButton = document.createElement("button");
    closeButton.setAttribute("data-close-button", "");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";

    closeButton.addEventListener("click", () => {
        modal.classList.remove("active");
        overlay.classList.remove("active");
    });

    // - Modal Body
    var tempProductName = parseObject(product).productName;
    console.log(tempProductName);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    modalBody.innerHTML = `Are you sure you want to delete ${tempProductName}?
        This process cannot be undone.
    `;

    const confirmationContainer = document.createElement("div");
    confirmationContainer.classList.add("confirmation-container");

    const cancelButton = document.createElement("div");
    cancelButton.classList.add("confirm-button");
    cancelButton.innerHTML = "cancel";
    cancelButton.addEventListener("click", () => {
        modal.classList.remove("active");
        overlay.classList.remove("active");
    });

    const confirmButton = document.createElement("div");
    confirmButton.classList.add("confirm-button");
    confirmButton.setAttribute("id", "confirm");
    confirmButton.innerHTML = "confirm";
    confirmButton.addEventListener("click", () => {
        deleteProduct(product);
        modal.classList.remove("active");
        overlay.classList.remove("active");
    });

    modalHeader.appendChild(closeButton);
    confirmationContainer.appendChild(cancelButton);
    confirmationContainer.appendChild(confirmButton);
    modalBody.appendChild(confirmationContainer);
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    overlay.classList.add("active");
    modal.classList.add("active");

    return modal;
}

async function deleteProduct(product) {
    try {
        const response = await fetch("deleteProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: product,
        });

        if (response.status == 201) {
            window.location.href = "/inventory";
        } else {
            switch (response.status) {
                case 404:
                    {
                        feedbackText.textContent = "Product not found";
                    }
                    break;
                case 500: {
                    feedbackText.textContent = "Internal server error";
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteProduct(product) {
    try {
        const response = await fetch("deleteProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: product,
        });

        if (response.status == 201) {
            window.location.href = "/inventory";
        } else {
            switch (response.status) {
                case 404:
                    {
                        feedbackText.textContent = "Product not found";
                    }
                    break;
                case 500: {
                    feedbackText.textContent = "Internal server error";
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

/***********************************************
                  EDIT BUTTON                   
***********************************************/
editButton.addEventListener("click", async function (e) {
    try {
        const parsedProductID = parseObject(productID);
        console.log(parsedProductID);

        const response = await fetch(
            `/editProduct?productID=${parsedProductID}`,
            {
                method: "GET",
            }
        );

        if (response.status === 200) {
            window.location.href = `/editProduct?productID=${parsedProductID}`;
        } else {
            console.log("Request failed!");
        }
    } catch (error) {
        console.log(error);
    }
});

/*
document.addEventListener("DOMContentLoaded", function() {
    if( parseObject(product).filePath ) {
        var temporaryDiv = document.querySelector(".image");
        temporaryDiv.style.backgroundImage = `url("${parseObject(product).filePath }")`;
        temporaryDiv.style.backgroundSize = "cover"; // You can adjust this property as needed
    }
});
*/
