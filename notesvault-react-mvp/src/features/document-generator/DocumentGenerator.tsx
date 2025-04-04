import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './DocumentGenerator.module.css'; // Import CSS Module

const DocumentGenerator = () => {
  // State specific to the Document Generator
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleGenerateClick = async () => {
    console.log('Generating notes for topic:', topic);
    setIsLoading(true);
    setOutput('');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.success) {
        setOutput(data.markdown);
      } else {
        setError(data.error || 'An unknown error occurred.');
      }

    } catch (err) {
      console.error("API call failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to generate notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use section ID for potential deep linking
    <section id="generator" className={styles.generatorSection}>
      <h3 className={styles.title}>AI Document Generator</h3>
      <div className={styles.inputContainer}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter topic..."
            value={topic}
            onChange={handleInputChange}
            disabled={isLoading}
            className={styles.inputField} // Use module style
          />
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !topic}
            className={styles.generateButton} // Use module style
          >
            {isLoading ? 'Generating...' : 'Generate Notes'}
          </button>
        </div>

        {/* Output Area */}
        <div className={styles.outputArea}>
          {isLoading && <p className={styles.loadingText}>Loading...</p>}
          {error && <p className={styles.errorText}>Error: {error}</p>}
          {output && !isLoading && !error && (
            // Apply base prose class from index.css for markdown styling
            <div className={`prose ${styles.markdownOutput}`}>
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          )}
          {!isLoading && !error && !output && (
            <p className={styles.placeholderText}>
              Enter a topic above and click "Generate Notes" to see the AI-generated results here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentGenerator;