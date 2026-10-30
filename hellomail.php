<body>

<h1>Hello Mail</h1>
<p>My first mail test.</p>
<?php
require "/Applications/XAMPP/xamppfiles/htdocs/IE4727Project/mail_patch.php";
use function mail_patch\mail;

$to = "f32ee@localhost";
$subject = "the subject";
$message = "hello from php mail";

$headers = "From: f32ee@localhost\r\n" .
           "Reply-To: f32ee@localhost\r\n" .
           "X-Mailer: PHP/" . phpversion();

mail($to, $subject, $message, $headers, "-ff32ee@localhost");

echo "mail sent to : " . $to;
?>


