<?php
require_once __DIR__ . '/config.php';

session_start();
header('Content-Type: application/json');

$conn = getDbConnection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    if ($action === 'create') {
        $name = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');

        if (!$name) {
            http_response_code(400);
            echo json_encode(['error' => 'Group name required']);
            exit;
        }

        $inviteCode = bin2hex(random_bytes(4)); // 8-char code

        $stmt = $conn->prepare("INSERT INTO study_groups (name, description, invite_code, created_by) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $name, $description, $inviteCode, $userId);
        if ($stmt->execute()) {
            $groupId = $stmt->insert_id;
            // Add creator as member
            $stmt2 = $conn->prepare("INSERT INTO study_group_members (group_id, user_id) VALUES (?, ?)");
            $stmt2->bind_param("ii", $groupId, $userId);
            $stmt2->execute();
            $stmt2->close();

            echo json_encode(['success' => true, 'group_id' => $groupId, 'invite_code' => $inviteCode]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create group']);
        }
        $stmt->close();
    } elseif ($action === 'join') {
        $inviteCode = trim($data['invite_code'] ?? '');
        if (!$inviteCode) {
            http_response_code(400);
            echo json_encode(['error' => 'Invite code required']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id FROM study_groups WHERE invite_code = ?");
        $stmt->bind_param("s", $inviteCode);
        $stmt->execute();
        $stmt->bind_result($groupId);
        if ($stmt->fetch()) {
            $stmt->close();
            // Add user as member if not already
            $stmt2 = $conn->prepare("SELECT id FROM study_group_members WHERE group_id = ? AND user_id = ?");
            $stmt2->bind_param("ii", $groupId, $userId);
            $stmt2->execute();
            $stmt2->store_result();
            if ($stmt2->num_rows === 0) {
                $stmt2->close();
                $stmt3 = $conn->prepare("INSERT INTO study_group_members (group_id, user_id) VALUES (?, ?)");
                $stmt3->bind_param("ii", $groupId, $userId);
                if ($stmt3->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Joined group']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to join group']);
                }
                $stmt3->close();
            } else {
                $stmt2->close();
                echo json_encode(['success' => true, 'message' => 'Already a member']);
            }
        } else {
            $stmt->close();
            http_response_code(404);
            echo json_encode(['error' => 'Invalid invite code']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>