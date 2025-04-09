# Dashboard Architecture

## 1. Overview

This document outlines the architecture for the NotesVault Dashboard feature, focusing on displaying user notes, summaries, and related activities.

## 2. Components

*   **Dashboard Page (React Component):** The main container component responsible for laying out the dashboard sections.
*   **Notes List Component (React Component):** Displays a list of the user's recent notes. Fetches data via the API Service.
*   **Summary Widget Component (React Component):** Displays key summaries or insights derived from notes (e.g., recently studied topics). Fetches data via the API Service.
*   **Activity Feed Component (React Component):** Shows recent user activities (e.g., note creation, edits, flashcard reviews). Fetches data via the API Service.
*   **API Service (Backend):** Handles requests from the frontend components, interacts with the database, and potentially calls other backend services (like AI services for summaries).
    *   `/api/notes`: Endpoint to fetch user notes.
    *   `/api/summaries`: Endpoint to fetch note summaries.
    *   `/api/activity`: Endpoint to fetch user activity.
*   **Database (e.g., MongoDB):** Stores user data, notes, summaries, and activity logs.

## 3. Relationships & Data Flow

1.  **User Access:** User navigates to the Dashboard page.
2.  **Component Mount:** Dashboard Page mounts and renders child components (Notes List, Summary Widget, Activity Feed).
3.  **Data Fetching:** Each child component independently fetches its required data from the API Service upon mounting.
    *   Notes List -> `GET /api/notes`
    *   Summary Widget -> `GET /api/summaries`
    *   Activity Feed -> `GET /api/activity`
4.  **API Processing:** The API Service receives requests, queries the Database for the relevant information.
5.  **Data Response:** The API Service formats the data and sends it back to the respective frontend components.
6.  **Rendering:** Frontend components receive the data and render it to the user.

## 4. Mermaid Diagram

```mermaid
graph TD
    User --> DashboardPage[Dashboard Page]

    subgraph Frontend (React)
        DashboardPage --> NotesList[Notes List Component]
        DashboardPage --> SummaryWidget[Summary Widget Component]
        DashboardPage --> ActivityFeed[Activity Feed Component]
    end

    subgraph Backend
        APIService[API Service] --> Database[(Database)]
    end

    NotesList -->|GET /api/notes| APIService
    SummaryWidget -->|GET /api/summaries| APIService
    ActivityFeed -->|GET /api/activity| APIService

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style Frontend fill:#ccf,stroke:#333,stroke-width:2px
    style Backend fill:#cfc,stroke:#333,stroke-width:2px
```

## 5. Technology Stack

*   **Frontend:** React, TypeScript
*   **Backend:** Python (Flask/FastAPI) or Node.js (Express) - *To be finalized*
*   **Database:** MongoDB
*   **API:** RESTful

## 6. Scalability & Considerations

*   **API Caching:** Implement caching at the API level (e.g., Redis) to reduce database load for frequently accessed data.
*   **Pagination:** Use pagination for Notes List and Activity Feed to handle large amounts of data efficiently.
*   **Asynchronous Loading:** Components should load data asynchronously and display loading states.
*   **Error Handling:** Implement robust error handling on both frontend and backend.
*   **Authentication/Authorization:** Ensure API endpoints are protected and only return data for the authenticated user.