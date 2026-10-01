<?php

// ini_set("display_errors",1 );
// error_reporting(E_ALL);

//only allow page to process submitted form data
if ($_SERVER["REQUEST_METHOD"]!= "POST") {
    echo "Please submit the form before opening this page.";
    exit;
}

//retrieve the film title using the input's name="filmTitle
//$filmTitle = $_POST["filmTitle"];

//load db connection
require_once __DIR__ . "/includes/database.php";

//??"" gives an empty string when the value does not exist
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

$submitterName = trim($_POST["submitterName"] ?? "");
$submitterEmail = trim($_POST["submitterEmail"] ?? "");
$school = trim($_POST["school"] ?? "");
$studentId = trim($_POST["studentId"] ?? "");


//validated the submitted values
$errors = array();

if($filmTitle === ""){
    $errors[] = "Film title is required.";
}
if($genre === ""){
    $errors[] = "Genre is required.";
}
if($runtime === ""){
    $errors[] = "Run Time is required.";
} elseif (!is_numeric($runtime) || $runtime <= 0) {
    $errors[] = "Runtime must be a positive number.";
}
if($synopsis === ""){
    $errors[] = "Synopsis is required.";
}
if($language === ""){
    $errors[] = "Primary langauge is required.";
}
if($completionYear === ""){
    $errors[] = "Completion year is required.";
} elseif (!is_numeric($completionYear) || $completionYear <= 0) {
    $errors[] = "Completion year must be a number.";
}

if($director === ""){
    $errors[] = "Director is required.";
}
if($filmLink === ""){
    $errors[] = "Film link is required.";
} elseif (!filter_var($filmLink, FILTER_VALIDATE_URL)) {
    $errors[] = "Please enter a valid film link.";
}
if( $trailerLink !== "" && !filter_var($trailerLink, FILTER_VALIDATE_URL)
    ){$errors[] = "Please enter a valid trailer link.";
}


if($submitterName === ""){
    $errors[] = "SubmitterName is required.";
}
if($submitterEmail === ""){
    $errors[] = "Submitter email is required.";
} elseif(!filter_var($submitterEmail, FILTER_VALIDATE_EMAIL)){
    $errors[] = "Please enter a valid email address.";
}

if($school === ""){
    $errors[] = "School is required.";
}
if($studentId === ""){
    $errors[] = "Student ID is required.";
}

//stop if validation failed
if (count($errors)> 0){
    echo "<h1>Submission could not be processed</h1>";
    echo "<ul>";

    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error). "</li>";
    }
    echo "</ul>";
    echo '<p><a href="submit.html">Return to the form</a><p>';

    $db->close();
    exit;
}

//generate a submission ref number
$referenceNumber = "NFH-"
. date("Ymd")
. "-"
. rand(1000,9999);

//create the sql insert statement

$query = "
    INSERT INTO film_submissions(
        reference_number,
        film_title,
        genre,
        runtime_minutes,
        synopsis,
        primary_language,
        subtitle_language,
        completion_year,
        content_rating,
        director,
        cast_members,
        film_link,
        film_password,
        trailer_link,
        submitter_name,
        submitter_email,
        school,
        student_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ";

 //prepare the sql statement
$statement = $db->prepare($query);

if(!$statement) {
    echo "<h1>Submission Failed</h1>";
    echo "<p>The database statement could not be prepared.</p>";

    $db->close();
    exit;
    }

//bind the php values to the placeholders
$statement->bind_param(
    "sssisssissssssssss",
    $referenceNumber,
    $filmTitle,
    $genre,
    $runtime,
    $synopsis,
    $language,
    $subtitles,
    $completionYear,
    $contentRating,
    $director,
    $cast,
    $filmLink,
    $filmPassword,
    $trailerLink,
    $submitterName,
    $submitterEmail,
    $school,
    $studentId
);

//execute the sql statement
if ($statement->execute()) {
    echo "<h1>Film Submission Sucessful</h1>";
    echo "<p>Your submission has been saved.</p>";
    echo "<p>Your reference number is: <strong>" . htmlspecialchars($referenceNumber) ."</strong></p>";
    echo "<p>Your submission status is Pending Review.</p>";
    echo '<p><a href="submit.html">Return to submit a Film</a></p>';}
    else{
        echo "<h1>Submission Failed</h1>";
        echo "<p> Your submission could not be saved.</p>";

        //echo "<p>Error: ". htmlspecialchars($statement->error) . "</p>";

        echo '<p><a href="submit.html"> Return to the form</a></p>';
    }
    
//close the statemnet and databsae connection
$statement->close();
$db->close();

