<?php

ini_set("display_errors",1 );
error_reporting(E_ALL);


session_start();

if(!isset($_SESSION["user_id"], $_SESSION["email"])){
    header("Location: login.php");
    exit;
}

require_once __DIR__ . "/includes/database.php";


if ($_SERVER["REQUEST_METHOD"]!= "POST") {
    echo "Please submit the form before opening this page.";
    exit;
}



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

$submitterName = $_SESSION["full_name"];
$submitterEmail = $_SESSION["email"];
$school = trim($_POST["school"] ?? "");
$studentId = trim($_POST["studentId"] ?? "");


//validated the submitted values

 // Validate the submitted values
$errors = array();

// Film Title
if ($filmTitle === "") {
    $errors[] = "Film title is required.";
} elseif (strlen($filmTitle) > 100) {
    $errors[] = "Film title cannot exceed 100 characters.";
}

// Genre
if ($genre === "") {
    $errors[] = "Genre is required.";
}

// Runtime
if ($runtime === "") {
    $errors[] = "Running time is required.";
} elseif (!ctype_digit($runtime) ||
          (int)$runtime < 1 || (int)$runtime > 300) {
    $errors[] = "Running time must be between 1 and 300 minutes.";
}

// Synopsis
if ($synopsis === "") {
    $errors[] = "Synopsis is required.";
} elseif (strlen($synopsis) > 1000) {
    $errors[] = "Synopsis cannot exceed 1000 characters.";
}

// Primary Language
if ($language === "") {
    $errors[] = "Primary language is required.";
} elseif (!preg_match("/^[A-Za-z ]+$/", $language)) {
    $errors[] = "Primary language must contain only letters and spaces.";
}

// Subtitle Language (optional)
if ($subtitles !== "" &&
    !preg_match("/^[A-Za-z ]+$/", $subtitles)) {
    $errors[] = "Subtitle language must contain only letters and spaces.";
}

// Completion Year
if ($completionYear === "") {
    $errors[] = "Completion year is required.";
} elseif (!ctype_digit($completionYear) ||
          (int)$completionYear < 1900 ||
          (int)$completionYear > (int)date("Y")) {
    $errors[] = "Please enter a valid completion year.";
}

// Director
if ($director === "") {
    $errors[] = "Director is required.";
} elseif (!preg_match("/^[A-Za-z ]+$/", $director)) {
    $errors[] = "Director's name must contain only letters and spaces.";
}

// Cast (optional)
if ($cast !== "" &&
    !preg_match("/^[A-Za-z ,]+$/", $cast)) {
    $errors[] = "Cast names may contain only letters, spaces and commas.";
}

// Validate HTTP(S) links with domain extensions
function isValidFilmUrl($url) {
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return false;
    }

    $parts = parse_url($url);
    $scheme = strtolower($parts["scheme"] ?? "");
    $host = $parts["host"] ?? "";

    return in_array($scheme, ["http", "https"], true) &&
           preg_match("/^([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/", $host) === 1;
}

// Private Film Link
if ($filmLink === "") {
    $errors[] = "Film link is required.";
} elseif (!isValidFilmUrl($filmLink)) {
    $errors[] = "Please enter a valid film link, e.g. https://example.com/film.";
}

// Trailer Link (optional)
if ($trailerLink !== "" && !isValidFilmUrl($trailerLink)) {
    $errors[] = "Please enter a valid trailer link.";
}

// Submitter details
if ($submitterName === "") {
    $errors[] = "Submitter name is required.";
}

if ($submitterEmail === "") {
    $errors[] = "Submitter email is required.";
} elseif (!filter_var($submitterEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

// School or Faculty
if ($school === "") {
    $errors[] = "School or faculty is required.";
} elseif (!preg_match("/^[A-Za-z ]+$/", $school)) {
    $errors[] = "School or faculty must contain only letters and spaces.";
}

// Matriculation Number
if ($studentId === "") {
    $errors[] = "Matriculation number is required.";
} elseif (!preg_match("/^[A-Za-z0-9]+$/", $studentId)) {
    $errors[] = "Matriculation number must contain only letters and numbers.";
}

// Declaration Checkboxes
if (!isset($_POST["rightsConfirmation"])) {
    $errors[] = "Please confirm that you have permission to submit this film.";
}

if (!isset($_POST["informationConfirmation"])) {
    $errors[] = "Please confirm that the information provided is accurate.";
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
    echo '<p><a href="submit.php">Return to the form</a><p>';

    $db->close();
    exit;
}

//generate a submission ref number
$referenceNumber = "NFH-"
. date("Ymd")
. "-"
. rand(1000,9999);


// Handle film poster upload
$posterPath = null;

if (!isset($_FILES["filmPoster"]) ||
    $_FILES["filmPoster"]["error"] !== UPLOAD_ERR_OK) {
    exit("Please upload a valid film poster.");
}

$poster = $_FILES["filmPoster"];

// Limit poster to 5MB
if ($poster["size"] > 5 * 1024 * 1024) {
    exit("Film poster must be smaller than 5MB.");
}

// Check actual image type
$imageInfo = getimagesize($poster["tmp_name"]);

$allowedTypes = [
    IMAGETYPE_JPEG => "jpg",
    IMAGETYPE_PNG => "png",
    IMAGETYPE_WEBP => "webp"
];

if ($imageInfo === false ||
    !isset($allowedTypes[$imageInfo[2]])) {
    exit("Only JPG, PNG and WebP images are allowed.");
}

$extension = $allowedTypes[$imageInfo[2]];

// Folder already exists in your project
$uploadDirectory = __DIR__ . "/uploads/posters/";

// Generate unique filename
$posterFilename = $referenceNumber . "-" .
                  bin2hex(random_bytes(4)) . "." .
                  $extension;

// Save uploaded file
$destination = $uploadDirectory . $posterFilename;

if (!move_uploaded_file($poster["tmp_name"], $destination)) {
    exit("Film poster could not be saved.");
}

// Store relative path for MySQL
$posterPath = "uploads/posters/" . $posterFilename;


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
        poster_path,
        submitter_name,
        submitter_email,
        school,
        student_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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
    "sssisssisssssssssss",
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
    $posterPath,
    $submitterName,
    $submitterEmail,
    $school,
    $studentId
);

//execute the sql statement
if ($statement -> execute()) {
    $statement -> close();
    $db -> close();

    header(
        "Location: submit.php?success=1&reference=" .
        urlencode($referenceNumber)
    );
    exit;
    }
    



    // notes 
    // trim() remove spaces from the beginning and end
    // ctype_digit() check if the string contains only digits
    // preg_match() check if the string matches a pattern
    // filter_var() validate email and url
    // parse_url() extract url components such as the domain name
    // isset() check if a variable is set and not null
    // date("Y") returns the current year