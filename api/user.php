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
    // If the request is specifically for an auth check (e.g., from ProtectedRoute), return false
    // Otherwise, for profile fetch/update attempts, return 401
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check_auth') {
         sendJsonResponse(['authenticated' => false]);
    } else {
        sendJsonResponse(['error' => 'Unauthorized - Please log in'], 401);
    }
}

// If we reach here, $userId is valid.

// Handle different request methods or actions

// --- GET Request: Fetch profile or check auth ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Specific action for auth check (used by ProtectedRoute)
    if (isset($_GET['action']) && $_GET['action'] === 'check_auth') {
        sendJsonResponse(['authenticated' => true, 'userId' => $userId]);
    }

    // Default GET action: Fetch user profile
    // Default GET action: Fetch user profile (with new fields)
    $stmt = $conn->prepare("SELECT id, username, first_name, last_name, email, profile_picture_path FROM users WHERE id = ?"); // Fetch path now
    if (!$stmt) {
         sendJsonResponse(['error' => 'DB prepare failed (profile fetch)'], 500);
    }
    $stmt->bind_param("i", $userId);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($user = $result->fetch_assoc()) {
            // Ensure nulls are handled if needed by frontend
            $user['first_name'] = $user['first_name'] ?? '';
            $user['last_name'] = $user['last_name'] ?? '';
            $user['profile_picture_path'] = $user['profile_picture_path'] ?? null; // Return path
            sendJsonResponse($user);
        } else {
            sendJsonResponse(['error' => 'User not found'], 404);
        }
    } else {
        sendJsonResponse(['error' => 'Query failed (profile fetch)'], 500);
    }
    $stmt->close();
// --- POST Request: Update profile (excluding password) ---
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        sendJsonResponse(['error' => 'Invalid JSON'], 400);
    }

    // Extract fields to update
    $username = $data['username'] ?? null;
    $firstName = $data['first_name'] ?? null;
    $lastName = $data['last_name'] ?? null;
    $email = $data['email'] ?? null;
    // $profilePicUrl = $data['profile_picture_url'] ?? null; // This is handled by upload script now

    // Basic validation (adjust as needed)
    if ($username === null || $firstName === null || $lastName === null || $email === null) {
         sendJsonResponse(['error' => 'Username, first name, last name, and email are required'], 400);
    }
     if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['error' => 'Invalid email format'], 400);
    }
    // Optional: Validate profilePicUrl format if provided

    // Log received data for debugging
    error_log("User.php - Attempting update for user ID: $userId with data: username=$username, firstName=$firstName, lastName=$lastName, email=$email");

    // Prepare update statement (removed profile_picture_url)
    $sql = "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("User.php - Profile update prepare failed: " . $conn->error . " | SQL: $sql");
         sendJsonResponse(['error' => 'DB prepare failed (profile update)'], 500);
    }
    // Bind parameters (s = string, i = integer) - adjusted types
    $stmt->bind_param("ssssi", $username, $firstName, $lastName, $email, $userId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Fetch the updated profile to return it
             $fetchStmt = $conn->prepare("SELECT id, username, first_name, last_name, email, profile_picture_path FROM users WHERE id = ?"); // Fetch path now
             $fetchStmt->bind_param("i", $userId);
             $fetchStmt->execute();
             $result = $fetchStmt->get_result();
             $updatedUser = $result->fetch_assoc();
             $fetchStmt->close();
            // Also return success even if no rows were affected (data was the same)
            // Fetch the current user data to return
             $fetchStmt = $conn->prepare("SELECT id, username, first_name, last_name, email, profile_picture_path FROM users WHERE id = ?");
             $fetchStmt->bind_param("i", $userId);
             $fetchStmt->execute();
             $result = $fetchStmt->get_result();
             $currentUser = $result->fetch_assoc();
             $fetchStmt->close();
            sendJsonResponse(['success' => true, 'user' => $currentUser, 'message' => 'No changes detected.']);
        }
    } else {
         // Check for duplicate email error specifically
         if ($conn->errno === 1062) { // MySQL error code for duplicate entry
             sendJsonResponse(['error' => 'Email address already in use.'], 409); // 409 Conflict
         } else {
            error_log("User.php - Profile update execute failed: " . $stmt->error);
            sendJsonResponse(['error' => 'Profile update failed: ' . $stmt->error], 500);
         }
    }
    $stmt->close();
} else {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

$conn->close();
?>