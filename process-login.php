<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

//allows php to rmb the logged-in user
session_start(); 

if($_SERVER["REQUEST_METHOD"]!=="POST"){
    header("Location: login.php");
    exit;
}

require_once __DIR__ . "/includes/database.php";

$email = trim($_POST["email"] ?? 0);
$password = $_POST["password"]?? "";

if ($email === "" || $password === ""){
    $db->close();
    header("Location: login.php?error=missing");
    exit;
}
$query ="
SELECT
user_id,
full_name,
email,
password_hash,
role
FROM users
WHERE email = ?"; //searches for the entered email

$statement = $db->prepare($query);

if(!$statement) {
    $db->close();
    header("Location: login.php?error=database");
    exit;
}

$statement->bind_param("s", $email); //inserts the email into query
$statement->execute();

$result = $statement->get_result();
$user = $result->fetch_assoc();

//password_verify compares the entered pw against the stored hash
if ($user && password_verify ($password, $user["password_hash"])){
    session_regenerate_id(true);

    //$_SESSION stores the users details after login
    $_SESSION["user_id"]= $user["user_id"];
    $_SESSION["full_name"]= $user["full_name"];
    $_SESSION["email"]= $user["email"];
    $_SESSION["role"]= $user["role"];

    $statement->close();
    $db->close();
    
    //when entry is sucessful, direct user to homepage
    header("Location: index.html");
    exit;
}
$statement->close();
$db->close();

header("Location: login.php?error=invalid");
exit;