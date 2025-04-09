<?php
session_start();
header('Content-Type: application/json');

require_once 'config.php'; // contains $pdo = new PDO(...);

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if (!$action) {
    echo json_encode(['success' => false, 'error' => 'No action specified']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($action === 'list') {
    try {
        $stmt = $pdo->prepare('
            SELECT g.id, g.name
            FROM groups g
            JOIN group_members gm ON gm.group_id = g.id
            WHERE gm.user_id = ?
        ');
        $stmt->execute([$user_id]);
        $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'groups' => $groups]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
    exit;
}

// Existing create/join logic below...
// if ($action === 'create') { ... }
// if ($action === 'join') { ... }

?>