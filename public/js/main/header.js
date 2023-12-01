const container = document.querySelector('.header-buttons');
const buttons = document.querySelectorAll('button.header');
const popups = document.querySelectorAll('.popup');
const goToWishlistButton = document.getElementById('wishlist-button');
const goToShoppingCartButton = document.getElementById('shopping-cart-button');
// const loginProfileButton = document.getElementById('login-profile-button');
const logoutButton = document.getElementById('logout-button');
const search = document.querySelector('#search-icon');
const searchBox = document.querySelector('.search-box');
const kaiaApparelLogo = document.getElementById('logo');

/*
    ` When the mouse cursor hovers on the buttons, the popup shows up.
    When the mouse cursor leaves the button, the popup disappears.   
*/
buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
        const popupName = button.getAttribute('data-popup');
        const popup = document.querySelector(`.${popupName}-popup`);
        if( popup ) {
            popup.style.visibility = 'visible';
        }
    });

    button.addEventListener('mouseleave', () => {
        const popupName = button.getAttribute('data-popup');
        const popup = document.querySelector(`.${popupName}-popup`);
        if( popup ) {
            popup.style.visibility = 'hidden';
        }
      });
});

/*
    ` When the mouse cursor hovers on the popup of a button, the popup remains.
    When the mouse cursor leaves the popup, the popup disappears.   
*/
popups.forEach((popup) => {
    popup.addEventListener('mouseenter', () => {
        popup.style.visibility = 'visible';
    });

    popup.addEventListener('mouseleave', () => {
        popup.style.visibility = 'hidden';
    });
});


// Add a click event listener to the "Logout" button.
logoutButton?.addEventListener( 'click', async function(e) {
    e.preventDefault();
    try {
        const response = await fetch( 'logout', {
            METHOD: 'GET',
            headers: { 'Content-Type': 'application/json' },    
        });

        if( response.status === 200 ) {
            window.location.href = "/login";
        } else if( response.status === 500 ) {
            console.error( "An error occured: ", error );
        }
    } catch( error ) {
        console.error( "An error occured: ", error );
    }
});


// Add a click event listener to the "Logout" button.
goToWishlistButton?.addEventListener( 'click', async function(e) {
    e.preventDefault();
    try {
        const response = await fetch( 'wishlist', {
            METHOD: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if( response.status === 200 ) {
            window.location.href = "/wishlist";
        } else if( response.status === 500 ) {
            console.error( "An error occured: ", error );
        }
    } catch( error ) {
        console.error( "An error occured: ", error );
    }
});

goToShoppingCartButton?.addEventListener( 'click', async function(e) {
    e.preventDefault();
    try {
        const response = await fetch( 'wishlist', {
            METHOD: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if( response.status === 200 ) {
            window.location.href = "/shoppingcart";
        } else if( response.status === 500 ) {
            console.error( "An error occured: ", error );
        }
    } catch( error ) {
        console.error( "An error occured: ", error );
    }
});

kaiaApparelLogo?.addEventListener( 'click', async function(e) {
    e.preventDefault();
    try {
        const response = await fetch( 'homepage', {
            METHOD: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        window.location.href = "/homepage";
    } catch( error ) {
        console.error( "An error occured: ", error );
    }
});

search.addEventListener('click', () =>{
    searchBox.classList.toggle('active');
})

function navigateTo(url) {
    window.location.href = url;
}