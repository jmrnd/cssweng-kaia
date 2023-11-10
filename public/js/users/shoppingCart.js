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

        shoppingCartArray.forEach( item => {
            const cartItemHTML = generateCartItemHTML(item);
            cartContainer.innerHTML += cartItemHTML;
        });
    } catch( error ) {
        console.log( "public/js/shoppingCart.js updateCartContainer() Error:", error );
    }
}

function generateCartItemHTML( item ) {
    return `
        <div class="cart-item">
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
                PHP ${item.price}
            </div>
            <div class="item-remove-col">
                <div class="remove-item-btn"> </div>
            </div>
        </div>
    `;
}

function updateCartItemsNumber() {
    cartItemsNumber.textContent = `${shoppingCartArray.length} item(s)`;
}

function updateTotalPrice() {
    totalPrice = 0;
    shoppingCartArray.forEach( item => {
        totalPrice += parseFloat(item.price);
    });

    cartTotalPrice.innerHTML = `TOTAL: PHP ${totalPrice}`;
}