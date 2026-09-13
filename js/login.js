/* ========================= LOGIN ELEMENTS ========================= */

/* Finds the complete login form */
const loginForm =
    document.getElementById("login-form");

/* Finds the email and password inputs */
const loginEmail =
    document.getElementById("login-email");

const loginPassword =
    document.getElementById("login-password");

/* Finds the password visibility button */
const passwordToggle =
    document.getElementById("password-toggle");

/* Finds the area used to display login errors */
const loginError =
    document.getElementById("login-error");

/* ========================= PASSWORD VISIBILITY ========================= */

/*
    Switches the password input between hidden text
    and visible text.
*/
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

/* ========================= PROTOTYPE LOGIN ========================= */

/*
    Simulates successful login after the browser confirms
    that all required fields have been completed.
*/
loginForm.addEventListener("submit", function (event) {
    /* Prevents the form from refreshing the page */
    event.preventDefault();

    /* Removes any earlier error */
    loginError.hidden = true;

    /*
        Prototype validation:
        require an email address ending in an NTU domain.
    */
    const validNtuEmail =
        loginEmail.value.endsWith("@e.ntu.edu.sg") ||
        loginEmail.value.endsWith("@ntu.edu.sg");

    if (!validNtuEmail) {
        loginError.textContent =
            "Please enter a valid NTU email address.";

        loginError.hidden = false;
        return;
    }

    /*
        Temporary successful-login behaviour.
        Cloud authentication will replace this later.
    */
    window.location.href = "account.html";
});