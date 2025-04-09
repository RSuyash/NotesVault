<?php
session_start(); // Start the session to access logged-in user info
require_once 'config.php'; // Include your database configuration

header('Content-Type: application/json'); // We will return JSON

// --- Configuration ---
$uploadDir = __DIR__ . '/uploads/avatars/'; // Directory to store avatars (relative to this script's location)
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 2 * 1024 * 1024; // 2 MB

// --- Check Authentication ---
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'User not authenticated.']);
    exit;
}
$userId = $_SESSION['user_id'];

// --- Check if file was uploaded ---
if (!isset($_FILES['profilePic']) || $_FILES['profilePic']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    $errorMessage = 'No file uploaded or upload error occurred.';
    if (isset($_FILES['profilePic']['error'])) {
        // Provide more specific error messages if possible
        switch ($_FILES['profilePic']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage = 'File is too large.';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMessage = 'File was only partially uploaded.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage = 'No file was uploaded.';
                break;
            default:
                $errorMessage = 'An unknown upload error occurred.';
                break;
        }
    }
    echo json_encode(['success' => false, 'message' => $errorMessage]);
    exit;
}

$file = $_FILES['profilePic'];
$fileTmpPath = $file['tmp_name'];
$fileName = $file['name'];
$fileSize = $file['size'];
$fileType = mime_content_type($fileTmpPath); // More reliable than $_FILES['profilePic']['type']

// --- Validate File Type ---
if (!in_array($fileType, $allowedTypes)) {
    http_response_code(415); // Unsupported Media Type
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF, WebP allowed.']);
    exit;
}

// --- Validate File Size ---
if ($fileSize > $maxFileSize) {
    http_response_code(413); // Payload Too Large
    echo json_encode(['success' => false, 'message' => 'File size exceeds the limit of 2MB.']);
    exit;
}

// --- Create Upload Directory if it doesn't exist ---
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true)) {
    http_response_code(500); // Internal Server Error
    error_log("Failed to create upload directory: " . $uploadDir); // Log error server-side
    echo json_encode(['success' => false, 'message' => 'Server error: Could not create upload directory.']);
    exit;
}

// --- Generate Unique Filename ---
$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
$uniqueFilename = 'user_' . $userId . '_' . time() . '.' . strtolower($fileExtension);
$destinationPath = $uploadDir . $uniqueFilename;
$relativePath = 'uploads/avatars/' . $uniqueFilename; // Path to store in DB

// --- Move Uploaded File ---
if (!move_uploaded_file($fileTmpPath, $destinationPath)) {
    http_response_code(500); // Internal Server Error
    error_log("Failed to move uploaded file from $fileTmpPath to $destinationPath"); // Log error
    echo json_encode(['success' => false, 'message' => 'Server error: Could not save uploaded file.']);
    exit;
}

// --- Update Database ---
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Optional: Delete old profile picture file if it exists and is different
    $stmtSelect = $pdo->prepare("SELECT profile_picture_path FROM users WHERE id = ?");
    $stmtSelect->execute([$userId]);
    $oldPath = $stmtSelect->fetchColumn();
    if ($oldPath && $oldPath !== $relativePath && file_exists(__DIR__ . '/' . $oldPath)) {
        unlink(__DIR__ . '/' . $oldPath);
    }

    // Update user record
    $stmtUpdate = $pdo->prepare("UPDATE users SET profile_picture_path = ? WHERE id = ?");
    $stmtUpdate->execute([$relativePath, $userId]);

    // --- Success Response ---
    http_response_code(200); // OK
    echo json_encode([
        'success' => true,
        'message' => 'Profile picture updated successfully.',
        'filePath' => $relativePath // Send back the relative path
    ]);

} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    error_log("Database error updating profile picture for user $userId: " . $e->getMessage()); // Log error
    // Attempt to delete the newly uploaded file if DB update failed
    if (file_exists($destinationPath)) {
        unlink($destinationPath);
    }
    echo json_encode(['success' => false, 'message' => 'Database error occurred.']);
    exit;
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    error_log("General error updating profile picture for user $userId: " . $e->getMessage()); // Log error
    if (file_exists($destinationPath)) {
        unlink($destinationPath);
    }
    echo json_encode(['success' => false, 'message' => 'An unexpected server error occurred.']);
    exit;
}
?>