<?php
//load db connection file
//_DIR_ refers to the folder containing test.php
require_once __DIR__. "/includes/database.php";

//line runs only when connection suceeds
echo "PHP and MySQL are connected";

//close connection after testing.
$db->close();
?>