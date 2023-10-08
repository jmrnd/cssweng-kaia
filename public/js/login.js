/*|*******************************************************

               LOGIN AND REGISTER FORM DISPLAY

*********************************************************/
// Login and Register Switch Buttons

const loginSwitch = document.querySelector(".switch-container-button.login");
const registerSwitch = document.querySelector(".switch-container-button.register");
const insertContent = document.querySelector(".content-container");

const registerContent = `
        <form id="register-form-container">
            <div class="input-container-register">
                <div class="input-box name">
                        <input type="text" placeholder="Firstname" required>
                        <input type="text" placeholder="Lastname" required>
                </div>
                <div class="input-box username">
                    <input type="text" id="register-username" placeholder="Username" required>
                </div>
                <div class="input-box email">
                    <input type="email" id="register-email" placeholder="Email" required>
                </div>
                <div class="input-box password">
                    <input type="password" id="register-password" placeholder="Password" required>
                </div>
            </div>
            <button type="submit" id="register-button"> Create account</button>
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
    // Switch to Login
    insertContent.innerHTML = loginContent;

    //remove switch highlight to register
    registerSwitch.classList.remove("focus");

    //add switch highlight to login
    loginSwitch.classList.add("focus");

})

registerSwitch.addEventListener("click", function (e){
    // Switch to Register
    insertContent.innerHTML = registerContent;

    // Remove switch highlight to Login
    loginSwitch.classList.remove("focus");

    // Add switch highlight to Register
    registerSwitch.classList.add("focus");
})