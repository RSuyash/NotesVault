<?php
// Ensure session starts before any output
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Log session status and user ID for debugging
error_log("User.php - Session status: " . session_status());
error_log("User.php - Session ID: " . session_id());
error_log("User.php - User ID from session: " . ($_SESSION['user_id'] ?? 'Not Set'));
require_once __DIR__ . '/config.php';

// Handle CORS
handleCors($allowed_origins);

// Connect to DB
$conn = getDbConnection();
if (!$conn) {
    sendJsonResponse(['error' => 'Database connection failed'], 500);
}

// Get user ID from session
$userId = $_SESSION['user_id'] ?? null;

// Check if user is logged in
if (!$userId) {
    // If it's just a check (e.g., GET request with no specific action implied),
    // return auth status instead of full error immediately.
    // Specific actions below will still fail if no userId.
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['action'])) { // Simple check
         sendJsonResponse(['authenticated' => false]);
    } else {
        sendJsonResponse(['error' => 'Unauthorized - Please log in'], 401);
    }
}

// If we reach here, $userId is valid.

// Handle different request methods or actions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If it's just a check, return authenticated status
    if (!isset($_GET['action'])) {
        sendJsonResponse(['authenticated' => true, 'userId' => $userId]);
    }

    // --- Fetch user profile (existing logic) ---
    // Fetch user profile
    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($user = $result->fetch_assoc()) {
            sendJsonResponse($user);
        } else {
            sendJsonResponse(['error' => 'User not found'], 404);
        }
    } else {
        sendJsonResponse(['error' => 'Query failed'], 500);
    }
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update user profile
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        sendJsonResponse(['error' => 'Invalid JSON'], 400);
    }

    $name = $data['name'] ?? null;
    $email = $data['email'] ?? null;

    if (!$name || !$email) {
        sendJsonResponse(['error' => 'Name and email required'], 400);
    }

    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $userId);
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJsonResponse(['success' => true]);
        } else {
            sendJsonResponse(['error' => 'No changes or user not found'], 400);
        }
    } else {
        sendJsonResponse(['error' => 'Update failed'], 500);
    }
    $stmt->close();
} else {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

$conn->close();
?>