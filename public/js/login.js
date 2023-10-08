/*|*******************************************************

               LOGIN AND REGISTER FORM DISPLAY

*********************************************************/
const loginSwitch = document.querySelector(".switch-container-button.login");
const registerSwitch = document.querySelector(".switch-container-button.register");
const insertContent = document.querySelector(".content-container");

const registerContent = `
        <form id="register-form-container">
            <div class="input-container-register">
                <div class="input-box name">
                        <input type = "text" id = "register-first-name" placeholder = "First Name" required>
                        <input type = "text" id = "register-last-name" placeholder = "Last Name" required>
                </div>
                <div class="input-box email">
                    <input type="email" id = "register-email" placeholder="Email" required>
                </div>
                <div class="input-box password">
                    <input type="password" id = "register-password" placeholder="Password" required>
                </div>
            </div>
            <button type="submit" id = "register-button"> Create account</button>
        </form>
`

const loginContent = `
    <form id = "login-form-container">
        <div class = "input-container">
            <div class = "input-box">
                <input type = "email" id = "login-email" name = "login-email" placeholder = "Email" required >
            </div>
            <div class = "input-box">
                <input type = "password" id = "login-password" name = "login-password" placeholder = "Password" required>
            </div>
        </div>
        <div class = "options-container">
            <div class="option-items">
                <input type="checkbox" id="remember-me" name="remember-me">
                <label for="remember-me">Remember Me</label>
            </div>
            <a href=""><span class="option-items">Forgot Password?</span></a>
        </div>
        <div class = "terms-container">
            By logging into my account, I agree to Kaia Apparel’s <a href="/">Term’s and condition</a> and <a href="/">Privacy policy</a>.
        </div>
        <button type="submit" id="login-button">Login</button>
    </form>
`

loginSwitch.addEventListener("click", function (e){
    insertContent.innerHTML = loginContent;
    registerSwitch.classList.remove("focus");
    loginSwitch.classList.add("focus");
});

registerSwitch.addEventListener("click", function (e){
    insertContent.innerHTML = registerContent;
    loginSwitch.classList.remove("focus");
    registerSwitch.classList.add("focus");
});

/*|*******************************************************

               LOGIN AND REGISTER FORM DISPLAY

*********************************************************/
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

        console.log( "Hello" );

        const response = await fetch( '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( loginData )
        });

        // - On success, go to dashboard
        if( response.status == 201 ) {
            window.location.href = "/homepage";
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