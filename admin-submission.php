<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

session_start();
if(!isset($_SESSION["user_id"])){
    header("Location: login.php");
    exit;
}

if(!isset($_SESSION["role"]) || $_SESSION["role"] !=="admin"){
    http_response_code(403);
    echo "<h1>Access Denied</h1>";
    echo "<p>You must be an adminstrator to view this page.</p>";
    exit;
}

require_once __DIR__ . "/includes/database.php";

$sql="
SELECT
 submission_id,
 reference_number,
 film_title,
 genre,
 runtime_minutes,
 director,
 submitter_name,
 submitter_email,
 status
 FROM film_submissions
 ORDER BY reference_number DESC
 ";

 $result = $db->query($sql);

 if(!$result){
    exit("Unable to retrieve submissions: ". $db->error);
 }
 ?>
 <!DOCTYPE html>
 <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0">
            <title>Film Submissions | Nayang Film House</title>
            <link rel="stylesheet" href="css/style.css">
            <link rel="icon" type="image/png" href="images/favicon-dark.ico" >
    </head>

<body>
    <header>
        <nav class="navbar">                
            <a href="index.html" class="logo"> <img src="images/logo/logo-navbar.png" alt="Nanyang Film House"> </a>
            <div class="nav-links"> </div>
            <a href="logout.php" class="logout-icon" aria-label="Sign Out" title="Sign out">
                <img src="images/logout-icon.png" alt="Sign Out">
            </a>
        </nav>
    </header>

    <main class="container admin-submissions-page">
        <div class="admin-page-heading">
            
            <div>
                <p class="eyebrows">ADMINSTRATION</p>
                <h1>Film Submissions</h1>
                <p>Review films submitted by students.</p>
            </div>
            <a href="admin-submission.php" class="refresh-button" aria-label="Refresh Submissions" title="Refresh submissions">↻</a>
        </div>
        
        <?php if (isset($_GET["updated"])): ?>

            <?php if ($_GET["updated"] === "1"): ?>
                <div class="admin-feedback success-feedback" role="status">
                    Submission status updated successfully.
                </div>

            <?php elseif ($_GET["updated"] === "0"): ?>
                <div class="admin-feedback" role="alert">
                    No submission was updated. It may have already been reviewed.
                </div>
            <?php endif; ?>

        <?php endif; ?>


        <?php if ($result->num_rows === 0): ?>
            <p class="empty-message">No film submissions were found.</p>

        <?php else: ?>
            <div class="table-wrapper">
                <table class="submissions-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Film</th>
                            <th>Genre</th>
                            <th>Runtime</th>
                            <th>Director</th>
                            <th>Submitted By</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($submission = $result->fetch_assoc()): ?>
                            <tr>
                                <td>
                                    <?= htmlspecialchars($submission["reference_number"])?>
                                </td>
                                <td>
                                    <?= htmlspecialchars($submission["film_title"])?>
                                </td>
                                <td>
                                    <?= htmlspecialchars($submission["genre"])?>
                                </td>
                                <td>
                                    <?= htmlspecialchars($submission["runtime_minutes"])?>
                                </td>
                                <td>
                                    <?= htmlspecialchars($submission["director"])?>
                                </td>
                                <td>
                                    <strong>
                                    <?= htmlspecialchars($submission["submitter_name"])?>
                                    </strong>
                                    <br>
                                    <?= htmlspecialchars($submission["submitter_email"])?>
                                </td>
                                <td>
                                    <?php
                                    $status = strtolower($submission["status"]);
                                    if($status === "approved"){
                                        $statusClass = " status-approved";
                                    }elseif ($status === "rejected") {
                                        $statusClass = "status-rejected";
                                    }else{
                                        $statusClass = "status-pending";
                                    }?>
                                    <span class="status-badge <?= $statusClass ?>">
                                        <?= htmlspecialchars(ucwords(str_replace("_"," ",$status)))?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($submission["status"] === "pending review"): ?>
                                    <form action="process-submission-status.php" method="post" class="submission-actions">
                                        <input type="hidden" name="submission_id" value="<?= (int)$submission["submission_id"] ?>">
                                        <button type="submit" name="action" value="approved" class="approved-button">Approve</button>
                                        <button type="submit" name="action" value="rejected" class="rejected-button">Reject</button>

                                    </form>
                               <?php else: ?>
                                <span>Reviewed</span>
                             <?php endif; ?>
                               </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                        </table>
                        </div>

                        <?php endif; ?>

    </main>      
    </body>
    </html>
    <?php

    $result->free();
    $db->close();
    ?>




