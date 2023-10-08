/*|*******************************************************

               LOGIN AND REGISTER FORM DISPLAY

*********************************************************/
const loginSwitch = document.querySelector(".switch-container-button.login");
const registerSwitch = document.querySelector(".switch-container-button.register");
const insertContent = document.querySelector(".content-container");
const errorBox = document.getElementById('error-box');
const registerFormContainer = document.getElementById("register-form-container");
const loginFormContainer = document.getElementById("login-form-container");


loginSwitch.addEventListener("click", function (e){
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    loginSwitch.classList.add("focus");
    errorBox.textContent = '';
    errorBox.style.display = 'none';
});

registerSwitch.addEventListener("click", function (e){
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
    loginSwitch.classList.remove("focus");
    registerSwitch.classList.add("focus");
    errorBox.textContent = '';
    errorBox.style.display = 'none';
});

/*|*******************************************************

                LOGIN INPUT AND BUTTONS

*********************************************************/
// - Login input containers and button
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const rememberBox = document.getElementById("remember-me");

rememberBox.addEventListener('change', function() {
    if( this.checked ) {
        this.value = true;
    } else {
        this.value = false;
    }
});

/** 
    ` Attaches a `click` event to `#login-button`. The code communicates
    asynchronously with the server to log in a registered student.

    If the email and password inputs match the records in the database, the
    user will be succesfully logged in. Otherwise, an error message will be
    displayed.

    If the login is succesful, the page should immediately refresh and load
    the student's dashboard. Otherwise, the user will stay on the page and
    an error message will be shown.
*/
loginButton?.addEventListener( "click", async function(e) {
    e.preventDefault();
    try {
        // - Store login form data in JSON format
        const loginData = {
            email: loginEmail.value,
            password: loginPassword.value,
            rememberMe: rememberBox.value
        }

        console.log( areInputFieldsFilled('login-form-container') );

        if( !areInputFieldsFilled('login-form-container') ) {
            errorBox.style.display = 'block';
            errorBox.textContent = 'Missing email or password';
            return false;
        }

        const response = await fetch( '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( loginData )
        });

        // - On success, go to dashboard
        if( response.status == 201 ) {
            window.location.href = "/homepage";
        } else {
            errorBox.style.display = 'block';
            switch( response.status ) {
                case 401: {
                    errorBox.textContent = 'Invalid credentials';
                } break;
                case 500: {
                    errorBox.textContent = 'Internal server error';
                }
            }
        }
    } catch( error ) {
        console.log( error );
    }
});


/*|*******************************************************

                REGISTER INPUT AND BUTTONS

*********************************************************/
// - Register input containers and buttons
const registerFirstName = document.getElementById("register-first-name");
const registerLastName = document.getElementById("register-last-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");

/** 
    ` Attaches a `click` event to `#register-button`. The code communicates
    asynchronously with the server to register a new student to the database.

    As long as the email and student ID number does not yet exist in the database,
    the student will be succesfully registered. Otherwise, it will send an error.

    If the student was succesfully registered the page should immediately refresh,
    displaying the login form once again. Otherwise, prompt stay on the page and
    display the error.
*/
registerButton?.addEventListener( "click", async function(e) {
    e.preventDefault();
    try {
        // - Store registration form data in JSON format
        const registrationData = {
            name: {
                firstName: registerFirstName.value,
                lastName: registerLastName.value 
            },
            email: registerEmail.value, 
            password: registerPassword.value
        }

        if( !areInputFieldsFilled("register-form-container") ) {
            errorBox.style.display = 'block';
            errorBox.textContent = 'Some input fields are missing';
            return false;
        }

        // - Send registration data to the server
        const response = await fetch( 'register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( registrationData )
        });

        // - On success, refresh the loging page
        if( response.ok ) {
            alert( "Registration successful" ); 
            location.reload();
        } else {
            errorBox.style.display = 'block';
            switch( response.status ) {
                case 400: {
                    errorBox.textContent = 'This is email is already registered';
                } break;
                case 500: {
                    errorBox.textContent = 'Internal server error';
                }
            }
        }
    } catch( error ) {
        console.log( error );    
    }
});

/** 
    ` Checks if the input contains only letters and spaces. 
*/
function isTextOnly( input ) {
    const regex = /^[A-Za-z ]+$/;
    return regex.test(input);
}

/** 
    ` Checks if all input fields within a given form are filled.
*/
function areInputFieldsFilled( formId ) {
    // - Get all the input elements within the form
    const inputElements = document.querySelectorAll(`#${formId} input`);

    // - Loop through each input element and check if it has a value
    for( const inputElement of inputElements ) {
        if( !inputElement.value ) {
            return 0; 
        }
    }
    return 1; 
}