<?php
header('Content-Type: application/json');

// Simulate authentication check (optional)
// if (!isset($_GET['token']) || $_GET['token'] !== 'valid_token') {
//     http_response_code(401);
//     echo json_encode(['error' => 'Unauthorized']);
//     exit;
// }

try {
    // Dummy user data
    $user = [
        'id' => 1,
        'name' => 'Test User',
        'email' => 'testuser@example.com'
    ];

    echo json_encode($user);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>