# NotesVault - MVP Strategy

## 1. Introduction

This document outlines the strategy for the Minimum Viable Product (MVP) of the NotesVault website. The goal is to launch the core value proposition quickly and gather user feedback for future iterations.

## 2. MVP Scope: Core Feature

The MVP will focus exclusively on the **Document Generator** feature.

*   **Input:** Users can provide a topic name or potentially upload a simple syllabus document (initial MVP might restrict to topic names only for simplicity).
*   **Processing:** The system will use an AI service (initially targeting Google AI Studio via an API wrapper) to generate academic notes based on the input.
*   **Output:** The generated notes will be presented to the user in Markdown format, suitable for copying or potentially downloading as a `.md` file.

**Exclusions for MVP:**
*   User accounts and authentication
*   Saving/Storing generated notes within the platform
*   Leaderboard System
*   Flash Card Generation
*   Knowledge Graph Visualization
*   Advanced syllabus parsing (beyond basic topic extraction if implemented)
*   Study group functionality

## 3. Technology Stack & Tools (Shared Hosting Focus)

Given the constraints of typical shared WordPress hosting:

*   **Backend:**
    *   **Language:** **PHP** (most readily available and supported).
    *   **Framework:** Consider a micro-framework like **Slim PHP** or even **vanilla PHP** for a simple API endpoint to handle generation requests. Avoid heavy frameworks.
    *   **Dependency Management:** **Composer**.
*   **Frontend:**
    *   **Technology:** **HTML, CSS, Vanilla JavaScript** or a lightweight library like **Alpine.js** or **htmx**.
    *   **Goal:** Simple interface for topic input and displaying the generated Markdown output. Avoid complex Single Page Application (SPA) frameworks (React, Vue, Angular) unless the hosting environment specifically supports Node.js (unlikely).
*   **Database:**
    *   **Type:** **MySQL/MariaDB** (standard on shared hosting).
    *   **Usage:** Minimal for MVP. Potentially none needed initially, or perhaps only for logging requests/errors if file-based logging is insufficient. Avoid complex data models.
*   **AI Integration:**
    *   **Service:** **Google AI Studio API** (or similar generative AI API).
    *   **Interaction:** Backend (PHP) will make secure HTTPS requests to the AI API.
    *   **API Key Management:** Store API keys securely outside the webroot, potentially using environment variables if the host supports them, or a PHP configuration file with restricted access. **Do not hardcode keys.**
*   **Version Control:** **Git**.

## 4. Deployment Strategy (Shared Hosting)

1.  **Code Upload:** Use **FTP/SFTP** or the hosting provider's File Manager to upload the PHP backend, HTML/CSS/JS frontend files.
2.  **Configuration:**
    *   Set up the database connection string (if DB is used) securely.
    *   Configure the AI API Key securely (e.g., in a `.env` file loaded by PHP or a config file outside the webroot). Ensure file permissions prevent direct web access.
3.  **Testing:** Perform basic testing in the live environment.
4.  **Domain:** Consider using a subdomain (e.g., `app.notesvault.com` or `generator.notesvault.com`).

## 5. Key Best Practices for MVP

*   **Keep it Simple:** Focus *only* on the core Document Generator flow.
*   **Lightweight:** Use minimal dependencies and avoid heavy frameworks.
*   **Optimize for Shared Resources:** Be mindful of execution time limits and memory constraints common on shared hosting.
*   **Security:**
    *   Sanitize all user inputs (topic names).
    *   Protect the AI API Key diligently.
    *   Use HTTPS.
*   **Error Handling:** Implement basic error handling to inform the user if generation fails. Log errors (file-based logging might be necessary).
*   **Statelessness:** Aim for a stateless backend API if possible for the MVP, simplifying deployment and scaling within shared hosting limits.