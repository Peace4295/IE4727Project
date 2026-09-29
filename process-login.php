<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: login.php");
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

echo "<h1>Login data received</h1>";
echo "<p>Email: " . htmlspecialchars($email) . "</p>";
echo "<p>Password received: " . ($password !== "" ? "Yes" : "No") . "</p>";