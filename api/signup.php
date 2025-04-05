<?php
// Start output buffering immediately
if (ob_get_level() == 0) { ob_start(); }

// Ensure errors are not displayed in the output, breaking JSON
error_reporting(0);
ini_set('display_errors', 0);

require_once 'config.php';

// Handle CORS and OPTIONS request
handleCors($allowed_origins);


// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Method Not Allowed'], 405);
}

// Wrap main logic in try-catch for unexpected errors
try {
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
        // Log the specific connection error if possible, without sending details to client
        error_log("Signup DB Connection Error: Unable to connect to database.");
        sendJsonResponse(['success' => false, 'error' => 'Database service unavailable. Please try again later.'], 503); // 503 Service Unavailable is often appropriate
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
         $db_error = $conn->error;
         $conn->close();
         error_log("Signup DB Prepare Error (check email): " . $db_error);
         sendJsonResponse(['success' => false, 'error' => 'Database error (CE). Please try again.'], 500);
    }
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        $db_error = $stmt->error;
        $stmt->close();
        $conn->close();
        error_log("Signup DB Execute Error (check email): " . $db_error);
        sendJsonResponse(['success' => false, 'error' => 'Database error (CE). Please try again.'], 500);
    }
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $conn->close();
        sendJsonResponse(['success' => false, 'error' => 'Email already registered'], 409); // 409 Conflict
    }
    $stmt->close(); // Close statement after use

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_BCRYPT); // Or PASSWORD_DEFAULT
    if ($password_hash === false) {
         $conn->close();
         error_log("Signup Error: Failed to hash password for email: " . $email);
         sendJsonResponse(['success' => false, 'error' => 'Server error during signup (PH). Please try again.'], 500);
    }

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    if (!$stmt) {
         $db_error = $conn->error;
         $conn->close();
         error_log("Signup DB Prepare Error (insert user): " . $db_error);
         sendJsonResponse(['success' => false, 'error' => 'Database error (IU). Please try again.'], 500);
    }
    $stmt->bind_param("sss", $name, $email, $password_hash);

    if ($stmt->execute()) {
        // Success
        $user_id = $stmt->insert_id; // Get the new user's ID
        $stmt->close();
        $conn->close();
        // Consider what info to return on success. Avoid sending sensitive data.
        sendJsonResponse(['success' => true, 'message' => 'Signup successful!', 'userId' => $user_id]); // Return user ID maybe?
    } else {
        // Failure during execute
        $error_message = $stmt->error; // Get specific DB error
        $stmt->close();
        $conn->close();
        // Log the detailed error server-side
        error_log("Signup DB Execute Error (insert user): " . $error_message);
        sendJsonResponse(['success' => false, 'error' => 'Failed to register user. Please try again.'], 500);
    }

} catch (Throwable $e) { // Catch any throwable error/exception
    // Log the detailed error
    error_log("Unexpected Signup Error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());

    // Ensure connection is closed if it was opened
    if (isset($conn) && $conn instanceof mysqli && $conn->thread_id) {
        $conn->close();
    }

    // Send a generic error response
    sendJsonResponse(['success' => false, 'error' => 'An unexpected server error occurred. Please try again later.'], 500);
}

?>