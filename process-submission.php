<?php

//only allow page to process submitted form data
if ($_SERVER["REQUEST_METHOD"]!= "POST") {
    echo "Please submit the form before opening this page.";
    exit;
}

//retrieve the film title using the input's name="filmTitle
$filmTitle = $_POST["filmTitle"];

//load db connection
require_once __DIR__ . "/includes/database.php";

echo "<h1>Submission Test Successful</h1>";
echo "<p>Film Title: " . $filmTitle . "</p>";
echo "<p>The database connection also worked</p>";
?>