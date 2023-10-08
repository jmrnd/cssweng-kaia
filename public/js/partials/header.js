const container = document.querySelector('.header-buttons');
const buttons = document.querySelectorAll('button.header');
const popups = document.querySelectorAll('.popup');

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
const logoutButton = document.getElementById('logout-button');
logoutButton?.addEventListener( 'click', async function(e) {
    e.preventDefault();
    try {
        const response = await fetch( 'logout', {
            METHOD: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if( response.status === 200 ) {
            window.location.href = "/";
        } else if( response.status === 500 ) {
            console.error( "An error occured: ", error );
        }
    } catch( error ) {
        console.error( "An error occured: ", error );
    }
});
