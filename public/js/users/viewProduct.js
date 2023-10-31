const wishlistButton = document.getElementById('wishlist-button');

wishlistButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        console.log( "WISHLIST BUTTON WAS CLICKED!" );

        /*
            1. Fetch request to add the productID to wishlist
            2. Create a query to add product to the user's wishlist
            - If successful, return status code 400         
        */
       // - create a new wishlist table using the userID and productID
       // - add error handling when a user isn't logged in
       // - if they aren't logged in, add a pop-up that would prompt them to log-in
        const response = await fetch( 'wishlistProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( parseProducts() )
        });



    } catch( error ) {
        console.log( error );
    }
})

function parseProducts() {
    return JSON.parse(product);
}


document.addEventListener("DOMContentLoaded", function() {
    if( parseProducts().filePath ) {
        var temporaryDiv = document.querySelector(".image");
        temporaryDiv.style.backgroundImage = `url(${parseProducts().filePath})`;
        temporaryDiv.style.backgroundSize = "cover"; // You can adjust this property as needed
    }
});