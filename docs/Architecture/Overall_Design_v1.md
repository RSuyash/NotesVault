# NotesVault - Overall Architecture Design (v1)

This document outlines the proposed overall architecture for the NotesVault MVP, based on the planning documents and the decision to use React for the frontend.

## 1. Document Review Summary

*   **Core Goal:** Build an AI-powered note-taking platform (NotesVault).
*   **MVP Focus:** Validate the core **Document Generator** feature using AI ([[Google AI Studio]]) to create notes from topics/syllabi for a specific niche (**B.Sc Biotechnology @ MGM Nanded**).
*   **MVP Output:** [[Obsidian]]-compatible [[Markdown]] files.
*   **Excluded MVP Features:** Knowledge Graph, Flash Cards, Leaderboard System, advanced user management beyond basic auth.
*   **Infrastructure:** [[KVM 4 VPS]] (not shared hosting).
*   **Key Technologies (Confirmed/Chosen):** [[ReactJS]] (Frontend), [[Python]] (Backend), [[MongoDB]] (Database), [[Celery]]/[[Redis]] (Task Queue), [[Google AI Studio]] (AI API).
*   **Constraints:** 2-person team, ultra-bootstrapped budget, reliance on free tiers.

## 2. Proposed Technology Stack

*   **Frontend:**
    *   **Framework:** **React** (using Vite for setup).
    *   **State Management:** **Zustand** (Recommended for simplicity).
    *   **Routing:** **React Router**.
    *   **UI Styling:** **Tailwind CSS**.
    *   **Markdown Rendering:** **`react-markdown`** (or similar).
*   **Backend:**
    *   **Language/Framework:** **Python** with **FastAPI** (Recommended for async, validation, auto-docs).
    *   **Task Queue:** **Celery** with **Redis** (as message broker).
*   **Database:**
    *   **Type:** **MongoDB** (Confirmed choice).
*   **AI Integration:**
    *   **Service:** **Google AI Studio API**.
    *   **Interaction:** Backend (Celery worker) makes secure API calls. API keys managed via environment variables on the KVM VPS (NOT hardcoded).

## 3. High-Level Architecture

The system consists of the following main components:

*   **React Frontend:** UI in the browser (login/signup, input, status, rendering).
*   **Backend API (Python/FastAPI):** Central hub on KVM VPS (Auth, DB ops, task queuing, status endpoints).
*   **AI Service Wrapper (Python/Celery Worker):** Background process on KVM VPS (Dequeues tasks, calls Google AI, formats Markdown, saves file, updates DB).
*   **MongoDB:** Database on KVM VPS (User credentials, document metadata).
*   **Redis:** Message broker for Celery on KVM VPS.
*   **File System (KVM VPS):** Stores generated `.md` files.
*   **Google AI Studio:** External AI service.

```mermaid
graph TD
    subgraph User Browser
        F[Frontend - ReactJS (Vite)]
    end

    subgraph KVM 4 VPS
        subgraph API Server
            B_API[Backend API (Python/FastAPI)]
        end
        subgraph Worker Process
            AI_WRAP[AI Service Wrapper (Python/Celery Worker)]
        end
        subgraph Data Stores
             B_DB[(MongoDB)]
             B_QUEUE[(Redis - Task Broker)]
             B_FS[/var/www/notesvault/notes/ (File System)]
        end
    end

    subgraph External Services
        GoogleAI[Google AI Studio API]
    end

    F -- REST API Calls (JSON) --> B_API
    B_API -- CRUD Ops --> B_DB
    B_API -- Enqueue Task --> B_QUEUE
    AI_WRAP -- Dequeue Task --> B_QUEUE
    AI_WRAP -- Calls --> GoogleAI
    AI_WRAP -- Writes .md --> B_FS
    AI_WRAP -- Updates Status/Path --> B_DB
    B_API -- Serves File Info/Status --> F
    F -- Renders Markdown --> User Browser

    style F fill:#61DAFB
    style B_API fill:#3776AB
    style AI_WRAP fill:#3776AB,stroke-dasharray: 5 5
    style B_DB fill:#4DB33D
    style B_QUEUE fill:#DC382D
    style B_FS fill:#ccc
    style GoogleAI fill:#FBBC05
```

## 4. API Strategy

*   **Style:** **RESTful API**.
*   **Data Format:** **JSON** for request/response bodies between Frontend and Backend.
*   **Authentication:** Token-based authentication (e.g., JWT) for secured endpoints.