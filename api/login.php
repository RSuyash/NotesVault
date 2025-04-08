<?php
session_start(); // Start session at the very beginning
// Start output buffering immediately
if (ob_get_level() == 0) { ob_start(); }

// Ensure errors are not displayed in the output, breaking JSON
error_reporting(0);
ini_set('display_errors', 0);

require_once 'config.php';

// JWT library no longer needed

// JWT check no longer needed

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
        // Password is correct - Store user ID in session
        $_SESSION['user_id'] = $user['id'];
        $conn->close(); // Close connection now we're done with DB

        // Send success response (no token needed)
        sendJsonResponse([
            'success' => true,
            'message' => 'Login successful!',
            'user' => [ // Return non-sensitive user info
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);

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