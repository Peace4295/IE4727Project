<?php
 ini_set("display_errors",0);
 ini_set("log_errors",0);
 error_reporting(E_ALL);

 session_start();

 if(!isset($_SESSION["user_id"], $_SESSION["email"])){
   header("Location: login.php");
   exit;
 }

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
 $bookerEmail = $_SESSION["email"];
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
// Validate screening date and time
if ($screeningDate !== "" && $screeningTime !== "") {

    date_default_timezone_set("Asia/Singapore");

    $screening = DateTime::createFromFormat(
        "!Y-m-d H:i",
        $screeningDate . " " . $screeningTime
    );

    if (
        !$screening ||
        $screening->format("Y-m-d H:i") !==
        $screeningDate . " " . $screeningTime
    ) {
        $errors[] = "Invalid screening date or time.";
    } elseif ($screening <= new DateTime()) {
        $errors[] = "You cannot book a screening that has already started.";
    }
}
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

$referenceNumber = "NTF-" . date("Ymd") . "-" . strtoupper(bin2hex(random_bytes(6)));
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

    
// Start transaction so booking and seats are saved together
$db->begin_transaction();

try {
    // Prepare and insert the main booking
    $statement = $db->prepare($query);

    if (!$statement) {
        throw new Exception("Could not prepare booking statement.");
    }

    $statement->bind_param(
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

    if (!$statement->execute()) {
        throw new Exception("Could not save booking.");
    }

    $bookingId = $db->insert_id;

    // Prepare seat insertion
    $seatQuery = "INSERT INTO booking_seats
                  (booking_id, seat_number)
                  VALUES (?, ?)";

    $seatStatement = $db->prepare($seatQuery);

    if (!$seatStatement) {
        throw new Exception("Could not prepare seat statement.");
    }

    // Save all selected seats
    foreach ($selectedSeats as $seatNumber) {
        $seatStatement->bind_param(
            "is",
            $bookingId,
            $seatNumber
        );

        if (!$seatStatement->execute()) {
            throw new Exception("Could not save seat.");
        }
    }

    // All inserts succeeded
    $db->commit();

    $seatStatement->close();
    $statement->close();

      } catch (Throwable $error) {
         // Undo all inserts if anything failed
         $db->rollback();

         error_log("Booking database error: " . $error->getMessage());
         $db->close();

         echo "<h1>Booking Failed</h1>";
         echo "<p>Your booking could not be completed. Please try again.</p>";
         echo '<p><a href="moviecatalog.html">Return to movies</a></p>';
         exit;
      }


 // EMAIL ACKNOWLEDGEMENT
 // Send only after the booking has been saved.

 $emailSubject = "Nanyang Film House - Booking Confirmation";

 $displayLocation = ucwords(str_replace("-", " ", $location));
 $emailMessage =
     "Dear Customer,\r\n\r\n" .
     "Thank you for booking with Nanyang Film House!\r\n\r\n" .
     "Your booking has been confirmed.\r\n\r\n" .
     "BOOKING DETAILS\r\n" .
     "----------------------------------------\r\n" .
     "Booking Reference: " . $referenceNumber . "\r\n" .
     "Movie: " . $movieTitle . "\r\n" .
     "Cinema Location: " . $displayLocation . "\r\n" .
     "Screening Date: " . $screeningDate . "\r\n" .
     "Screening Time: " . $screeningTime . "\r\n" .
     "Selected Seats: " . implode(", ", $selectedSeats) . "\r\n" .
     "Number of Tickets: " . $ticketCount . "\r\n" .
     "Total Amount: $" . number_format($totalAmount, 2) . "\r\n" .
     "----------------------------------------\r\n\r\n" .
     "Please keep your booking reference for your records.\r\n\r\n" .
     "We look forward to seeing you!\r\n\r\n" .
     "Nanyang Film House";

 $emailHeaders =
     "From: noreply@localhost\r\n" .
     "Reply-To: noreply@localhost\r\n" .
     "X-Mailer: PHP/" . phpversion();

 ob_start();

 try {
     require_once "/Applications/XAMPP/xamppfiles/htdocs/IE4727Project/mail_patch.php";

     \mail_patch\mail(
         $bookerEmail,
         $emailSubject,
         $emailMessage,
         $emailHeaders,
         "-fnoreply@localhost"
     );
 } catch (Throwable $error) {
     error_log("Booking email error: " . $error->getMessage());
 }

 ob_end_clean();

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
 