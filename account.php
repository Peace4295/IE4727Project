<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);

require_once __DIR__. "/includes/database.php";

$query = "
SELECT
film_title,
reference_number,
status,
submitted_at
FROM film_submissions
ORDER BY submitted_at DESC";

$result=$db->query($query);

if(!$result) {
    die("The film submissions could not be loaded.");
}

$submissionCount = $result->num_rows;

//store the retrieved database rows in a php array
$filmSubmissions = array();
//count subms that are still pending review
$pendingReviewCount = 0;

while ($submission = $result->fetch_assoc()){
    $filmSubmissions[] = $submission;

    if ($submission["status"]==="pending review"){
        $pendingReviewCount++;
    }
}

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
                <a href="submit.html">Submit a Film</a>
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
                <h1 id="profile-name">Priscilla Chong</h1>
                <p id="profile-email">pris0038@e.ntu.edu.sg</p>
            </div>
            <button type="button" class="btn btn-secondary" id="edit-profile-button">Edit Profile</button>
         </section>
         <!-- account -->
         <section class="account-statistics" aria-label="Account overview">
            <div class="account-stats">
                <p>Upcoming Bookings</p>
                <strong id="upcoming-booking-count">0</strong>
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
                <div class="list" id="account-booking-list" aria-live="polite"></div>
            
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
            <div class="account-modal-actions">
                <button type="button" class="btn btn-secondary" id="keep-booking-button">Keep Booking</button>
                <button type="button" class="btn cancel-confirm-button" id="confirm-cancellation-button">Confirm Cancellation</button>
            </div>
        </div>

     </dialog>
    <script src="js/account.js"></script>
</body>
</html>