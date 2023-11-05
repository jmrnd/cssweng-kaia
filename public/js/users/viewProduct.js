const wishlistButton = document.getElementById('wishlist-button');

wishlistButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        console.log( "Hello!" );
        const wishlistStatus = await fetch('/wishlistProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productID: productID })
        });
        console.log( "Hello!" );
    } catch( error ) {
        console.log( error );
    }
});

function parseProducts() {
    return JSON.parse(product);
}

document.addEventListener("DOMContentLoaded", function() {
    console.log( "products", parseProducts().filePath );

    if( parseProducts().filePath ) {
        var temporaryDiv = document.querySelector(".image");
        temporaryDiv.style.backgroundImage = `url("${parseProducts().filePath}")`;
        temporaryDiv.style.backgroundSize = "cover"; // You can adjust this property as needed
    }
});