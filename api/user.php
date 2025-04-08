<?php
session_start(); // Start session
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
    sendJsonResponse(['error' => 'Unauthorized - Please log in'], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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