
// Finds the complete login form 
const loginForm =
    document.getElementById("login-form");

// Finds the email and password inputs 
const loginEmail =
    document.getElementById("login-email");

const loginPassword =
    document.getElementById("login-password");

// Finds the password visibility button 
const passwordToggle =
    document.getElementById("password-toggle");

//Finds the area used to display login errors 
const loginError =
    document.getElementById("login-error");


// Switches the password input between hidden text and visible text. 
passwordToggle.addEventListener("click", function () {
    const passwordIsHidden =
        loginPassword.type === "password";

    loginPassword.type =
        passwordIsHidden ? "text" : "password";

    passwordToggle.textContent =
        passwordIsHidden ? "Hide" : "Show";

    passwordToggle.setAttribute(
        "aria-label",
        passwordIsHidden
            ? "Hide password"
            : "Show password"
    );
});



loginForm.addEventListener("submit", function (event) {
    loginError.hidden = true;

    const email = loginEmail.value.trim().toLowerCase();

    const validNtuEmail =
        email.endsWith("@e.ntu.edu.sg") ||
        email.endsWith("@ntu.edu.sg");

    if (!validNtuEmail) {
        event.preventDefault();

        loginError.textContent =
            "Please enter a valid NTU email address.";

        loginError.hidden = false;
    }
});
