
/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const cartContainer = document.getElementById('cart-container');
const cartItemsNumber = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('total-price');

// - Feedback Box
const feedbackBox = document.getElementById('shopping-cart-feedback-box');
const checkoutButton = document.getElementById('checkout-button');

/***********************************************
                    VARIABLES                   
***********************************************/
var shoppingCartArray = [];
var totalPrice = 0;

/***********************************************
                 FETCH REQUESTS             
***********************************************/
async function fetchPost( URL, formData ) {
    var response = await fetch( URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( formData ),
    }); 
    return response;
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
                DOM-CONTENT LOAD             
***********************************************/
document.addEventListener( "DOMContentLoaded", async () => {
    shoppingCartArray = parseObject( shoppingCart );
    updateCartContainer();
    updateTotalPrice();
    updateCartItemsNumber();
});

/***********************************************
                    PRODUCTS             
***********************************************/
async function updateCartContainer() {
    try {
        cartContainer.innerHTML = '';

        shoppingCartArray.forEach( (item, index) => {
            const cartItem = generateCartItemHTML(item);
            cartContainer.appendChild( cartItem );

            if( index !== shoppingCartArray.length - 1 ) {
                var divider = document.createElement('div');
                divider.classList.add('divider');
                cartContainer.appendChild(divider);
            }
        });
    } catch( error ) {
        console.log( "public/js/shoppingCart.js updateCartContainer() Error:", error );
    }
}

async function productToShoppingCart( variationID ) {
    const formData = { variationID: variationID }
    const response = await fetchPost( '/productToShoppingCart', formData );
    console.log( response.status );
}

function generateCartItemHTML( item ) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    // - product price * order count
    let newPrice = 0;
    newPrice = parseFloat( parseInt(item.quantity) * parseFloat(item.price)).toFixed(2);

    cartItem.innerHTML = `
        <div class="item-icon-col">
            <img src="${item.filePath}" class="item-icon" />
        </div>
        <div class="item-info-col">
            <div class="item-name">${item.productName}</div>
            <div> 
                <span> Variation: ${item.variationName} </span> <br>
            </div>
            <div> 
                <span> Quantity: ${item.quantity} </span> <br> 
            </div>
            <div> 
                <span> Price: ${item.price} </span> <br>
            </div>
        </div>
    `;

    const itemQuantityCol = generateItemQuantityColHTML(item);      // quantity buttons and display 
    const itemPriceCol = generateItemPriceColHTML(newPrice);        // item price display
    const itemRemoveCol = generateItemRemoveColHTML(item);          // remove item button and functionality
 
    cartItem.appendChild(itemQuantityCol);
    cartItem.appendChild(itemPriceCol);
    cartItem.appendChild(itemRemoveCol);
    return cartItem;
}

/*|*******************************************************

                    GENERATE DYNAMIC HTML 

*********************************************************/
// - Quantity buttons and order count display
function generateItemQuantityColHTML(item) {
    const itemQuantityCol = document.createElement('div');
    itemQuantityCol.classList.add('item-quantity-col');
    itemQuantityCol.innerHTML = `<div class = "item-heading"> QUANTITY </div>`;    

    const quantityToggle = document.createElement('div');
    quantityToggle.classList.add('quantity-toggle');

    /*
        1. Get variationID and current quantity
        2. Fetch post request
        3. Update the array on the current page
            - Find the index of the current item on the array
    */
    const decrementButton = document.createElement('button');
    decrementButton.classList.add('qty-decrement-btn');
    decrementButton.addEventListener('click', async () => {
        try {
            if( item.quantity - 1 > 0 ) {
                const formData = {
                    variationID: item.variationID,
                    newQuantity: item.quantity - 1,
                }
    
                const response = await fetchPost( '/updateShoppingCartItemQuantity', formData );
                if( response.status === 200 ) {
                    let selectedIndex = shoppingCartArray.findIndex( cartItem => cartItem.variationID === item.variationID );
                    if( selectedIndex !== -1 ) {
                        shoppingCartArray[selectedIndex].quantity = item.quantity - 1;
                        updateCartContainer();
                        updateTotalPrice();
                        updateCartItemsNumber();
                    }
                }
            }
        } catch( error ) {
            console.error( "Error during product removal:", error);
        }
    });

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = `${item.quantity}`;

    const incrementButton = document.createElement('button');
    incrementButton.classList.add('qty-increment-btn');
    incrementButton.addEventListener('click', async () => {
        try {
            if( item.quantity + 1 <= item.stockQuantity ) {
                const formData = {
                    variationID: item.variationID,
                    newQuantity: item.quantity + 1,
                }

                const response = await fetchPost( '/updateShoppingCartItemQuantity', formData );
                if( response.status === 200 ) {
                    let selectedIndex = shoppingCartArray.findIndex( cartItem => cartItem.variationID === item.variationID );
                    if( selectedIndex !== -1 ) {
                        shoppingCartArray[selectedIndex].quantity = item.quantity + 1;
                        updateCartContainer();
                        updateTotalPrice();
                        updateCartItemsNumber();
                    }
                }
            }
        } catch( error ) {
            console.error( "Error during product removal:", error);
        }
    });


    quantityToggle.appendChild(decrementButton);
    quantityToggle.appendChild(quantityLabel);
    quantityToggle.appendChild(incrementButton);
    itemQuantityCol.appendChild(quantityToggle);

    return itemQuantityCol;
}


// - Item price display
function generateItemPriceColHTML(price) {
    const itemPriceCol = document.createElement('div');
    itemPriceCol.classList.add('item-price-col');
    itemPriceCol.innerHTML = `<div class = "item-heading">PRICE</div> PHP ${price}`;
    return itemPriceCol;
}

// - Remove item button
function generateItemRemoveColHTML(item) {
    const itemRemoveCol = document.createElement('div');
    itemRemoveCol.classList.add('item-remove-col');

    const removeItemBtn = document.createElement('div');
    removeItemBtn.classList.add('remove-item-btn');
    removeItemBtn.setAttribute('variation-id', item.variationID);

    removeItemBtn.addEventListener('click', async () => {
        try {
            const tempVariationID = item.variationID;
            await productToShoppingCart(tempVariationID);
            const indexToRemove = shoppingCartArray.findIndex( cartItem => cartItem.variationID === tempVariationID);
            if( indexToRemove !== -1 ) {
                shoppingCartArray.splice(indexToRemove, 1);
            }        
            updateCartContainer();
            updateTotalPrice();
            updateCartItemsNumber();

            
            feedbackBox.style.display = 'block';
            feedbackBox.classList.add('error'); 
            feedbackBox.textContent = `${item.productName} (${item.variationName}) has been removed from shopping cart`;
            

        } catch( error ) {
            console.error( "Error during product removal:", error);
        }
    });

    itemRemoveCol.appendChild(removeItemBtn);
    return itemRemoveCol;
}

/*|*******************************************************

                      UPDATE DETAILS

*********************************************************/
function updateCartItemsNumber() {
    cartItemsNumber.textContent = `${shoppingCartArray.length} item(s)`;
}

function updateTotalPrice() {
    totalPrice = 0;
    shoppingCartArray.forEach( item => {
        let newPrice = item.price * item.quantity;
        totalPrice += parseFloat(newPrice);
    });

    totalPrice = totalPrice.toFixed(2);

    cartTotalPrice.innerHTML = `TOTAL: PHP ${totalPrice}`;
}

checkoutButton?.addEventListener( "click", async function(e) {
    e.preventDefault();
    try {
        window.location.href = "/checkout";
    } catch( error ) {
        console.log( error );
    }
});