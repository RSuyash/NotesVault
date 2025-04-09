<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$conn = getDbConnection();
if (!$conn) {
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$output = [];

try {
    // Add created_by to study_groups if not exists
    $conn->query("ALTER TABLE study_groups ADD COLUMN created_by INT DEFAULT NULL");

    // Add foreign key constraint
    $conn->query("ALTER TABLE study_groups ADD CONSTRAINT fk_study_groups_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL");

    $output['study_groups_created_by'] = 'added or already exists';
} catch (Exception $e) {
    $output['study_groups_created_by_error'] = $e->getMessage();
}

try {
    // Add foreign key to study_group_members.user_id if not exists
    $conn->query("ALTER TABLE study_group_members ADD CONSTRAINT fk_study_group_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE");

    $output['study_group_members_user_fk'] = 'added or already exists';
} catch (Exception $e) {
    $output['study_group_members_user_fk_error'] = $e->getMessage();
}

echo json_encode($output, JSON_PRETTY_PRINT);
$conn->close();
?>