<![CDATA[<?php
require_once 'config.php';

// --- IMPORTANT: Ensure JWT library is uploaded ---
// Assumes library is in vendor/firebase/php-jwt/src relative to this script
// You might need to adjust the path based on your upload location.
require_once __DIR__ . '/vendor/firebase/php-jwt/BeforeValidException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/ExpiredException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/SignatureInvalidException.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/JWT.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/Key.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


// Handle CORS and OPTIONS request
handleCors($allowed_origins);

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
    sendJsonResponse(['success' => false, 'error' => 'Database connection error'], 500);
}

// Find user by email
$stmt = $conn->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
if (!$stmt) {
     $conn->close();
     sendJsonResponse(['success' => false, 'error' => 'Database prepare error (find user)'], 500);
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // User not found
    $stmt->close();
    $conn->close();
    sendJsonResponse(['success' => false, 'error' => 'Incorrect email or password'], 401);
}

// User found, fetch data
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

// Verify password
if (password_verify($password, $user['password_hash'])) {
    // Password is correct

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
            // Optional: Include name/email if needed by frontend, but keep payload small
            // 'userName' => $user['name'],
            // 'userEmail'=> $user['email']
        ]
    ];

    try {
        // Ensure JWT_SECRET_KEY is defined and not empty
        if (!defined('JWT_SECRET_KEY') || empty(JWT_SECRET_KEY) || JWT_SECRET_KEY === 'YOUR_SUPER_SECRET_RANDOM_KEY_REPLACE_ME') {
            error_log("JWT Error: JWT_SECRET_KEY is not configured properly in config.php");
            throw new Exception("Server configuration error."); // Don't expose details
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

    } catch (Exception $e) {
        // Log the detailed error server-side
        error_log("JWT Encoding/Configuration Error: " . $e->getMessage());
        // Send generic error to client
        sendJsonResponse(['success' => false, 'error' => 'Could not process login. Please try again later.'], 500);
    }

} else {
    // Password incorrect
    sendJsonResponse(['success' => false, 'error' => 'Incorrect email or password'], 401);
}

?>]]>