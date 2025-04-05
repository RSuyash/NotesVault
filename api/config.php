<?php
// Start output buffering immediately
if (ob_get_level() == 0) { ob_start(); }

// Ensure errors are not displayed in the output, breaking JSON
error_reporting(0);
ini_set('display_errors', 0);
// Database Configuration
// IMPORTANT: Replace placeholders with your actual Hostinger MySQL credentials

define('DB_HOST', 'localhost'); // Usually 'localhost' on Hostinger shared hosting
define('DB_USER', 'root'); // Standard XAMPP user // Replace with your DB username
define('DB_PASS', ''); // Standard XAMPP password (empty) // Replace with your DB password
define('DB_NAME', 'notesvault_local');   // Your local database name   // Replace with your DB name

// Optional: Define allowed origins for CORS (adjust as needed)
// Ensure your frontend domain is included for production
$allowed_origins = [
    "http://localhost:5173", // React dev server
    "http://127.0.0.1:5173",
    "https://notesvault.in" // Replace with your actual frontend domain
];

// --- JWT Configuration ---
// IMPORTANT: Replace with a strong, randomly generated secret key!
// You can generate one using online tools or PHP's random_bytes function
define('JWT_SECRET_KEY', 'local_dev_secret_key_please_replace_if_needed'); // Temporary key for local dev
define('JWT_EXPIRATION_TIME', 3600); // Token valid for 1 hour (in seconds)


// --- Database Connection Function (using MySQLi) ---
function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        // In a real app, log this error instead of echoing
        // error_log("Database Connection failed: " . $conn->connect_error);
        return null; // Indicate connection failure
    }
    return $conn;
}

// --- CORS Handling Function ---
function handleCors($allowed_origins) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    } else {
        // Optionally deny or default to a specific origin if needed
        // header("Access-Control-Allow-Origin: https://notesvault.in"); // Example default
    }

    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow methods used by your API
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204); // No Content
        exit;
    }
}

// --- JSON Response Function ---
function sendJsonResponse($data, $statusCode = 200) {
    // Clean any previous output buffer to prevent corruption
    if (ob_get_level() > 0) {
        ob_end_clean(); // Discard buffer content
    }
    // Ensure buffering is started again if needed, though exit should prevent issues
    if (ob_get_level() == 0) { ob_start(); }

    header('Content-Type: application/json; charset=utf-8'); // Specify charset
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // Add flags for better encoding/readability
    exit; // Terminate script execution
}

?>