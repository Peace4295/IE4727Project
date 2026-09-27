<?php
 ini_set("display_errors",1);
 error_reporting(E_ALL);

 if($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Please complete the booking form first.";
    exit;
 }

 require_once __DIR__. "/includes/database.php";

 //get form values
 $movieId = (int) ($_POST["movieId"] ?? 0);
 $movieTitle = trim($_POST["movieTitle"] ?? "");
 $location = trim($_POST["location"] ?? "");
 $screeningDate = trim($_POST["screeningDate"] ?? "");
 $screeningTime = trim($_POST["screeningTime"] ?? "");
 $bookerEmail = trim($_POST["bookerEmail"] ?? "");
 $selectedSeatsText = trim($_POST["selectedSeats"] ?? "");


$selectedSeats = array();

if($selectedSeatsText !== ""){
    // Convert the comma-separated seats into an array
    $selectedSeats = explode(",", $selectedSeatsText);

    //remove extra spaces from each seat name
    $selectedSeats = array_map("trim", $selectedSeats);

    //remove duplicated seat name
    $selectedSeats = array_unique($selectedSeats);
}

//serverside validation
//all validation problem will be stored in this array
$errors = array();

if ($movieId <= 0) { $errors[] = "A valid movie is required."; }
if ($movieTitle === "") { $errors[] = "The movie title is required."; }
if ($location === "") { $errors[] = "The cinema location is required."; }
if ($screeningDate === "") { $errors[] = "The screening date is required."; }
if ($screeningTime === "") { $errors[] = "The screening time is required."; }
if ( $bookerEmail === "" || !filter_var($bookerEmail, FILTER_VALIDATE_EMAIL) ) { $errors[] = "A valid NTU email address is required."; }

$ticketCount = count($selectedSeats);  //count how many seats were selected

if ($ticketCount < 1 || $ticketCount > 6) { $errors[] = "Please select between one and six seats."; }


/* 
^ means the beginning
[A-F] allows rows a to f
{1-8] allows seat numbers 1 to 8
$ means the end*/

foreach ($selectedSeats as $seatNumber) {
    if (!preg_match("/^[A-F][1-8]$/", $seatNumber)){
    $errors[] = "An invalid seat was selected/";
    break;
    }
 }

 //calculate the price again on the server side
 $seatPrice = 5.00;
 $totalAmount = $ticketCount * $seatPrice;
 

//display validation errors
 if (count($errors)>0){
    echo "<h1>Booking could not be processed</h1>";
    echo"<ul>";

    foreach ($errors as $error) {
        echo "<li>". htmlspecialchars($error). "</li>";
    }
    echo"</ul>";
    echo '<p><a href="moviecatalog.html">Return to movies</a></p>';

    $db->close();
    exit;
 }

//this one is main booking

$referenceNumber = "NTF-". date("Ymd"). "-" . random_int(1000,9999);

//insert booking
$query = "
   INSERT INTO bookings(
   reference_number,
   movie_id,
   movie_title,
   cinema_location,
   screening_date,
   screening_time,
   booker_email,
   ticket_count,
   total_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
";

//prepare the SQL statement
$statement = $db->prepare($query);

//stop if my sql could not prepare the statement
if($statment) {
   echo "<h1>Booking Failed</h1>";
   echo "<p>The booking statement could not be prepared.</p>";

   $db->close();
   exit;
}

//bind php values to the sql placeholders (s=string,i=integer,d=decimal)
$statement ->bind_param(
   "sisssssid",
    $referenceNumber,
    $movieId,
    $movieTitle,
    $location,
    $screeningDate,
    $screeningTime,
    $bookerEmail,
    $ticketCount,
    $totalAmount
);

// Execute the insert
if ($statement->execute()) {
    /*
        MySQL automatically creates booking_id.

        insert_id retrieves the ID belonging to the
        row that was just inserted.
    */
    $bookingId = $db->insert_id;

    echo "<h1>Booking Saved</h1>";
    echo "<p><strong>Booking ID:</strong> " . htmlspecialchars($bookingId) . "</p>";
    echo "<p><strong>Reference:</strong> " . htmlspecialchars($referenceNumber) . "</p>";
    echo "<p><strong>Movie:</strong> " . htmlspecialchars($movieTitle) . "</p>";
    echo "<p><strong>Seats:</strong> " . htmlspecialchars( implode(", ", $selectedSeats) ) . "</p>";
    echo "<p><strong>Total:</strong> $" . htmlspecialchars( number_format($totalAmount, 2) ) . "</p>";
} else { echo "<h1>Booking Failed</h1>"; echo "<p>" . htmlspecialchars($statement->error) . "</p>"; }


// Close the prepared statement
$statement->close();