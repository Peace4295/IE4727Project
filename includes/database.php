<?php

//connect to MySQL server and select the ntu_films database.
//Parameters: server, username, password, database name
//@ suppresses PHP automatic warning output
@ $db = new mysqli(
    "localhost",        //MySQL is running on this computer
    "root",             //XAMPP's default db username
    "",                 //XAMPP's default local pw is empty
    "ntu_films",        // the database that i created
);

//check whether the connection was unsucessful
if (mysqli_connect_errno()){
    echo "Error: Could not connect to the database";
    exit;
}