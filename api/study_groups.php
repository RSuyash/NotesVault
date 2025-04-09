<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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

try {
    if ($action === 'list') {
        $stmt = $pdo->prepare('
            SELECT g.id, g.name
            FROM groups g
            JOIN group_members gm ON gm.group_id = g.id
            WHERE gm.user_id = ?
        ');
        $stmt->execute([$user_id]);
        $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'groups' => $groups]);

    } elseif ($action === 'create') {
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';

        if (empty($name)) {
            echo json_encode(['success' => false, 'error' => 'Group name is required']);
            exit;
        }

        // Generate unique invite code
        $invite_code = bin2hex(random_bytes(4)); // 8-char hex code

        $pdo->beginTransaction();

        // Insert group
        $stmt = $pdo->prepare('INSERT INTO groups (name, description, invite_code, created_by) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $description, $invite_code, $user_id]);
        $group_id = $pdo->lastInsertId();

        // Add creator as member
        $stmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
        $stmt->execute([$group_id, $user_id]);

        $pdo->commit();

        echo json_encode(['success' => true, 'group_id' => $group_id, 'invite_code' => $invite_code]);

    } elseif ($action === 'join') {
        $invite_code = $input['invite_code'] ?? '';

        if (empty($invite_code)) {
            echo json_encode(['success' => false, 'error' => 'Invite code is required']);
            exit;
        }

        // Find group by invite code
        $stmt = $pdo->prepare('SELECT id FROM groups WHERE invite_code = ?');
        $stmt->execute([$invite_code]);
        $group = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$group) {
            http_response_code(404); // Not Found
            echo json_encode(['success' => false, 'error' => 'Invalid invite code']);
            exit;
        }
        $group_id = $group['id'];

        // Check if already a member
        $stmt = $pdo->prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?');
        $stmt->execute([$group_id, $user_id]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Already a member of this group']);
            exit;
        }

        // Add user to group
        $stmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
        $stmt->execute([$group_id, $user_id]);

        echo json_encode(['success' => true, 'message' => 'Successfully joined group']);

    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500); // Internal Server Error
    // Log the error: error_log($e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error occurred']);
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    // Log the error: error_log($e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred']);
}

?>