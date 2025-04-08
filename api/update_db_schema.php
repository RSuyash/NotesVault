<?php
require_once __DIR__ . '/config.php';

header('Content-Type: text/plain'); // Output as plain text

echo "Attempting database schema update...\n";

$conn = getDbConnection();
if (!$conn) {
    die("ERROR: Database connection failed.\n");
}

$errors = [];
$success = [];

// --- Step 1: Add new columns if they don't exist ---
$columnsToAdd = [
    'username' => 'VARCHAR(100) NULL AFTER id', // Add after id
    'first_name' => 'VARCHAR(100) NULL AFTER username', // Add after username
    'last_name' => 'VARCHAR(100) NULL AFTER first_name', // Add after first_name
    'profile_picture_url' => 'VARCHAR(2048) NULL AFTER email' // Add after email
];

foreach ($columnsToAdd as $column => $definition) {
    $checkSql = "SHOW COLUMNS FROM `users` LIKE '$column'";
    $result = $conn->query($checkSql);
    if ($result && $result->num_rows == 0) {
        $addSql = "ALTER TABLE `users` ADD COLUMN `$column` $definition";
        if ($conn->query($addSql) === TRUE) {
            $success[] = "SUCCESS: Column '$column' added.";
        } else {
            $errors[] = "ERROR adding column '$column': " . $conn->error;
        }
    } elseif (!$result) {
         $errors[] = "ERROR checking column '$column': " . $conn->error;
    } else {
         $success[] = "INFO: Column '$column' already exists.";
    }
}

// --- Step 2: Populate first_name from existing name (optional, run once) ---
// Check if 'name' column exists and 'first_name' is likely empty
$checkNameSql = "SHOW COLUMNS FROM `users` LIKE 'name'";
$nameExists = $conn->query($checkNameSql);
if ($nameExists && $nameExists->num_rows > 0) {
    // Simple check if first_name seems unpopulated
    $checkFirstNamePopulated = "SELECT COUNT(*) as count FROM `users` WHERE `first_name` IS NOT NULL AND `first_name` != ''";
    $resFirstName = $conn->query($checkFirstNamePopulated);
    $rowFirstName = $resFirstName ? $resFirstName->fetch_assoc() : null;

    if ($rowFirstName && $rowFirstName['count'] == 0) {
        // Attempt to split 'name' into 'first_name'
        // This is a basic split, might not be perfect for all names
        $populateSql = "UPDATE `users` SET `first_name` = SUBSTRING_INDEX(`name`, ' ', 1) WHERE `first_name` IS NULL OR `first_name` = ''";
        if ($conn->query($populateSql) === TRUE) {
            $success[] = "SUCCESS: Attempted to populate 'first_name' from existing 'name'. Affected rows: " . $conn->affected_rows;
        } else {
            $errors[] = "ERROR populating 'first_name': " . $conn->error;
        }
    } else {
         $success[] = "INFO: 'first_name' seems already populated or 'name' column doesn't exist. Skipping population.";
    }
}


// --- Step 3: Drop the old 'name' column (optional, be careful!) ---
// Only drop if first_name and last_name definitely exist now
$checkFirstNameSql = "SHOW COLUMNS FROM `users` LIKE 'first_name'";
$checkLastNameSql = "SHOW COLUMNS FROM `users` LIKE 'last_name'";
$firstNameExists = $conn->query($checkFirstNameSql);
$lastNameExists = $conn->query($checkLastNameSql);

if ($nameExists && $nameExists->num_rows > 0 && $firstNameExists && $firstNameExists->num_rows > 0 && $lastNameExists && $lastNameExists->num_rows > 0) {
    // $dropSql = "ALTER TABLE `users` DROP COLUMN `name`";
    // if ($conn->query($dropSql) === TRUE) {
    //     $success[] = "SUCCESS: Column 'name' dropped.";
    // } else {
    //     $errors[] = "ERROR dropping column 'name': " . $conn->error;
    // }
    $success[] = "INFO: Old 'name' column exists but is NOT dropped automatically. Review data and drop manually if desired.";

} else {
    $success[] = "INFO: Old 'name' column does not exist or new columns missing. Skipping drop.";
}


// --- Output Results ---
echo "\n--- Summary ---\n";
if (!empty($success)) {
    echo "Success Messages:\n";
    foreach ($success as $msg) {
        echo "- " . $msg . "\n";
    }
}
if (!empty($errors)) {
    echo "\nError Messages:\n";
    foreach ($errors as $msg) {
        echo "- " . $msg . "\n";
    }
    echo "\nNOTE: Some operations might have failed. Please check errors.\n";
} else {
    echo "\nSchema update script completed successfully (or no changes needed).\n";
}

$conn->close();
?>