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
    $conn = getDbConnection(); // Use the function from config.php
    if (!$conn) {
        // Log the specific connection error if possible, using mysqli_connect_error() before throwing
        $connectError = mysqli_connect_error();
        error_log("Database connection failed in upload_profile_picture: " . $connectError);
        throw new Exception("Database connection failed.");
    }

    // Optional: Delete old profile picture file if it exists and is different
    $stmtSelect = $conn->prepare("SELECT profile_picture_path FROM users WHERE id = ?");
    if (!$stmtSelect) throw new Exception("Prepare failed (SELECT): " . $conn->error);
    $stmtSelect->bind_param("i", $userId);
    if (!$stmtSelect->execute()) throw new Exception("Execute failed (SELECT): " . $stmtSelect->error);
    $result = $stmtSelect->get_result();
    $row = $result->fetch_assoc();
    $oldPath = $row ? $row['profile_picture_path'] : null;
    $stmtSelect->close();

    if ($oldPath && $oldPath !== $relativePath && file_exists(__DIR__ . '/' . $oldPath)) {
        @unlink(__DIR__ . '/' . $oldPath); // Suppress error if file deletion fails
    }

    // Update user record
    $stmtUpdate = $conn->prepare("UPDATE users SET profile_picture_path = ? WHERE id = ?");
    if (!$stmtUpdate) throw new Exception("Prepare failed (UPDATE): " . $conn->error);
    $stmtUpdate->bind_param("si", $relativePath, $userId);
    if (!$stmtUpdate->execute()) {
         throw new Exception("Database update failed: " . $stmtUpdate->error);
    }
    $stmtUpdate->close();
    $conn->close();

    // --- Success Response ---
    http_response_code(200); // OK
    echo json_encode([
        'success' => true,
        'message' => 'Profile picture updated successfully.',
        'filePath' => $relativePath // Send back the relative path
    ]);

} catch (Exception $e) { // Catch mysqli errors or general exceptions
    http_response_code(500); // Internal Server Error
    error_log("Error updating profile picture for user $userId: " . $e->getMessage()); // Log error
    // Attempt to delete the newly uploaded file if DB update failed
    if (file_exists($destinationPath)) {
        @unlink($destinationPath); // Suppress error if file deletion fails
    }
    // Ensure connection is closed if it was opened
    if (isset($conn) && $conn instanceof mysqli && $conn->thread_id) {
        $conn->close();
    }
    echo json_encode(['success' => false, 'message' => 'An error occurred while updating the profile picture.']);
    exit;
}
?>