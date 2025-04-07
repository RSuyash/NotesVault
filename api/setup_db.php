<?php
// Simple script to initialize database tables for Study Groups using PDO

require_once __DIR__ . '/config.php';

echo "Attempting to connect to database using PDO...\n";
$pdo = getPdoConnection(); // Use the PDO connection function

if (!$pdo) {
    echo "ERROR: Failed to connect to the database using PDO. Please check:\n";
    echo "1. Your local MySQL server (XAMPP?) is running.\n";
    echo "2. Credentials in config.php (DB_HOST, DB_USER, DB_PASS, DB_NAME) are correct.\n";
    echo "3. The PHP PDO MySQL extension (pdo_mysql) is enabled in your CLI php.ini.\n";
    exit(1);
}

echo "Database connection successful.\n";

// SQL to create tables (using backticks for identifiers is good practice)
$sql = "
-- Table for Study Groups
CREATE TABLE IF NOT EXISTS `study_groups` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_public` BOOLEAN DEFAULT TRUE,
    `owner_id` INT UNSIGNED NOT NULL, -- Foreign key to users table
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (`owner_id`), -- Add index for foreign key
    FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE -- Assuming 'users' table exists with 'id' as primary key
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for Study Group Memberships
CREATE TABLE IF NOT EXISTS `study_group_members` (
    `group_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`group_id`, `user_id`), -- Composite primary key
    FOREIGN KEY (`group_id`) REFERENCES `study_groups`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

echo "Executing SQL to create tables...\n";

try {
    // PDO can execute multiple statements separated by semicolons directly with exec()
    // Note: exec() does not return results for SELECT statements. Use query() or prepare()/execute() for those.
    $pdo->exec($sql);
    echo "SUCCESS: 'study_groups' and 'study_group_members' tables checked/created successfully.\n";
} catch (\PDOException $e) {
    echo "Error executing SQL: " . $e->getMessage() . "\n";
    exit(1);
}

echo "Database setup script finished.\n";
?>