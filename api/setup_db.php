<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
if (!$conn) {
    die("Database connection failed");
}

// Create users table
$sql = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

if ($conn->query($sql) === TRUE) {
    echo "Users table created or already exists.\n";
} else {
    echo "Error creating users table: " . $conn->error . "\n";
}

// Optionally insert a test user if table is empty
$result = $conn->query("SELECT COUNT(*) as count FROM users");
$row = $result->fetch_assoc();
if ($row['count'] == 0) {
    $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $passwordHash);
    $name = 'Test User';
    $email = 'testuser@example.com';
    if ($stmt->execute()) {
        echo "Inserted default test user.\n";
    } else {
        echo "Error inserting test user: " . $stmt->error . "\n";
    }
    $stmt->close();
} else {
    echo "Users already exist, no test user inserted.\n";
}

$conn->close();
?>