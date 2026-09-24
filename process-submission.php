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

$filmTitle = trim($_POST["filmTitle"] ?? "");
$genre = trim($_POST["genre"] ?? "");
$runtime = trim($_POST["runtime"] ?? "");
$synopsis = trim($_POST["synopsis"] ?? "");

$language = trim($_POST["language"] ?? "");
$subtitles = trim($_POST["subtitles"] ?? "");
$completionYear = trim($_POST["completionYear"] ?? "");
$contentRating = trim($_POST["contentRating"] ?? "");

$director = trim($_POST["director"] ?? "");
$cast = trim($_POST["cast"] ?? "");

$filmLink = trim($_POST["filmLink"] ?? "");
$filmPassword = trim($_POST["filmPassword"] ?? "");
$trailerLink = trim($_POST["trailerLink"] ?? "");
$filmPoster = trim($_POST["filmPoster"] ?? "");

$submitterName = trim($_POST["submitterName"] ?? "");
$submitterEmail = trim($_POST["submitterEmail"] ?? "");
$school = trim($_POST["school"] ?? "");
$studentId = trim($_POST["studentId"] ?? "");

$error = array();

if($filmTitle === ""){
    $errors[] = "Film title is required.";
}
if($genre === ""){
    $errors[] = "Genre is required.";
}
if($runtime === ""){
    $errors[] = "Run Time is required.";
}
if($synopsis === ""){
    $errors[] = "Synopsis is required.";
}

if($submitterName === ""){
    $errors[] = "SubmitterName is required.";
}
if($submitterEmail === ""){
    $errors[] = "Submitter name is required.";
}

if (count($error)> 0){
    echo "<h1>Submission could not be processed</h1>";
    echo "<ul>";

    foreach ($error as $error) {
        echo "<li>" . htmlspecialchars($error). "</li>";
    }
    echo "</ul>";
    echo '<p><a href = "submit.html">Return to the form</a><p?';

    $db->close();
    exit;
}

echo "<h1>Submittion Data Received</h1>";

echo"<p><strong>Film title:</strong>" . htmlspecialchars($filmTitle) . "</p>";
echo"<p><strong>Genre:</strong>" . htmlspecialchars($genre) . "</p>";
echo"<p><strong>Run Time:</strong>" . htmlspecialchars($runtime) . "</p>";
echo"<p><strong>Synopsis:</strong>" . htmlspecialchars($synopsis) . "</p>";

echo"<p><strong>Primary Language:</strong>" . htmlspecialchars($language) . "</p>";
echo"<p><strong>Subtitles:</strong>" . htmlspecialchars($subtitles) . "</p>";
echo"<p><strong>Completion Year:</strong>" . htmlspecialchars($completionYear) . "</p>";
echo"<p><strong>Content Rating:</strong>" . htmlspecialchars($contentRating) . "</p>";

echo"<p><strong>Director:</strong>" . htmlspecialchars($director) . "</p>";
echo"<p><strong>Cast:</strong>" . htmlspecialchars($cast) . "</p>";

echo"<p><strong>Film Link:</strong>" . htmlspecialchars($filmLink) . "</p>";
echo"<p><strong>Trailer Link:</strong>" . htmlspecialchars($trailerLink) . "</p>";

echo"<p><strong>Submitter Name:</strong>" . htmlspecialchars($submitterName) . "</p>";
echo"<p><strong>Submitter Email:</strong>" . htmlspecialchars($submitterEmail) . "</p>";
echo"<p><strong>School:</strong>" . htmlspecialchars($school) . "</p>";
echo"<p><strong>Student ID:</strong>" . htmlspecialchars($studentId) . "</p>";

$db->close();














?>