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

//check seat availability

$seatCheckQuery = "SELECT booking_seats.booking_seat_id
FROM booking_seats

INNER JOIN bookings
ON booking_seats.booking_id = bookings.booking_id 

WHERE bookings.movie_id = ?
AND bookings.cinema_location = ?
AND bookings.screening_date = ?
AND bookings.screening_time = ?
AND booking_seats.seat_number = ?      #this condition checks the seat
AND bookings.status = 'Confirmed'
LIMIT 1";

$seatCheckStatement = $db->prepare($seatCheckQuery);
if (!$seatCheckStatement) {
   echo "<h1>Booking failed</h1>";
   echo "<p>The seat availability could nto be checked.</p>";
   $db->close();
   exit;
}

//rmb any unavail seats found
$unavailableSeats = array();

foreach ($selectedSeats as $seatNumber) {
   $seatCheckStatement->bind_param(
      "issss",
      $movieId,
      $location,
      $screeningDate,
      $screeningTime,
      $seatNumber
   );
   $seatCheckStatement->execute();
   //store_result() stores the SELECT result so that num_rows can be checked
   $seatCheckStatement->store_result();
   if ($seatCheckStatement->num_rows>0) {
      $unavailableSeats[] = $seatNumber;
   }
   //clear the prev result before checking the next selected seat.
   $seatCheckStatement->free_result();
}
$seatCheckStatement->close();

if(count($unavailableSeats)>0){
   echo "<h1>Seats No Longer Available</h1>";
   echo "<p>The following seat or seats have already been booked:</p>";
   echo "<p><strong>" . htmlspecialchars(implode(",", $unavailableSeats))."</strong></p>";
   echo "<p>Please choose another seat</p>";
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
if(!$statement) {
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

// Execute the main booking insett
if ($statement->execute()) {
    //get the auto generated booking-id
    $bookingId = $db->insert_id;

    //prepare the query for inserting each selected seat
    $seatQuery = " INSERT INTO booking_seats (booking_id, seat_number) VALUES (?,?)";
    $seatStatement = $db->prepare($seatQuery);

    if(!$seatStatement) {
      echo "<h1>Booking Failed</h1>";
      echo "<p>The seat statement could not be prepared.</p>";

      $statement->close();
      $db->close();
      exit;
    }
   //insert each selected seat
    foreach ($selectedSeats as $seatNumber) {
      $seatStatement->bind_param(
         "is",
         $bookingId, $seatNumber
      );
      $seatStatement->execute();
    }

// Close the prepared statement
$seatStatement->close();
$statement->close();
$db->close();

//send the user back too bookingandpayment.php
//sucess=1 tells javascript to open the modal. ref contains the booking ref generated by PHP

$redirectUrl =
"bookingandpayment.php".
"?movieId=" .urlencode($movieId).
"&location=" .urlencode($location).
"&date=" .urlencode($screeningDate).
"&time=" .urlencode($screeningTime).
"&success=1".
"&reference=" .urlencode($referenceNumber);

header("Location:" . $redirectUrl);
exit;
} else {
   echo "<h1>Booking Failed</h1>";
   echo "<p>The booking could not be saved</p>";

   $statement->close();
   $db->close();
   exit;
}