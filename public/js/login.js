/*|*******************************************************

               LOGIN AND REGISTER FORM DISPLAY

*********************************************************/      
// - Get references to the form containers and links
const loginContainer = document.getElementById("login-container");
const loginLink = document.querySelector(".login-link");
const registerContainer = document.getElementById("register-container");
const registerLink = document.querySelector(".register-link");

// - Function to show the registration form and hide the login form
function showRegisterForm() {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
}

// - Function to show the login form and hide the registration form
function showLoginForm() {
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
}

// - Add click event listeners to the links
registerLink.addEventListener("click", showRegisterForm);
loginLink.addEventListener("click", showLoginForm);

/*|*******************************************************

                LOGIN INPUT AND BUTTONS

*********************************************************/
// - Login input containers and button
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const loginErrorBox = document.getElementById("login-error-box");
const loginErrorText = document.getElementById("login-error-text");
const rememberBox = document.getElementById("remember-checkbox");

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

        console.log( "Hello" );

        const response = await fetch( '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( loginData )
        });

        console.log( "Response status" + response.status );
        console.log( "Response message" + response.message );


        // - On success, go to dashboard
        if( response.status == 201 ) {
            window.location.href = "/homepage";
        } else if( response.status === 500 ) {
            loginErrorText.textContent = response.message;
        } else {
            displayLoginInputError();
        }
    } catch( error ) {
        console.log( error );
    }
});

/** 
    ` This function is to used when the user clicks the `#login-button`. It 
    checks the validity of each input, such as empty fields and invalid format.
    If any errors are found, it makes the `#login-error-box` visible before it 
    displays the designated error message.
*/
function displayLoginInputError() {
    loginErrorBox.style.display = "block";
    var errorMessage;

    // - Dynamic error messages
    if( !loginEmail.value ) {
        loginEmail.select();
        errorMessage = "Error: Please type your email address";
    } else if( !loginEmail.value.includes('@') ) {
        loginEmail.select();
        errorMessage = "Error: Invalid email address format";
    } else if( !loginPassword.value ) {
        loginPassword.select();
        errorMessage = "Error: Please type your password";
    } else {
        errorMessage = "Error: Invalid credentials"
    }

    loginErrorText.textContent = errorMessage;
}

/*|*******************************************************

                REGISTER INPUT AND BUTTONS

*********************************************************/
// - Register input containers and buttons
const registerFirstName = document.getElementById("register-first-name");
const registerLastName = document.getElementById("register-last-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");
const registerErrorBox = document.getElementById("register-error-box");
const registerErrorText = document.getElementById("register-error-text");

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

        if( areInputFieldsFilled("register-form") ) {
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
            } else if( response.status === 500 ) {
                registerErrorText.textContent = errorMessage;
            } else {
                displayRegisterInputError();
            }
        } else {
            // - Display error message
            displayRegisterInputError();
        }
    } catch( error ) {
        console.log( error );    
    }
});

/** 
    ` This function is to used when the user clicks the `#register-button`. It 
    checks the validity of each input, such as empty fields and invalid format.
    If any errors are found, it makes the `#register-error-box` visible and 
    displays the designated error message.
*/
function displayRegisterInputError() {
    // - Make the error box visible
    registerErrorBox.style.display = "block";
    var errorMessage;

    // - Name errors
    if( !registerFirstName.value ) {
        registerFirstName.select();
        errorMessage = "Error: Please type your first name";
    } else if( !isTextOnly(registerFirstName.value) ) {
        registerFirstName.select();
        errorMessage = "Error: First name should contain letters only";
    } else if( !registerLastName.value ) {
        registerLastName.select();
        errorMessage = "Error: Please type your last name";
    } else if( !isTextOnly(registerLastName.value) ) {
        registerLastName.select();
        errorMessage = "Error: Last name should contain letters only";
    } 

    // - Email and password
    else if( !registerEmail.value ) {
        registerEmail.select();
        errorMessage = "Error: Please type your email address";
    } else if( !registerEmail.value.includes('@') ) {
        registerEmail.select();
        errorMessage = "Error: Invalid email address format";
    } else if( !registerPassword.value ) {
        registerPassword.select();
        errorMessage = "Error: Please type your password";
    } else {
        errorMessage = "Error: Student ID or email already registered"
    }

    registerErrorText.textContent = errorMessage;
}

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

/*
function handleInputChanges( formId ) {
    const submitButton = document.querySelectorAll(`#${formId} input[type="submit"]`);
    submitButton.disabled = !areInputFieldsFilled(formId);
}

document.querySelectorAll(`#login-form input`).forEach( input => {
    input.addEventListener('input', handleInputChanges("login-form") );
});

document.querySelectorAll(`#register-form input`).forEach( input => {
    input.addEventListener('input', handleInputChanges("login-form") );
});
*/