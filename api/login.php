<?php
require_once 'config.php';

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

    // --- TODO: Session/JWT Generation ---
    // 1. Generate a secure session token (e.g., using JWT library or PHP sessions)
    // 2. Include user ID and potentially other non-sensitive info in the token payload
    // 3. Set appropriate expiration time for the token
    // ------------------------------------

    // Placeholder: Return success and dummy token
    $token = "dummy_jwt_token_replace_me"; // Replace with actual token generation

    sendJsonResponse([
        'success' => true,
        'message' => 'Login successful!',
        'access_token' => $token,
        'token_type' => 'bearer', // Standard practice for JWT
        'user' => [ // Optionally return some user info (excluding password)
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);

} else {
    // Password incorrect
    sendJsonResponse(['success' => false, 'error' => 'Incorrect email or password'], 401);
}

?>