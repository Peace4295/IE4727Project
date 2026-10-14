<?php

session_start();

if(!isset($_SESSION["user_id"])){
    header("Location: login.php");
    exit;
}

if(!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin"){
    http_response_code(403);
    exit("Access denied.");
}

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    header("Location: admin-submission.php");
    exit;
}

$submissionId = filter_input(
    INPUT_POST,
    "submission_id",
    FILTER_VALIDATE_INT
);

$action = $_POST["action"] ??"";

$allowedActions = ["approved", "rejected"];

if(!$submissionId || !in_array($action, $allowedActions, true)) {
    exit("Invalid submission request.");
}

require_once __DIR__. "/includes/database.php";

$sql = "
UPDATE film_submissions
SET status = ?
WHERE submission_id = ?
    AND status = 'pending review'
    ";

$statement = $db->prepare($sql);

if(!$statement) {exit("Unable to prepare update: ". $db->error);}
$statement->bind_param("si", $action, $submissionId);

if(!$statement->execute()){
    exit("Unable to update submission: ". $statement->error);
}

$statement->close();
$db->close();

header("Location: admin-submission.php?updated=1");
exit;