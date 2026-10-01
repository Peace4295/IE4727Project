<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);

session_start();

if(!isset($_SESSION["user_id"], $_SESSION["email"])) {
    header("Location: login.php");
    exit;
}

require_once __DIR__. "/includes/database.php";

$accountEmail = $_SESSION["email"];
$accountName = $_SESSION["full_name"];



$moviePosters = array(
    1 => "images/movie/jumanji.png",
    2 => "images/movie/joker.png",
    3 => "images/movie/minionposter.jpg",
    4 => "images/movie/avengers.png",
    5 => "images/movie/zootopia.png",
    6 => "images/film/exit19.png",
    7 => "images/film/wpf.png",
    8 => "images/film/requiem.png",
    9 => "images/film/wyslmi.png",
    10 => "images/film/temp.png"
);

$bookingQuery = "
    SELECT
        bookings.booking_id,
        bookings.reference_number,
        bookings.movie_id,
        bookings.movie_title,
        bookings.cinema_location,
        bookings.screening_date,
        bookings.screening_time,
        bookings.ticket_count,
        bookings.total_amount,
        bookings.status,
        GROUP_CONCAT(
            booking_seats.seat_number
            ORDER BY booking_seats.seat_number
            SEPARATOR ', '
        ) AS seats
    FROM bookings
    LEFT JOIN booking_seats         
        ON bookings.booking_id = booking_seats.booking_id
    WHERE bookings.booker_email = ?
    GROUP BY
        bookings.booking_id,
        bookings.reference_number,
        bookings.movie_id,
        bookings.movie_title,
        bookings.cinema_location,
        bookings.screening_date,
        bookings.screening_time,
        bookings.ticket_count,
        bookings.total_amount,
        bookings.status
    ORDER BY
        bookings.screening_date DESC,
        bookings.screening_time DESC
";

$bookingStatement = $db->prepare($bookingQuery);
$bookingStatement->bind_param("s", $accountEmail);
$bookingStatement->execute();

$bookingResult = $bookingStatement->get_result();

$accountBookings = array();
$upcomingBookingCount = 0;

while ($booking = $bookingResult->fetch_assoc()){
    if(strtolower($booking["status"])==="cancelled"){
        $booking["display_status"] = "cancelled";
    } else{
        $screeningTimestamp = strtotime(
            $booking["screening_date"]. "".
            $booking["screening_time"]
            );
        if($screeningTimestamp<time()){
            $booking["display_status"] = "past";
        } else {
            $booking["display_status"] = "upcoming";
            $upcomingBookingCount++;
        }
    }
    $accountBookings[]= $booking;
}
$bookingStatement ->close();

//get film submission
$submissionQuery = "
SELECT
        film_title,
        reference_number,
        status,
        submitted_at
    FROM film_submissions
    WHERE submitter_email = ?
    ORDER BY submitted_at DESC
";
$submissionStatement = $db->prepare($submissionQuery);
$submissionStatement->bind_param("s", $accountEmail);
$submissionStatement->execute();

$submissionResult = $submissionStatement->get_result();

$filmSubmissions = array();
$pendingReviewCount = 0;

while ($submission = $submissionResult->fetch_assoc()) {
    $filmSubmissions[] = $submission;

    if (strtolower($submission["status"]) === "pending review") {
        $pendingReviewCount++;
    }
}

$submissionCount = count($filmSubmissions);

$submissionStatement->close();
$db->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account - NTU Films</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Global Navigation Bar -->
    <header>
        <nav class="navbar">
            <a href="index.html" class="logo">NTU Films</a>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="moviecatalog.html">Movies</a>
                <a href="submit.php">Submit a Film</a>
            </div>
            <a href="account.php" class="account-link active">My Account</a>
        </nav>
    </header>

    <main class="container account-page">
        <!-- profile -->
        <section class="account-profile">
            <div class="profile-avatar" id="profile-avatar">PC</div>
            <div class="profile-information">
                <p class="account-eyebrow">MY ACCOUNT</p>
                <h1 id="profile-name"><?php echo htmlspecialchars($accountName);?></h1>
                <p id="profile-email"><?php echo htmlspecialchars($accountEmail);?></p>
            </div>
            <button type="button" class="btn btn-secondary" id="edit-profile-button">Edit Profile</button>
         </section>
         <!-- account -->
         <section class="account-statistics" aria-label="Account overview">
            <div class="account-stats">
                <p>Upcoming Bookings</p>
                <strong id="upcoming-booking-count"><?php echo $upcomingBookingCount;?></strong>
            </div>

            <div class="account-stats">
                <p>Films Submitted</p>
                <strong id="film-submission-count"><?php echo $submissionCount;?></strong>
            </div>

            <div class="account-stats">
                <p>Pending Review</p>
                <strong id="pending-review-count"><?php echo $pendingReviewCount?></strong>
            </div>
            
         </section>
         <!-- my bookings -->
          <section class="account-section booking-history-section">
            <div class="account-section-heading">
                <div>
                    <h2>My Bookings</h2>
                    <p>View and manage your cinema bookings.</p>
                </div>
            </div>
            <div class="booking-tabs" role="tablist" aria-label="Filter bookings">
                <button type="button" class="booking-tab active" id="upcoming-tab" data-status="upcoming" role="tab" aria-selected="true">
                    Up Coming
                </button>
                <button type="button" class="booking-tab" id="past-tab" data-status="past" role="tab" aria-selected="false">
                    Past Bookings
                </button>
                <button type="button" class="booking-tab " id="cancelled-tab" data-status="cancelled" role="tab" aria-selected="false">
                    Cancelled
                </button>
                </div>
                <div class="list" id="account-booking-list" aria-live="polite">
                    <?php if (count($accountBookings)===0): ?>
                        <p class="empty-account-message" id="empty-booking-message">No Bookings found. </p>
                        <?php else: ?>
                            <?php foreach ($accountBookings as $booking): ?>
                                <?php
                                $bookingStatus = $booking["display_status"];
                                $movieId = (int)$booking["movie_id"];
                                $posterPath = $moviePosters[$movieId] ?? "images/favicon-2.png";
                                $displayLocation = $booking["cinema_location"];
                                if ($displayLocation === "north-spine") {$displayLocation = "North Spine Cinema";}
                                elseif ($displayLocation ==="southspine") {$displayLocation = "South Spine Cinema";}
                                $displayDate = date( "j F Y", strtotime($booking["screening_date"]) );
                                $displayTime = date( "g:i A", strtotime($booking["screening_time"]) );
                                $sessionDetails = $displayLocation . " · " . $displayDate . " · " . $displayTime;
                                ?>
                        <article class="account-booking-card" 
                        data-booking-status="<?php echo htmlspecialchars($bookingStatus); ?>"
                        data-booking-id="<?php echo (int) $booking["booking_id"]; ?>"
                        <?php if ($bookingStatus !== "upcoming"): ?> hidden
                        <?php endif; ?>
                        >
                        <img 
                        src="<?php echo htmlspecialchars($posterPath); ?>"
                        alt="<?php echo htmlspecialchars($booking["movie_title"]
                        );
                        ?> poster" class="account-booking-poster">
                        <div class="account-booking-info">
                            <h3><?php echo htmlspecialchars($booking["movie_title"]);?></h3>
                            <p><?php echo htmlspecialchars($sessionDetails);?></p>
                            <p>Seats: <?php echo htmlspecialchars($booking["seats"]?? "not available"); ?></p>
                            <p>Reference: <span class="booking-reference"> <?php echo htmlspecialchars( $booking["reference_number"] ); ?> </span> </p>
                            <p>Total: $ <?php echo number_format( $booking["total_amount"], 2 ); ?> </p>
                        </div>
                        <div class="account-booking-actions">
                            <span class="booking-status <?php echo htmlspecialchars($bookingStatus); ?>"> <?php echo ucfirst( htmlspecialchars($bookingStatus) ); ?> </span>
                            <button type="button" class="btn btn-secondary view-booking-button" 
                                data-movie-title="<?php echo htmlspecialchars( $booking["movie_title"] ); ?>"
                                data-session="<?php echo htmlspecialchars($sessionDetails); ?>"
                                data-seats="<?php echo htmlspecialchars( $booking["seats"] ?? "" ); ?>"
                                data-reference="<?php echo htmlspecialchars( $booking["reference_number"] ); ?>">
                                View Details 
                            </button>
                            <?php if ($bookingStatus === "upcoming"): ?>
                            <button type="button" class="cancel-booking-button" 
                                data-booking-id="<?php echo (int) $booking["booking_id"]; ?>"
                                data-movie-title="<?php echo htmlspecialchars( $booking["movie_title"] ); ?>"
                                data-session="<?php echo htmlspecialchars($sessionDetails); ?>">
                                Cancel Booking
                             </button>
                             <?php endif; ?>
                            </div>
                            </article>
                            <?php endforeach; ?>
                           <p class="empty-account-message" id="empty-booking-message" hidden > No bookings found. </p>

                        <?php endif; ?>             

                </div>
            
          </section>
          <div class="account-lower-layout">
            <section class="account-selection" id="submissions">
                <div class="account-section-heading">
                    <div>
                        <h2>Film Submissions</h2>
                        <p>Track your submitted student films.</p>
                    </div>
                </div>
                <div class="film-submission-list" id="film-submission-list">
                    <?php if (count($filmSubmissions) === 0): ?>
                        <p class="empty-account-message">
                            You have not submitted any films.</p>
                    <?php else: ?>
                        <?php foreach($filmSubmissions as $submission): ?>
                        <article class="account-film-submission">
                            <h3>
                                <?php echo htmlspecialchars($submission["film_title"]);
                                ?></h3>
                                <p> Submitted
                                    <?php echo date ("j F Y", strtotime($submission["submitted_at"]));
                                    ?>
                                    .
                                    <?php echo htmlspecialchars($submission["reference_number"]); ?>
                        </p>
                        <span class="submission-status">
                            <?php echo htmlspecialchars($submission["status"]); ?> </span>
                        </article>
                        <?php endforeach; ?>
                        <?php endif; ?>
                </div>
            </section>
            
          </div>
          <section class="sign-out-section">
                <div>
                    <h2>Sign Out</h2>
                    <p>You will need to sign in again to view and manage your bookings.</p>
                </div>
                <button type="button" class="btn sign-out-button" id="sign-out-button">Sign Out</button>
            </section>
    </main>
    <!-- cancellation modal -->
     <dialog class="account-modal" id="cancel-booking-modal">
        <div class="account-modal-content">
            <p class="account-modal-label">CANCEL BOOKING</p>
            <h2>Are you sure?</h2>
            <p class="account-modal-message">This booking will be moved to your cancelled bookings.<br>This action cannot be undone</p>
            <div class="cancel-booking-summary">
                <strong id="cancel-movie-title"></strong>
                <span id="cancel-session-details"></span>
            </div>

            <form action="process-cancellation.php" method="post" class="account-modal-actions">
                <input type="hidden" name="bookingId" id="cancel-booking-id">
                <button type="button" class="btn btn-secondary" id="keep-booking-button">Keep Booking</button>
                <button type="submit" class="btn cancel-confirm-button" id="confirm-cancellation-button">Confirm Cancellation</button>
            </form>
        </div>

     </dialog>
    <script src="js/account.js"></script>
</body>
</html>