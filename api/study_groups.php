<?php
require_once 'config.php';

// --- CORS Headers (Allow requests from your React app) ---
// Replace 'http://localhost:5173' with your actual frontend URL in development and production
header("Access-Control-Allow-Origin: http://localhost:5173"); // Or '*' for testing, but be specific in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request (sent by browsers before PUT/DELETE etc.)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Database Connection (using PDO for better security) ---
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements
];
$pdo = null;
try {
     $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
     http_response_code(500); // Internal Server Error
     echo json_encode(['message' => 'Database connection failed: ' . $e->getMessage()]);
     // In production, log the error instead of echoing it
     // error_log('Database connection failed: ' . $e->getMessage());
     exit();
}

// --- API Logic ---
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
// Basic parsing: Remove base script path if needed, then split
// This might need adjustment based on server config (.htaccess rewrite rules)
$basePath = dirname($_SERVER['SCRIPT_NAME']); // Get directory of the script
if ($basePath !== '/') {
    $requestUri = str_replace($basePath, '', $requestUri);
}
$requestUri = trim($requestUri, '/');
$pathParts = explode('/', $requestUri);

// Example URIs:
// /study_groups.php -> $pathParts = ['study_groups.php'] -> list all groups
// /study_groups.php/123 -> $pathParts = ['study_groups.php', '123'] -> get group 123
// /study_groups.php/123/members -> $pathParts = ['study_groups.php', '123', 'members'] -> list members of group 123
// /study_groups.php/123/members/456 -> $pathParts = ['study_groups.php', '123', 'members', '456'] -> manage member 456 in group 123

$resourceId = null;
$subResource = null;
$subResourceId = null;

// Check structure based on expected paths
if (isset($pathParts[1]) && is_numeric($pathParts[1])) {
    $resourceId = (int)$pathParts[1]; // Group ID
    if (isset($pathParts[2])) {
        $subResource = $pathParts[2]; // e.g., 'members'
        if (isset($pathParts[3]) && is_numeric($pathParts[3])) {
             $subResourceId = (int)$pathParts[3]; // e.g., User ID for membership
        }
    }
}

// Get input data for POST/PUT
$input = json_decode(file_get_contents('php://input'), true);

// --- Route Handling ---
switch ($method) {
    case 'GET':
        if ($resourceId && $subResource === 'members') {
            // GET /study_groups.php/{group_id}/members
            getGroupMembers($pdo, $resourceId);
        } elseif ($resourceId) {
            // GET /study_groups.php/{group_id}
            getStudyGroup($pdo, $resourceId);
        } else {
            // GET /study_groups.php
            getAllStudyGroups($pdo);
        }
        break;

    case 'POST':
         if ($resourceId && $subResource === 'members') {
            // POST /study_groups.php/{group_id}/members - Add member
            // Expecting {'user_id': user_id_to_add} in $input
            addMemberToGroup($pdo, $resourceId, $input);
        } elseif (!$resourceId && !$subResource) {
             // POST /study_groups.php - Create group
            createStudyGroup($pdo, $input);
        } else {
             http_response_code(404); echo json_encode(['message' => 'Not Found']);
        }
        break;

    case 'PUT':
        // PUT /study_groups.php/{group_id} - Update group
        if ($resourceId && !$subResource) {
            updateStudyGroup($pdo, $resourceId, $input);
        } else {
             http_response_code(404); echo json_encode(['message' => 'Not Found']);
        }
        break;

    case 'DELETE':
        if ($resourceId && $subResource === 'members' && $subResourceId) {
            // DELETE /study_groups.php/{group_id}/members/{user_id} - Remove member
            removeMemberFromGroup($pdo, $resourceId, $subResourceId);
        } elseif ($resourceId && !$subResource) {
            // DELETE /study_groups.php/{group_id} - Delete group
            deleteStudyGroup($pdo, $resourceId);
        } else {
             http_response_code(404); echo json_encode(['message' => 'Not Found']);
        }
        break;

    default:
        // Method Not Allowed
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

// --- Database Interaction Functions ---

// --- Database Interaction Functions ---

function getAllStudyGroups($pdo) {
    try {
        // Basic query - consider adding pagination, filtering (e.g., public only) later
        $stmt = $pdo->query("SELECT id, name, description, is_public, owner_id, created_at, updated_at FROM study_groups ORDER BY created_at DESC");
        $groups = $stmt->fetchAll();
        http_response_code(200);
        echo json_encode($groups); // Directly return the array of groups
    } catch (\PDOException $e) {
        http_response_code(500);
        // Log error in production instead of echoing
        echo json_encode(['message' => 'Failed to retrieve study groups: ' . $e->getMessage()]);
    }
}

function getStudyGroup($pdo, $id) {
    // Validate ID format if necessary (e.g., ensure it's numeric)
    if (!filter_var($id, FILTER_VALIDATE_INT)) {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Invalid study group ID format']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, description, is_public, owner_id, created_at, updated_at FROM study_groups WHERE id = ?");
        $stmt->execute([$id]);
        $group = $stmt->fetch();

        if ($group) {
            // TODO: Optionally fetch members here as well
            // $membersStmt = $pdo->prepare("SELECT user_id FROM study_group_members WHERE group_id = ?");
            // $membersStmt->execute([$id]);
            // $group['members'] = $membersStmt->fetchAll(PDO::FETCH_COLUMN); // Get just the user IDs

            http_response_code(200);
            echo json_encode($group);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['message' => 'Study group not found']);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        // Log error in production
        echo json_encode(['message' => 'Failed to retrieve study group: ' . $e->getMessage()]);
    }
}

function createStudyGroup($pdo, $data) {
    // --- Basic Input Validation ---
    if (empty($data['name']) || !isset($data['owner_id'])) { // owner_id check is temporary
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Missing required fields: name and owner_id']);
        return;
    }
    if (!filter_var($data['owner_id'], FILTER_VALIDATE_INT)) { // Basic validation
         http_response_code(400);
         echo json_encode(['message' => 'Invalid owner_id format']);
         return;
    }
    // Add more validation as needed (length, type, etc.)
    $name = trim($data['name']);
    $description = isset($data['description']) ? trim($data['description']) : null;
    $is_public = isset($data['is_public']) ? (bool)$data['is_public'] : true;
    $owner_id = (int)$data['owner_id']; // Ensure integer type

    // --- Database Insertion ---
    try {
        $sql = "INSERT INTO study_groups (name, description, is_public, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
        $stmt= $pdo->prepare($sql);
        $stmt->execute([$name, $description, $is_public, $owner_id]);

        $newId = $pdo->lastInsertId();

        if ($newId) {
            // Optionally, add owner as the first member
            // $memberSql = "INSERT INTO study_group_members (group_id, user_id) VALUES (?, ?)";
            // $memberStmt = $pdo->prepare($memberSql);
            // $memberStmt->execute([$newId, $owner_id]);

            http_response_code(201); // Created
            getStudyGroup($pdo, $newId); // Fetch and return the newly created group
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create study group, could not get new ID']);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
         // Check for specific errors like duplicate entry or foreign key violation if needed
        // Log error in production
        echo json_encode(['message' => 'Database error during study group creation: ' . $e->getMessage()]);
    }
}

function updateStudyGroup($pdo, $id, $data) {
    // Validate ID
    if (!filter_var($id, FILTER_VALIDATE_INT)) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid study group ID format']);
        return;
    }

    // --- Build dynamic query based on input ---
    $fields = [];
    $params = [];

    if (isset($data['name'])) {
        $name = trim($data['name']);
        if (!empty($name)) { // Add length validation if needed
            $fields[] = "name = ?";
            $params[] = $name;
        } else {
             http_response_code(400); echo json_encode(['message' => 'Name cannot be empty']); return;
        }
    }
    if (isset($data['description'])) { // Allow setting description to empty/null
        $fields[] = "description = ?";
        $params[] = trim($data['description']);
    }
    if (isset($data['is_public'])) {
        $fields[] = "is_public = ?";
        $params[] = (bool)$data['is_public']; // Cast to boolean
    }

    if (empty($fields)) {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'No update fields provided']);
        return;
    }

    $fields[] = "updated_at = NOW()"; // Always update timestamp
    $sql = "UPDATE study_groups SET " . implode(', ', $fields) . " WHERE id = ?";
    $params[] = (int)$id; // Add ID as the last parameter

    // --- Execute Update ---
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() > 0) {
            http_response_code(200); // OK
            getStudyGroup($pdo, $id); // Return the updated group
        } else {
            // Check if the group actually exists before saying Not Found
            $checkStmt = $pdo->prepare("SELECT id FROM study_groups WHERE id = ?");
            $checkStmt->execute([(int)$id]);
            if ($checkStmt->fetch()) {
                 http_response_code(200); // OK, but nothing changed (or 304 Not Modified)
                 getStudyGroup($pdo, $id); // Return existing group
            } else {
                 http_response_code(404); // Not Found
                 echo json_encode(['message' => 'Study group not found or no changes made']);
            }
        }
        
        
        // --- Membership Functions ---
        
        function getGroupMembers($pdo, $group_id) {
             // Validate ID
            if (!filter_var($group_id, FILTER_VALIDATE_INT)) {
                http_response_code(400); echo json_encode(['message' => 'Invalid group ID format']); return;
            }
            try {
                // Join with users table to get member details (adjust columns as needed)
                $sql = "SELECT u.id, u.username, u.email, sgm.joined_at
                        FROM study_group_members sgm
                        JOIN users u ON sgm.user_id = u.id
                        WHERE sgm.group_id = ?
                        ORDER BY u.username"; // Or joined_at
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$group_id]);
                $members = $stmt->fetchAll();
        
                // Check if group exists even if no members
                if (empty($members)) {
                     $checkStmt = $pdo->prepare("SELECT id FROM study_groups WHERE id = ?");
                     $checkStmt->execute([$group_id]);
                     if (!$checkStmt->fetch()) {
                          http_response_code(404); echo json_encode(['message' => 'Study group not found']); return;
                     }
                }
        
                http_response_code(200);
                echo json_encode($members);
        
            } catch (\PDOException $e) {
                http_response_code(500);
                // Log error
                echo json_encode(['message' => 'Failed to retrieve group members: ' . $e->getMessage()]);
            }
        }
        
        function addMemberToGroup($pdo, $group_id, $data) {
             // Validate IDs
            if (!filter_var($group_id, FILTER_VALIDATE_INT)) {
                http_response_code(400); echo json_encode(['message' => 'Invalid group ID format']); return;
            }
            if (empty($data['user_id']) || !filter_var($data['user_id'], FILTER_VALIDATE_INT)) {
                http_response_code(400); echo json_encode(['message' => 'Missing or invalid user_id']); return;
            }
            $user_id = (int)$data['user_id'];
        
            try {
                // Check if group and user exist (optional but good practice)
                // $groupCheck = $pdo->prepare("SELECT id FROM study_groups WHERE id = ?"); $groupCheck->execute([$group_id]);
                // $userCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?"); $userCheck->execute([$user_id]);
                // if (!$groupCheck->fetch() || !$userCheck->fetch()) { http_response_code(404); echo json_encode(['message' => 'Group or user not found']); return; }
        
                $sql = "INSERT INTO study_group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$group_id, $user_id]);
        
                http_response_code(201); // Created (or 200 OK if you prefer)
                // Optionally return the updated member list or just a success message
                echo json_encode(['message' => 'Member added successfully']);
        
            } catch (\PDOException $e) {
                 // Handle potential errors like duplicate entry (user already member) or FK violation
                 if ($e->getCode() == '23000') { // Integrity constraint violation (includes duplicates)
                     http_response_code(409); // Conflict
                     echo json_encode(['message' => 'User is already a member of this group or invalid ID.']);
                 } else {
                    http_response_code(500);
                    // Log error
                    echo json_encode(['message' => 'Database error adding member: ' . $e->getMessage()]);
                 }
            }
        }
        
        function removeMemberFromGroup($pdo, $group_id, $user_id) {
             // Validate IDs
            if (!filter_var($group_id, FILTER_VALIDATE_INT) || !filter_var($user_id, FILTER_VALIDATE_INT)) {
                http_response_code(400); echo json_encode(['message' => 'Invalid group or user ID format']); return;
            }
        
            try {
                $sql = "DELETE FROM study_group_members WHERE group_id = ? AND user_id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$group_id, $user_id]);
        
                if ($stmt->rowCount() > 0) {
                    http_response_code(204); // No Content (successful deletion)
                } else {
                    http_response_code(404); // Not Found (membership didn't exist)
                    echo json_encode(['message' => 'Membership not found']);
                }
            } catch (\PDOException $e) {
                http_response_code(500);
                // Log error
                echo json_encode(['message' => 'Database error removing member: ' . $e->getMessage()]);
            }
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        // Log error in production
        echo json_encode(['message' => 'Database error during study group update: ' . $e->getMessage()]);
    }
}

function deleteStudyGroup($pdo, $id) {
     // Validate ID
    if (!filter_var($id, FILTER_VALIDATE_INT)) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid study group ID format']);
        return;
    }

    try {
        // Note: ON DELETE CASCADE on study_group_members should handle member cleanup
        $sql = "DELETE FROM study_groups WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([(int)$id]);

        if ($stmt->rowCount() > 0) {
            http_response_code(204); // No Content (successful deletion)
            // No body needed for 204 response
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['message' => 'Study group not found']);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        // Log error in production
        echo json_encode(['message' => 'Database error during study group deletion: ' . $e->getMessage()]);
    }
}

?>