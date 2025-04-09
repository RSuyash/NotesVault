<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

// --- Configuration and Dependencies ---
require_once 'config.php'; // Ensure this path is correct and contains $pdo

// --- Input Handling ---
$input = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}
$action = $input['action'] ?? null;

// --- Authentication Check ---
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}
$user_id = $_SESSION['user_id'];

// --- Action Routing ---
try {
    switch ($action) {
        case 'list':
            handleListAction($pdo, $user_id);
            break;
        case 'create':
            handleCreateAction($pdo, $user_id, $input);
            break;
        case 'join':
            handleJoinAction($pdo, $user_id, $input);
            break;
        default:
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'error' => 'Invalid action specified']);
            break;
    }
} catch (PDOException $e) {
    // Log the detailed PDO error: error_log("Database Error: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'A database error occurred. Please try again later.']);
} catch (Exception $e) {
    // Log the general error: error_log("General Error: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred. Please try again later.']);
}

exit; // Ensure script termination after handling action

// --- Action Handler Functions ---

function handleListAction(PDO $pdo, int $user_id): void {
    $stmt = $pdo->prepare('
        SELECT g.id, g.name
        FROM groups g
        JOIN group_members gm ON gm.group_id = g.id
        WHERE gm.user_id = ?
        ORDER BY g.name ASC
    ');
    $stmt->execute([$user_id]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'groups' => $groups ?: []]); // Return empty array if no groups
}

function handleCreateAction(PDO $pdo, int $user_id, array $input): void {
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Group name cannot be empty']);
        exit;
    }
    if (mb_strlen($name) > 100) { // Example length limit
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Group name is too long (max 100 characters)']);
        exit;
    }
     if (mb_strlen($description) > 500) { // Example length limit
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Description is too long (max 500 characters)']);
        exit;
    }


    // Generate unique invite code (retry if collision, though highly unlikely)
    $max_retries = 5;
    $invite_code = '';
    for ($i = 0; $i < $max_retries; $i++) {
        $invite_code = bin2hex(random_bytes(4)); // 8-char hex
        $stmt_check = $pdo->prepare('SELECT 1 FROM groups WHERE invite_code = ?');
        $stmt_check->execute([$invite_code]);
        if ($stmt_check->fetch() === false) {
            break; // Code is unique
        }
        if ($i === $max_retries - 1) {
             throw new Exception("Failed to generate a unique invite code after {$max_retries} attempts.");
        }
    }


    $pdo->beginTransaction();

    // Insert group
    $stmt_insert_group = $pdo->prepare('INSERT INTO groups (name, description, invite_code, created_by, created_at) VALUES (?, ?, ?, ?, NOW())');
    if (!$stmt_insert_group->execute([$name, $description, $invite_code, $user_id])) {
         $pdo->rollBack();
         throw new PDOException("Failed to insert group.");
    }
    $group_id = $pdo->lastInsertId();

    // Add creator as member
    $stmt_add_member = $pdo->prepare('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())');
     if (!$stmt_add_member->execute([$group_id, $user_id])) {
         $pdo->rollBack();
         throw new PDOException("Failed to add creator to group members.");
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'group_id' => (int)$group_id, 'invite_code' => $invite_code]);
}

function handleJoinAction(PDO $pdo, int $user_id, array $input): void {
    $invite_code = trim($input['invite_code'] ?? '');

    if (empty($invite_code)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invite code cannot be empty']);
        exit;
    }

    // Find group by invite code
    $stmt_find = $pdo->prepare('SELECT id FROM groups WHERE invite_code = ?');
    $stmt_find->execute([$invite_code]);
    $group = $stmt_find->fetch(PDO::FETCH_ASSOC);

    if (!$group) {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'error' => 'Invalid or expired invite code']);
        exit;
    }
    $group_id = $group['id'];

    // Check if already a member
    $stmt_check = $pdo->prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?');
    $stmt_check->execute([$group_id, $user_id]);
    if ($stmt_check->fetch()) {
        // Consider this a success or specific status? For now, treat as error.
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'error' => 'You are already a member of this group']);
        exit;
    }

    // Add user to group
    $stmt_join = $pdo->prepare('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())');
    if (!$stmt_join->execute([$group_id, $user_id])) {
         throw new PDOException("Failed to add user to group members.");
    }


    echo json_encode(['success' => true, 'message' => 'Successfully joined the group!']);
}

?>