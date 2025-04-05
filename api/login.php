<?php
// Start output buffering immediately
if (ob_get_level() == 0) { ob_start(); }

// Ensure errors are not displayed in the output, breaking JSON
error_reporting(0);
ini_set('display_errors', 0);

require_once 'config.php';

// --- IMPORTANT: Ensure JWT library is uploaded ---
// Assumes library is in vendor/firebase/php-jwt/src relative to this script
// You might need to adjust the path based on your upload location.
require_once __DIR__ . '/vendor/firebase/php-jwt/BeforeValidException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/ExpiredException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/SignatureInvalidException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/JWT.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/Key.php';

// Use statements must be at the top level
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Check if JWT Secret Key is defined *after* config include and JWT lib includes
if (!defined('JWT_SECRET_KEY') || empty(JWT_SECRET_KEY)) {
    error_log("Login Error: JWT_SECRET_KEY is not defined or empty. Check config.php and the key file.");
    // Send JSON response immediately
    sendJsonResponse(['success' => false, 'error' => 'Server configuration error preventing login. Please contact support.'], 500);
    // The sendJsonResponse function includes an exit, so script stops here.
}

// Wrap subsequent logic in try-catch
try {

    // Handle CORS and OPTIONS request
    handleCors($allowed_origins); // Note: handleCors already calls exit on OPTIONS

    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJsonResponse(['success' => false, 'error' => 'Method Not Allowed'], 405);
    }
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Basic Validation
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        sendJsonResponse(['success' => false, 'error' => 'Invalid input data'], 400);
    }

    $email = trim($input['email']);
    $password = $input['password']; // Don't trim password

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
        sendJsonResponse(['success' => false, 'error' => 'Valid email and password are required'], 400);
    }

    // Get DB connection
    $conn = getDbConnection();
    if (!$conn) {
        // Log the specific connection error if possible, without sending details to client
        error_log("Login DB Connection Error: Unable to connect to database.");
        sendJsonResponse(['success' => false, 'error' => 'Database service unavailable. Please try again later.'], 503); // 503 Service Unavailable
    }

    // Find user by email
    $stmt = $conn->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
    if (!$stmt) {
         $db_error = $conn->error;
         $conn->close();
         error_log("Login DB Prepare Error (find user): " . $db_error);
         sendJsonResponse(['success' => false, 'error' => 'Database error (FU). Please try again.'], 500);
    }
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        $db_error = $stmt->error;
        $stmt->close();
        $conn->close();
        error_log("Login DB Execute Error (find user): " . $db_error);
        sendJsonResponse(['success' => false, 'error' => 'Database error (FU). Please try again.'], 500);
    }
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // User not found
        $stmt->close();
        $conn->close();
        sendJsonResponse(['success' => false, 'error' => 'Incorrect email or password'], 401); // Unauthorized
    }

    // User found, fetch data
    $user = $result->fetch_assoc();
    $stmt->close(); // Close statement after fetching
    // Keep connection open for password_verify if needed, or close if not

    // Verify password
    if (password_verify($password, $user['password_hash'])) {
        // Password is correct
        $conn->close(); // Close connection now we're done with DB

        // --- Generate JWT Token ---
        $issuedAt   = time();
        $expire     = $issuedAt + JWT_EXPIRATION_TIME; // Use expiration from config
        $serverName = $_SERVER['SERVER_NAME'] ?? 'notesvault.in'; // Use server name or default

        $payload = [
            'iat'  => $issuedAt,         // Issued at: time when the token was generated
            'iss'  => $serverName,       // Issuer
            'nbf'  => $issuedAt,         // Not before
            'exp'  => $expire,           // Expire
            'data' => [                  // Data related to the logged-in user
                'userId'   => $user['id'], // User ID from database
            ]
        ];

        // Nested try-catch specifically for JWT generation/config issues
        try {
            // Ensure JWT_SECRET_KEY is defined and not empty
            if (!defined('JWT_SECRET_KEY') || empty(JWT_SECRET_KEY) || JWT_SECRET_KEY === 'YOUR_SUPER_SECRET_RANDOM_KEY_REPLACE_ME' || JWT_SECRET_KEY === 'local_dev_secret_key_please_replace_if_needed') {
                error_log("JWT Error: JWT_SECRET_KEY is not configured properly in config.php");
                throw new Exception("Server configuration error for JWT."); // Don't expose details
            }

            $jwt = JWT::encode($payload, JWT_SECRET_KEY, 'HS256'); // Use secret from config

            sendJsonResponse([
                'success' => true,
                'message' => 'Login successful!',
                'access_token' => $jwt,
                'token_type' => 'bearer',
                'expires_in' => JWT_EXPIRATION_TIME,
                'user' => [ // Return non-sensitive user info
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ]);

        } catch (Exception $jwtEx) {
            // Log the detailed JWT error server-side
            error_log("JWT Encoding/Configuration Error: " . $jwtEx->getMessage());
            // Send generic error to client
            sendJsonResponse(['success' => false, 'error' => 'Could not process login session. Please try again later.'], 500);
        }

    } else {
        // Password incorrect
        $conn->close(); // Close connection
        sendJsonResponse(['success' => false, 'error' => 'Incorrect email or password'], 401); // Unauthorized
    }

} catch (Throwable $e) { // Catch any other throwable error/exception
    // Log the detailed error
    error_log("Unexpected Login Error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());

    // Ensure connection is closed if it was opened and is still valid
    if (isset($conn) && $conn instanceof mysqli && $conn->thread_id) {
        $conn->close();
    }

    // Send a generic error response
    sendJsonResponse(['success' => false, 'error' => 'An unexpected server error occurred during login. Please try again later.'], 500);
}

?>