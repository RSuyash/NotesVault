<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$conn = getDbConnection();
if (!$conn) {
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$output = [];

// Count users
$res = $conn->query("SELECT COUNT(*) as count FROM users");
$row = $res ? $res->fetch_assoc() : null;
$output['user_count'] = $row ? $row['count'] : 'error';

// List first 5 users
$res = $conn->query("SELECT id, name, email FROM users LIMIT 5");
$users = [];
if ($res) {
    while ($user = $res->fetch_assoc()) {
        $users[] = $user;
    }
}
$output['sample_users'] = $users;

// Parse JWT token if present
// Try fetching headers using different methods
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Check both common places
$output['auth_header_getallheaders'] = $headers['Authorization'] ?? 'Not found via getallheaders';
$output['auth_header_server'] = $_SERVER['HTTP_AUTHORIZATION'] ?? 'Not found via $_SERVER';
$output['auth_header_used'] = $authHeader; // The one we will actually use

$userId = null;
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $jwt = $matches[1];
    $output['jwt'] = $jwt;
    $parts = explode('.', $jwt);
    if (count($parts) === 3) {
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        $output['jwt_payload'] = $payload;
        $userId = $payload['data']['userId'] ?? null;
    }
}
$output['extracted_user_id'] = $userId;

// Fetch profile for extracted user ID
if ($userId) {
    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $profile = $result->fetch_assoc();
        $output['profile_for_token_user'] = $profile ?: 'not found';
    } else {
        $output['profile_query_error'] = $stmt->error;
    }
    $stmt->close();
} else {
    $output['profile_for_token_user'] = 'no user id from token';
}

echo json_encode($output, JSON_PRETTY_PRINT);
$conn->close();
?>