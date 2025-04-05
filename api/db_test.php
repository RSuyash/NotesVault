<?php
// Simple script to test the database connection defined in config.php

// Include the configuration file
require_once 'config.php';

// Set content type to plain text for clear output in browser/curl
header('Content-Type: text/plain');

echo "Attempting to connect to database...\n";
echo "Host: " . DB_HOST . "\n";
echo "User: " . DB_USER . "\n";
// Mask password for security, even in test scripts
echo "Password: [HIDDEN]\n";
echo "Database: " . DB_NAME . "\n";
echo "------------------------------------\n";

// Get the database connection
$conn = getDbConnection();

// Check if the connection was successful
if ($conn) {
    echo "SUCCESS: Database connection established successfully!\n";

    // Optional: Perform a simple query to confirm interaction
    $result = $conn->query("SELECT DATABASE()"); // Check which DB is selected
    if ($result) {
        $dbName = $result->fetch_row()[0];
        echo "Verified connection to database: '" . $dbName . "'\n";
        $result->close();
    } else {
        echo "WARNING: Could not execute simple verification query: " . $conn->error . "\n";
    }

    $conn->close(); // Close the connection
    echo "Connection closed.\n";
} else {
    echo "ERROR: Failed to connect to the database using getDbConnection().\n";

    // Attempt connection again directly to get specific error for debugging
    // Be cautious about exposing detailed errors on a live server.
    $conn_check = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); // Use @ to suppress default warning

    if ($conn_check->connect_error) {
         echo "Direct Connection Error Details: (" . $conn_check->connect_errno . ") " . $conn_check->connect_error . "\n";
    } else {
        // This case should ideally not happen if getDbConnection failed
        echo "UNEXPECTED: Connection failed via getDbConnection() but a direct connection attempt succeeded now. Check config.php logic.\n";
        $conn_check->close();
    }
}

echo "------------------------------------\n";
echo "Test script finished.\n";

?>