document.addEventListener('DOMContentLoaded', () => {
    const generatorForm = document.getElementById('generatorForm');
    const topicInput = document.getElementById('topicInput');
    const generateButton = document.getElementById('generateButton');
    const outputArea = document.getElementById('outputArea');

    generatorForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const topic = topicInput.value.trim();

        // Basic validation
        if (!topic) {
            outputArea.textContent = 'Please enter a topic.';
            outputArea.className = 'error'; // Add error class
            return;
        }

        // Display loading message and disable button
        outputArea.textContent = 'Generating...';
        outputArea.className = 'loading'; // Add loading class
        generateButton.disabled = true;
        topicInput.disabled = true;

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Expect JSON response
                },
                body: JSON.stringify({ topic: topic })
            });

            // Clear classes before processing response
            outputArea.className = '';

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                // Try to read backend error message if available in JSON body
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error) {
                        errorMsg = `Error: ${errorData.error}`; // Use backend error message
                    }
                } catch (e) {
                    // Ignore if response is not JSON or empty, stick with HTTP status error
                }
                throw new Error(errorMsg); // Throw to be caught by catch block
            }

            const result = await response.json();

            if (result.success) {
                outputArea.textContent = result.markdown;
            } else {
                outputArea.textContent = `Error: ${result.error || 'Unknown error occurred.'}`;
                outputArea.className = 'error'; // Add error class
            }

        } catch (error) {
            console.error('Fetch error:', error);
            outputArea.textContent = `Failed to generate notes. ${error.message || 'Please check the console for details.'}`;
            outputArea.className = 'error'; // Add error class
        } finally {
            // Re-enable button and input
            generateButton.disabled = false;
            topicInput.disabled = false;
        }
    });
});