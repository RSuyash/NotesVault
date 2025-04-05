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
if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid input data'], 400);
}

$name = trim($input['name']);
$email = trim($input['email']);
$password = $input['password']; // Don't trim password

if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    sendJsonResponse(['success' => false, 'error' => 'Name, valid email, and password are required'], 400);
}

// Example: Password strength (adjust as needed)
if (strlen($password) < 6) {
     sendJsonResponse(['success' => false, 'error' => 'Password must be at least 6 characters long'], 400);
}

// Get DB connection
$conn = getDbConnection();
if (!$conn) {
    sendJsonResponse(['success' => false, 'error' => 'Database connection error'], 500);
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
if (!$stmt) {
     sendJsonResponse(['success' => false, 'error' => 'Database prepare error (check email)'], 500);
}
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    sendJsonResponse(['success' => false, 'error' => 'Email already registered'], 409); // 409 Conflict
}
$stmt->close();

// Hash the password
$password_hash = password_hash($password, PASSWORD_BCRYPT); // Or PASSWORD_DEFAULT
if ($password_hash === false) {
     $conn->close();
     sendJsonResponse(['success' => false, 'error' => 'Failed to hash password'], 500);
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
if (!$stmt) {
     $conn->close();
     sendJsonResponse(['success' => false, 'error' => 'Database prepare error (insert user)'], 500);
}
$stmt->bind_param("sss", $name, $email, $password_hash);

if ($stmt->execute()) {
    // Success
    $stmt->close();
    $conn->close();
    sendJsonResponse(['success' => true, 'message' => 'Signup successful!', 'email' => $email]);
} else {
    // Failure
    $error_message = $stmt->error; // Get specific DB error
    $stmt->close();
    $conn->close();
    // Log the detailed error server-side
    error_log("Signup DB Error: " . $error_message);
    sendJsonResponse(['success' => false, 'error' => 'Failed to register user. Please try again.'], 500);
}

?>