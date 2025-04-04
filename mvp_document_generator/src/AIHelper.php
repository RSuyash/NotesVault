<?php

/**
 * Generates notes on a given topic using the Google AI API.
 *
 * @param string $topic The topic provided by the user.
 * @param string $apiKey Your Google AI Studio API Key.
 * @return array An associative array with 'success' (boolean) and either 'markdown' (string) or 'error' (string).
 */
function generateNotes(string $topic, string $apiKey): array
{
    // --- Configuration ---
    // Replace with the correct API endpoint for your Google AI Studio model
    $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $apiKey;

    // --- Prompt Engineering (Simple MVP version) ---
    // Construct a basic prompt. You can enhance this significantly.
    $prompt = "Generate concise, well-structured markdown notes about the following topic:\n\n" . $topic;

    // --- API Payload ---
    // Structure the payload according to the Google AI API documentation.
    // This is a common structure for Gemini models.
    $postData = json_encode([
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ],
        // Optional: Add generation config like temperature, max output tokens, etc.
        // 'generationConfig' => [
        //     'temperature' => 0.7,
        //     'maxOutputTokens' => 800,
        // ]
    ]);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['success' => false, 'error' => 'Failed to encode JSON payload.', 'statusCode' => 500];
    }

    // --- cURL Request ---
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response as string
    curl_setopt($ch, CURLOPT_POST, true);           // Set request method to POST
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData); // Attach the JSON payload
    curl_setopt($ch, CURLOPT_HTTPHEADER, [          // Set headers
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60); // Set timeout (e.g., 60 seconds)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Verify SSL certificate
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);    // Verify SSL hostname

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    curl_close($ch);

    // --- Handle cURL Errors ---
    if ($curlError) {
        // Log the detailed cURL error on the server if possible
        // error_log("cURL Error: " . $curlError);
        return ['success' => false, 'error' => 'Failed to connect to AI service (cURL Error).', 'statusCode' => 503]; // Service Unavailable
    }

    // --- Handle API Response ---
    $responseData = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        // Log the raw response for debugging if possible
        // error_log("AI API Non-JSON Response (HTTP $httpCode): " . $response);
        return ['success' => false, 'error' => 'Received invalid response from AI service.', 'statusCode' => 502]; // Bad Gateway
    }

    // Check for API-level errors indicated by HTTP status code
    if ($httpCode >= 400) {
        // Try to extract error message from common Google API error structures
        $apiErrorMsg = $responseData['error']['message'] ?? 'AI API returned an error.';
        // error_log("AI API Error (HTTP $httpCode): " . $apiErrorMsg);
        return ['success' => false, 'error' => $apiErrorMsg, 'statusCode' => $httpCode];
    }

    // --- Extract Generated Content ---
    // Adjust this path based on the actual response structure of your model
    $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;

    if ($generatedText === null) {
        // Log the full response for debugging
        // error_log("AI API Response - Missing expected text (HTTP $httpCode): " . $response);
        return ['success' => false, 'error' => 'Could not extract generated text from AI response.', 'statusCode' => 500];
    }

    // --- Success ---
    return ['success' => true, 'markdown' => trim($generatedText)];
}