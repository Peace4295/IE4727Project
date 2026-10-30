<?php
 session_start();

 $feedbackMessage = "";
 $feedbackClass = "";

 if(isset($_GET["logout"]) && $_GET["logout"]==="1"){
    $feedbackMessage = "You have been signed out successfully.";
    $feedbackClass = "login-success";
 }
if(isset($_GET["error"])){
    if($_GET["error"] === "missing"){
        $feedbackMessage = "Please enter both your email and password.";
    } elseif ($_GET["error"]==="invalid"){
        $feedbackMessage = "The email or password is incorrect.";
    } elseif ($_GET["error"] === "database"){
        $feedbackMessage = "Login is temporarily unavailable. Please try again later.";
    }
    $feedbackClass = "login-error";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - NTU Films</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" type="image/png" href="images/favicon-light.png" >
</head>
<body>
    <main class="login-page">
    <div class="login-overlay"></div>
        <section class="login-card">
        <a href="index.html" class="login-logo"> <img src="images/logo/logo-navbar.png" alt="Nanyang Film House" > </a>

        <h1>Welcome Back</h1>

        <?php if ($feedbackMessage !== ""): ?>
            <div class="login-feedback <?= $feedbackClass ?>" role="alert">
                <?= htmlspecialchars($feedbackMessage)?>
            </div>
            <?php endif; ?>

        <form class="login-form" action="process-login.php" method="post" id="login-form">
            <div class="login-field">
                <label for="login-email"> NTU Email </label>
                <input type="email" id="login-email" name="email" placeholder="username@e.ntu.edu.sg" autocomplete="username" required >
            </div>
            <div class="login-field">
                <label for="login-password"> Password </label>
                <div class="password-input-wrapper">
                    <input type="password" id="login-password" name="password" placeholder="Enter your password" autocomplete="current-password" minlength="8" required>
                    <button type="button" class="password-toggle" id="password-toggle" aria-label="Show password">
                            Show
                    </button>
                </div>
                
            </div>

            <p class="login-error" id="login-error" hidden></p>
            <button type="submit" class="btn btn-primary login-submit-btn">
                Sign In
            </button>
        </form>

        <p class="login-help">
            Use your registered NTU Outlook account.
        </p>

        

    </section>
</main>

    <script src="js/login.js"></script>
</body>
</html>