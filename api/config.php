<?php
// Start output buffering immediately
if (ob_get_level() == 0) { ob_start(); }

// Ensure errors are not displayed in the output, breaking JSON
error_reporting(0);
ini_set('display_errors', 0);
// Attempt to load production config if it exists
if (file_exists(__DIR__ . '/config.prod.php')) {
    require_once __DIR__ . '/config.prod.php'; // Load production overrides
} else {
    // --- Default Development Database Configuration --- 
    // IMPORTANT: Replace placeholders if your local setup differs
    define('DB_HOST', 'localhost'); // Usually 'localhost'
    define('DB_USER', 'root'); // Standard XAMPP user
    define('DB_PASS', ''); // Standard XAMPP password (empty)
    define('DB_NAME', 'notesvault_local');   // Your local database name

    // --- Default Development JWT Configuration ---
    // IMPORTANT: Replace with a strong, randomly generated secret key for production!
    define('JWT_SECRET_KEY', 'local_dev_secret_key_please_replace_if_needed'); // Temporary key for local dev
    define('JWT_EXPIRATION_TIME', 3600); // Token valid for 1 hour (in seconds)
}

// --- Shared Configuration (Applies to both dev and prod unless overridden in config.prod.php) ---

// Database Configuration
// IMPORTANT: Replace placeholders with your actual Hostinger MySQL credentials

// These are now defaults for development, moved inside the 'else' block above
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

// These are now defaults for development, moved inside the 'else' block above
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
function sendJsonResponse(array $data, int $statusCode = 200) {
    // Ensure no output has been sent yet and clean buffer if necessary
    if (headers_sent($file, $line)) {
        error_log("Headers already sent in $file on line $line before sendJsonResponse was called.");
        // Attempt to clean buffer anyway, but it might be too late
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        // Cannot reliably send JSON now, maybe exit or log further
        exit; // Exit to prevent further output
    }

    // Clean any existing output buffer content
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    // Set headers *after* cleaning buffer and checking headers_sent
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, must-revalidate'); // Prevent caching issues
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

    // Encode and output JSON
    echo json_encode($data, JSON_UNESCAPED_UNICODE); // Removed PRETTY_PRINT

    // Terminate script
    exit;
}

?>