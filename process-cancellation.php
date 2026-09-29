<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

date_default_timezone_set("Asia/Singapore");

// Only accept data submitted through a POST form
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: account.php");
    exit;
}

require_once __DIR__ . "/includes/database.php";

// Temporary account email until PHP login is completed
$accountEmail = "pris0038@e.ntu.edu.sg";

// Retrieve the booking ID from the cancellation form
$bookingId = (int) ($_POST["bookingId"] ?? 0);
if($bookingId<=0){
    $db->close();

    header("Location: account.php?cancel_error=invalid");
    exit;
}

//cancel only a booking that (1)matches the submitted booking ID (2) belongs to this account (3) is currently confirmed (4) has not alr taken place
$query ="
UPDATE bookings
SET status = 'Cancelled'
WHERE booking_id = ?
AND booker_email = ?
AND status = 'Confirmed'
AND TIMESTAMP(screening_date,screening_time) >NOW()";

$statement = $db->prepare($query);

if (!$statement) {
    $db->close();
    header("Location: account.php?cancel_error=database");
    exit;
}

$statement->bind_param(
    "is",
    $bookingId,
    $accountEmail
);
$statement->execute();

//1 means affected_rows' booking is cancelled. 0 means booking not found/did not belong to this account/was alr cancelled or in the past

if($statement->affected_rows===1){
    $statement->close();
    $db->close();

    header("Location: account.php?cancelled=1");
    exit;
}
$statement->close();
$db->close();

header("Location: account.php?cancel_error=not_allowed");
exit;