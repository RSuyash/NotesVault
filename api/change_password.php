<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$conn = getDbConnection();
if (!$conn) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Fetch current password hash
$stmt = $conn->prepare("SELECT password_hash FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}

if (!password_verify($currentPassword, $user['password_hash'])) {
    echo json_encode(['success' => false, 'error' => 'Incorrect current password']);
    exit;
}

// Hash new password
$newHash = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password
$updateStmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
$updateStmt->bind_param("si", $newHash, $userId);
if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update password']);
}
$updateStmt->close();
$conn->close();
?>