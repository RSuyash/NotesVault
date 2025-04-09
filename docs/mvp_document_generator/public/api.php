<?php

// Set header to return JSON
header('Content-Type: application/json');

// Define the path to the config file (outside public root)
$configPath = __DIR__ . '/../config/config.php';
// Define the path to the AI helper (adjust if needed)
$aiHelperPath = __DIR__ . '/../src/AIHelper.php';

// --- Configuration and Helper Inclusion ---
// Check if config file exists before including
if (!file_exists($configPath)) {
    echo json_encode(['success' => false, 'error' => 'Configuration file missing.']);
    exit;
}
require_once $configPath; // Includes AI_API_KEY

// Check if AI helper file exists before including
if (!file_exists($aiHelperPath)) {
    echo json_encode(['success' => false, 'error' => 'AI helper file missing.']);
    exit;
}
require_once $aiHelperPath; // Includes generateNotes function

// --- Request Handling ---
// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'error' => 'Invalid request method. Only POST is allowed.']);
    exit;
}

// Get raw POST data
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true); // Decode JSON into an associative array

// Check if JSON decoding was successful and 'topic' exists
if (json_last_error() !== JSON_ERROR_NONE || !isset($data['topic'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'error' => 'Invalid or missing JSON payload with topic.']);
    exit;
}

$topic = trim($data['topic']);

// Basic check if topic is empty after trimming
if (empty($topic)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'error' => 'Topic cannot be empty.']);
    exit;
}

// --- Input Sanitization ---
// Sanitize the topic to prevent XSS if it were ever directly outputted to HTML (good practice)
$sanitizedTopic = htmlspecialchars($topic, ENT_QUOTES, 'UTF-8');

// --- AI Interaction ---
// Check if the API key constant is defined
if (!defined('AI_API_KEY')) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'AI API Key is not configured on the server.']);
    exit;
}

// Call the AI generation function (defined in AIHelper.php)
// Pass the *original* topic, as sanitization is for output, not necessarily API input
// The AI API call itself should handle security related to its input.
$result = generateNotes($topic, AI_API_KEY);

// --- Response ---
// generateNotes should return an array like ['success' => true, 'markdown' => '...']
// or ['success' => false, 'error' => '...']
if (isset($result['success']) && $result['success']) {
    echo json_encode(['success' => true, 'markdown' => $result['markdown']]);
} else {
    // Determine appropriate status code based on error if possible, default to 500
    http_response_code(isset($result['statusCode']) ? $result['statusCode'] : 500);
    echo json_encode(['success' => false, 'error' => $result['error'] ?? 'An unknown error occurred during AI generation.']);
}

exit; // Ensure script termination