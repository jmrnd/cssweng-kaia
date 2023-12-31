/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const pathCategory = document.getElementById('path-category');
const wishlistButton = document.getElementById('wishlist-product-button');
const wishlistButtonIcon = document.getElementById('wishlist-button-icon');

// - Feedback Box
const feedbackBox = document.getElementById('view-product-feedback-box');

// - Product
const numberContainer = document.getElementById('number-container'); // stock quantity

// - Images
const leftSection = document.getElementById('left-section');
const largeImageContainer = document.getElementById('large-image-container');
const smallImageSection = document.getElementById('small-image-section');

// - Variations
const variationNameLabel = document.getElementById('variation-name');
const variationStockLabel = document.getElementById('variation-stocks');
const variationColorContainer = document.getElementById('variation-color-container');

// - Selected Value
const addToCartButton = document.getElementById('add-to-cart-button');

/***********************************************
                   VARIABLES                   
***********************************************/
var imagesArray = [];
var imageIndex = 0;

var variationsArray = [];
var variationIndex = 0;

var selectedQuantity = 1;
var isProductWishlisted = false;

/***********************************************
                 FETCH REQUESTS             
***********************************************/
async function fetchPost( URL, formData ) {
    try {
        var response = await fetch( URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData ),
        }); 
        return response;
    } catch( error ) {
        console.log( error );
    }
}

/** 
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through an
    object retrieved from a fetch request properly.
*/
function parseObject( object ) {
    return JSON.parse( object );
}

/***********************************************
                  ADD TO CART             
***********************************************/
addToCartButton.addEventListener( "click", async () => {
    try {
        const selectedVariation = variationsArray[variationIndex];
        var parsedProduct = parseObject( product );

        const formData = { 
            variationID: selectedVariation.variationID,
            quantity: selectedQuantity
        }

        const response = await fetchPost( '/productToShoppingCart', formData );

        // - 200 : added, 204 : removed
        if( response.status === 200 ) {
            feedbackBox.style.display = 'block';
            feedbackBox.classList.add('success'); 
            feedbackBox.classList.remove('error'); 
            feedbackBox.textContent = `${parsedProduct.productName} (${selectedVariation.variationName}) has been added to shopping cart`;
        }
        else if( response.status === 204 ) {
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('success'); 
            feedbackBox.classList.add('error'); 
            feedbackBox.textContent = `${parsedProduct.productName} (${selectedVariation.variationName}) has been removed from shopping cart`;
        } else if( response.status === 404 ) {
            await fetch('/login', { method: 'GET' });
            window.location.href = "/login";
        } else {
            feedbackBox.style.display = 'block';
            feedbackBox.textContent = 'Internal server error';
            feedbackBox.classList.remove('success'); 
            feedbackBox.classList.add('error'); 
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

/***********************************************
                    IMAGES            
***********************************************/
function generateImages() {
    imagesArray = parseObject( productImages );

    updateLargeImage( imagesArray[imageIndex].filePath );
    
    for( let i = 0; i < imagesArray.length; i++ ) {
        const smallImageContainer = document.createElement('div');
        smallImageContainer.className = "small-image-container";
        smallImageContainer.imageIndex = i;

        const smallImage = document.createElement('img');
        smallImage.className = "small-image";
        smallImage.src = `${imagesArray[i].filePath}`;

        const largeImageURL = imagesArray[i].filePath;

        smallImageContainer.addEventListener( "click", function() {
            updateLargeImage(largeImageURL);
            imageIndex = smallImageContainer.imageIndex;
            updateImageHighlight( imageIndex );
        });

        smallImageContainer.appendChild(smallImage);
        smallImageSection.appendChild(smallImageContainer);
    }
    updateImageHighlight( imageIndex );
}

function updateLargeImage( filePath ) {
    largeImageContainer.innerHTML = `
        <img class = "large-image" src = "${filePath}">
    `;
}

function moveImage( value ) {
    const isWithinLowerBounds = imageIndex + value >= 0;
    const isWithinUpperBounds = imageIndex + value < imagesArray.length;

    if( isWithinLowerBounds && isWithinUpperBounds ) {
        imageIndex += value;
        updateLargeImage( imagesArray[imageIndex].filePath ); 
        updateImageHighlight( imageIndex );
    }
}

function updateImageHighlight( imageIndex ) {
    const smallImageContainers = document.querySelectorAll(".small-image-container");
    smallImageContainers.forEach( (imageContainer) => {
        imageContainer.classList.remove( "selected-image" )
        if( imageContainer.imageIndex == imageIndex ) {
            imageContainer.classList.add( "selected-image" );
        }
    });
}

/***********************************************
                  VARIATIONS            
***********************************************/
function generateVariations() {
    variationsArray = parseObject( variations );
    console.log( variationsArray );
    for( let i = 0; i < variationsArray.length; i++ ) {

        const colorButton = document.createElement('button');
        colorButton.className = "color-button";
        colorButton.style.backgroundColor = `${variationsArray[i].hexColor}`;
        colorButton.style.variationID = `${variationsArray[i].variationID}`;
        colorButton.setAttribute( 'variation-index', i );

        const variationName = variationsArray[i].variationName;
        const stockQuantity = variationsArray[i].stockQuantity;
        const hexColor = variationsArray[i].hexColor;

        if( i == 0 ) {
            updateColorHighlight(colorButton);
        }

        colorButton.addEventListener( "click", function () {
            updateVariationName( variationName, hexColor ); 
            updateVariationStocks(stockQuantity); 
            variationIndex = colorButton.getAttribute('variation-index');
            console.log( variationIndex );
            selectedQuantity = 1;
            updateQuantity(selectedQuantity);
            updateColorHighlight(colorButton);
        });
        variationColorContainer.appendChild(colorButton);
    }

    var currentName = variationsArray[variationIndex].variationName;
    var currentStock = variationsArray[variationIndex].stockQuantity;
    updateVariationName( currentName );
    updateVariationStocks(currentStock);
}

function updateVariationName( variationName ) {
    variationNameLabel.textContent = `${variationName}`;
}

function updateVariationStocks( stockQuantity ) {
    variationStockLabel.textContent = `${stockQuantity}`;
}

function updateColorHighlight( currentButton ) {
    const colorButtons = document.querySelectorAll(".color-button");
    colorButtons.forEach( (button) => button.classList.remove("selected-color"));
    currentButton.classList.add("selected-color");
}

/***********************************************
                  QUANTITY             
***********************************************/
function selectQuantity( value ) {
    const selectedVariation = variationsArray[variationIndex]
    const isWithinLowerBounds = selectedQuantity + value > 0;
    const isWithinUpperBounds = selectedQuantity + value <= selectedVariation.stockQuantity;

    if( isWithinLowerBounds && isWithinUpperBounds ) {
        selectedQuantity += value;
        updateQuantity( selectedQuantity );
    }
}
function updateQuantity( selectedQuantity ) {
    numberContainer.value = selectedQuantity;
    numberContainer.textContent = selectedQuantity;
}

/***********************************************
              DOM CONTENT LOADED             
***********************************************/
/**
    ` This function filters and displays products based on the selected
    category. By default, the selected category is the very first category,
    i.e., the category with the lowest categoryID.
*/
document.addEventListener('DOMContentLoaded', () => {
    try {
        generatePathContainer();
        generateImages();
        generateVariations();
        isProductWishlisted = parseObject(isWishlisted);
        updateWishlistButtonIcon();
    } catch( error ) {
        console.log( error );
    }
});

function generatePathContainer() {
    try {
        const parsedProduct = parseObject(product);
        const selectedCategory = parsedProduct.categoryID;
        const productName = parsedProduct.productName;
        
        switch( selectedCategory ) {
            case 1: {
                changePathAndTitle( "Dresses", productName );
            }   break;
            case 2: {
                changePathAndTitle( "Bottoms", productName );
            }   break;
            case 3: {
                changePathAndTitle( "Tops", productName );
            }   break;
            case 4: {
                changePathAndTitle( "Coords", productName );
            }   break;
            default: break;
        }
    } catch( error ) {
        console.log( "viewProduct.js at generatePathContainer():", error );
    }
}

function changePathAndTitle( categoryName, productName ) {
    pathCategory.innerHTML = ` 
        <a class = "path-link" href = "productCatalog?category=${categoryName}"> 
            ${categoryName} COLLECTION
        </a> / ${productName}
    `
}

/***********************************************
                WISHLIST BUTTON             
***********************************************/
wishlistButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        console.log( "status: " );

        const wishlistStatus = await fetch('/wishlistProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productID: productID })
        });
        console.log( "status:2 " );

        // - 200: removed, 201: added
        const status = wishlistStatus.status;
        var parsedProduct = parseObject( product );

        console.log( "status: " );
        if( status === 200 ) {
            isProductWishlisted = !isProductWishlisted;
            updateWishlistButtonIcon();
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('success'); 
            feedbackBox.classList.add('error'); 
            feedbackBox.textContent = `${parsedProduct.productName} has been removed from wishlist`;
        } else if( status === 201 ) {
            isProductWishlisted = !isProductWishlisted;
            updateWishlistButtonIcon();
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('error'); 
            feedbackBox.classList.add('success'); 
            feedbackBox.textContent = `${parsedProduct.productName} has been added to wishlist`;
        } else if( status === 404 ) {
            await fetch('/login', {
                method: 'GET'
            });
            window.location.href = "/login";
        } else {
            feedbackBox.style.display = 'block';
            feedbackBox.textContent = 'Internal server error';
            feedbackBox.classList.remove('success'); 
            feedbackBox.classList.add('error'); 
        }
    } catch( error ) {
        console.log( error );
    }
});

function updateWishlistButtonIcon() {
    wishlistButtonIcon.classList.remove('wishlist-button', 'wishlisted-button');
    wishlistButtonIcon.classList.add( isProductWishlisted ? 'wishlisted-button' : 'wishlist-button');
}

/*
async function updateCartButtonLabel() {
    try {
        variationsArray = parseObject( variations );
        const results = [];

        for( const variation of variationsArray ) {
            const shoppingCartStatus = await fetch('/checkShoppingCartStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variationID: variation.variationID })
            });
    
            if( shoppingCartStatus.status === 200 ) {
                addToCartButton.textContent
                return;
            }
        }
    } catch( error ) {
    }
}
*/