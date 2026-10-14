<?php

session_start();

//remove all stored session variables
$_SESSION = array();

//delete the session cookie
 if(ini_get("session.use_cookies")){
    $cookieSettings = session_get_cookie_params();

    setcookie(
        session_name(),
        "",
        time() - 3600,
        $cookieSettings["path"],
        $cookieSettings["domain"],
        $cookieSettings["secure"],
        $cookieSettings["httponly"]
    );
 }

//detroy the session on the server
  session_destroy();

//return to login
   header("Location: login.php?logout=1");
   exit;