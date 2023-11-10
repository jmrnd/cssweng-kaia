/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const cartContainer = document.getElementById('cart-container');
const cartItemsNumber = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('total-price');

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

            const removeItemBtn = cartContainer.querySelector(`.cart-item .remove-item-btn`);
            if( removeItemBtn ) {
                removeItemBtn.addEventListener('click', async () => {
                    await productToShoppingCart(item.variationID);
                });
            }

            if( index !== shoppingCartArray.length - 1 ) {
                cartContainer.innerHTML += `<div class = "divider"/>`;
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
    let newPrice = 0;
    newPrice = parseFloat( parseInt(item.quantity) * parseFloat(item.price)).toFixed(2);
    cartItem.innerHTML = `
        <div class="item-icon-col">
            <img src="${item.filePath}" class="item-icon" />
        </div>
        <div class="item-info-col">
            <div class="item-name">${item.productName}</div>
            <div class="item-var-details">
                <div class="item-color" style="background-color: ${item.hexColor};"> <br> </div>
            </div>
        </div>
        <div class="item-quantity-col">
            <div class="item-heading"> QUANTITY </div>
            <div class="quantity-toggle">
                <button class="qty-decrement-btn"></button>
                ${item.quantity}
                <button class="qty-increment-btn"></button>
            </div>
        </div>
        <div class="item-price-col">
            <div class="item-heading">PRICE</div>
            PHP ${newPrice}
        </div>
    `;

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
            console.log( indexToRemove );
            if( indexToRemove !== -1 ) {
                shoppingCartArray.splice(indexToRemove, 1);
                cartContainer.removeChild(cartItem);
            }        
            updateCartContainer();
            updateTotalPrice();
            updateCartItemsNumber();
        } catch( error ) {
            console.error( "Error during product removal:", error);
        }
    });

    itemRemoveCol.appendChild(removeItemBtn);
    cartItem.appendChild(itemRemoveCol);
    return cartItem;
}

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