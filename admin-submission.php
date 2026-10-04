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
    </head>

<body>
    <header>
        <nav class="navbar">
            <div class="nav-links">
                <a href="admin-submission.php">Film Submissions</a>
            </div>
            <a href="logout.php">Sign Out</a>
        </nav>
    </header>

    <main class="container admin-submissions-page">
        <div class="admin-page-heading">
            <div>
                <p class="eyebrows">ADMINSTRATION</p>
                <h1>Film Submissions</h1>
                <p>Review films submitted by students.</p>
            </div>
        </div>
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
                                    <span class="status-badge">
                                        <?= htmlspecialchars(ucwords(str_replace("_"," ",$submission["status"])))?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($submission["status"] === "pending_review"): ?>
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




