<?php
session_start();
if(!isset($_SESSION["user_id"]){
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
 submission_ref,
 film_title,
 genre,
 runtime,
 director,
 submitter_name,
 submitter_email,
 status
 FROM submit_films
 ORDER BY submission_ref DESC
 ";

 $result = $db-query($sql);
 if(!result){
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
            <a href="index.html" class="logo">NTU Films</a>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="moviecatalog.html" class="active">Movies</a>
                <a href="submit.php">Submit a Film</a>
            </div>
            <a href="account.php">My Account</a>
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
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($submission = $result->fetch_assoc()): ?>
                            <tr>
                                <td>
                                    <? = htmlspecialchars($submission["submission_ref"])?>
                                </td>
                                <td>
                                    <? = htmlspecialchars($submission["film_title"])?>
                                </td>
                                <td>
                                    <? = htmlspecialchars($submission["genre"])?>
                                </td>
                                <td>
                                    <? = htmlspecialchars($submission["runtime"])?>
                                </td>
                                <td>
                                    <? = htmlspecialchars($submission["director"])?>
                                </td>
                                <td>
                                    <? = htmlspecialchars($submission["submitter_name"])?>
                                </td>
                        </tr>

    </main>      



