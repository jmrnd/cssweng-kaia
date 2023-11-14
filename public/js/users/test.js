async function updateCartContainer() {
    try {
        cartContainer.innerHTML = '';

        shoppingCartArray.forEach( async (item, index) => {
            var cartItem = generateCartItemHTML(item);

            // - Append Event Listener
            var itemRemoveCol = document.createElement('div');
            itemRemoveCol.classList.add('item-remove-col');
        
            var removeItemBtn = document.createElement('div');
            removeItemBtn.classList.add('remove-item-btn');
            removeItemBtn.setAttribute('variation-id', item.variationID);
        
            console.log( "Hi!" );
            await removeItemBtn.addEventListener('click', async () => {
                try {
                    console.log( "Hello!" );
                    /*
                    const tempVariationID = item.variationID;
                    await productToShoppingCart(tempVariationID);
                    const indexToRemove = shoppingCartArray.findIndex( cartItem => cartItem.variationID === tempVariationID);
                    console.log( "indexToRemvove: ", indexToRemove );
                    console.log( "currentIndex: ", tempVariationID );
        
                    if( indexToRemove !== -1 ) {
                        shoppingCartArray.splice(indexToRemove, 1);
                        cartContainer.removeChild(cartItem);
                    }        
                    updateCartContainer();
                    updateTotalPrice();
                    updateCartItemsNumber();
                    */
                } catch( error ) {
                    console.error( "Error during product removal:", error);
                }
            });
        
            itemRemoveCol.appendChild(removeItemBtn);
            cartItem.appendChild(itemRemoveCol);
            cartContainer.appendChild( cartItem );

            if( index !== shoppingCartArray.length - 1 ) {
                cartContainer.innerHTML += `<div class = "divider"/>`;
            }
        });
    } catch( error ) {
        console.log( "public/js/shoppingCart.js updateCartContainer() Error:", error );
    }
}