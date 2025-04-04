# NotesVault MVP (V1) Development Plan (Revision 2 - Final)
#project/plan #project/mvp #target/biotech-mgm

**Date:** 2025-03-31

## [[1. Goal]]

Validate the core value proposition of AI-generated academic notes for **B.Sc Biotechnology students at MGM's College of CS and IT Nanded**, using only the **[[Document Generator]]** feature outputting **[[Obsidian]]-compatible [[Markdown]]**. Built within the constraints of a 2-person team, minimal budget, and reliance on free-tier services (especially [[Google AI Studio]]).

## [[2. Assumptions & Decisions]]

*   **Database:** [[MongoDB]]
*   **Frontend:** [[ReactJS]]
*   **Backend:** [[Python]] ([[Flask]]/[[Django]] - TBD during implementation)
*   **AI Service:** [[Google AI Studio]] (Free Tier, multiple accounts) via external API calls.
*   **Infrastructure:** [[KVM 4 VPS]]
*   **Team:** 2 Founders ([[Sweat Equity]])
*   **Budget:** Minimal cash outlay (~₹1050/month for infra). #finance/bootstrapped
*   **Initial Niche:** **B.Sc Biotechnology, MGM's College of CS and IT Nanded.** #target/niche
*   **Output Format:** **[[Obsidian]]-compatible [[Markdown]] (.md files).** #output/markdown

## [[3. Key Components & Architecture]]
#tech/architecture

```mermaid
graph TD
    subgraph User Browser
        F[Frontend - ReactJS w/ Markdown Renderer]
    end

    subgraph KVM 4 VPS
        subgraph Backend_API [Backend API (Python)]
            B_API[API Endpoints - Auth, Docs, Tasks]
            B_DB[(MongoDB - Stores Metadata & File Paths)]
            B_QUEUE[(Task Queue - Celery/Redis)]
            B_FS[/File System - Stores Generated .md Files/]
        end

        subgraph AI_Service_Wrapper [AI Service Wrapper (Python/Celery)]
            AI_WRAP[API Call & Markdown Formatting Logic]
            AI_QUEUE_WORKER[Queue Worker (Celery)]
        end
    end

    subgraph External Services
        GoogleAI[Google AI Studio API]
        Email[Email Service (Optional - for Auth)]
    end

    F -- HTTP Requests --> B_API
    B_API -- CRUD Ops --> B_DB
    B_API -- Enqueue Task --> B_QUEUE
    B_API -- Manages --> B_FS
    AI_QUEUE_WORKER -- Dequeue Task --> B_QUEUE
    AI_QUEUE_WORKER -- Calls --> AI_WRAP
    AI_WRAP -- API Calls --> GoogleAI
    AI_WRAP -- Creates/Updates --> B_FS(.md files)
    AI_WRAP -- Updates Status/Path --> B_API --> B_DB
    B_API -- Sends Email (Optional) --> Email
```

*   **[[Frontend]] ([[ReactJS]]):** User interface for login, signup, dashboard, submitting generation requests, and viewing generated notes. Includes a [[Markdown]] rendering component (e.g., `react-markdown`).
*   **[[Backend]] API ([[Python]] - [[Flask]]/[[Django]]):** Handles user authentication, manages user data and generated documents (metadata including file path) in [[MongoDB]], serves frontend requests, queues AI generation tasks, manages file system storage for notes.
*   **[[AI Service Wrapper (Python/Celery)]]:** Runs asynchronously. Listens to the task queue, interacts with [[Google AI Studio]] API, handles prompt engineering for [[Markdown]] output, performs basic formatting (e.g., YAML frontmatter), saves output as `.md` files, and updates the database. Wikilinks/tags are stretch goals/post-MVP.
*   **[[Database]] ([[MongoDB]]):** Stores user accounts, document metadata (topic, source, status, path to `.md` file).
*   **[[Task Queue]] ([[Celery]]/[[Redis]]):** Manages asynchronous AI generation tasks.
*   **[[Infrastructure]] ([[KVM 4 VPS]]):** Hosts the Frontend build, Backend API, AI Service Wrapper, [[MongoDB]], [[Redis]], and the directory structure for storing generated `.md` files.

## [[4. Development Phases (MVP V1 - Niche Specific)]]
#process/phases

*   **Phase 0: Pre-development & Validation (Crucial First Step)** #process/validation
    *   **Gather Niche Syllabus/Topics:** Obtain typical syllabi or key topic lists for B.Sc Biotechnology at MGM Nanded.
    *   **[[Landing Page]]**: Create a simple landing page describing the V1 value proposition specifically for **MGM Nanded Biotech students**. Include an email signup form.
    *   **(Optional but Recommended) [[Concierge MVP]]**: Manually/semi-manually generate notes for a few relevant Biotech topics for interested sign-ups. Gather feedback on quality, format, and usefulness *for their specific course*.
*   **Phase 1: Infrastructure Setup** #process/setup
    *   Procure [[KVM 4 VPS]], install OS, basic hardening.
    *   Install [[Python]], [[Node.js]]/NPM, [[Git]], [[Docker]] (recommended).
    *   Install and configure [[MongoDB]] & [[Redis]].
    *   Setup DNS, [[Nginx]] reverse proxy.
    *   Create base directory for storing notes.
*   **Phase 2: Core Backend Setup ([[Python]] - [[Flask]]/[[Django]])** #process/backend-dev
    *   Initialize project, setup User Auth, define User/Document schemas (incl. file paths), setup [[Celery]]/[[Redis]] connection.
*   **Phase 3: Core Frontend Setup ([[ReactJS]])** #process/frontend-dev
    *   Initialize project, setup routing, create basic Auth/Dashboard components, integrate [[Markdown]] renderer, implement API calls for auth.
*   **Phase 4: Document Generator (Text Input - Markdown Output)** #process/feature-dev
    *   **Backend:** API accepts Biotech topic, enqueues task, stores metadata. API endpoint to serve `.md` file content/path.
    *   **AI Service Wrapper:** Implement [[Celery]] task. Tune prompts for Biotechnology. Generate basic [[Markdown]] output with YAML frontmatter. Save as `.md` file. Update DB.
    *   **Frontend:** Submit topic, display status, render fetched [[Markdown]].
*   **Phase 5: Document Generator (PDF Input - Basic)** #process/feature-dev
    *   **Backend:** Accept PDF upload (syllabus). Basic text extraction. Pass text to [[Celery]] task.
    *   **AI Service Wrapper:** Adapt task/prompting for larger Biotech syllabus text.
    *   **Frontend:** Add PDF upload component.
*   **Phase 6: Testing & Deployment (Alpha/Beta)** #process/testing #process/deployment
    *   Internal testing.
    *   Deploy backend ([[Gunicorn]]/[[Uvicorn]]) & frontend ([[Nginx]]). Setup process management (systemd).
    *   Invite initial users (**specifically MGM Nanded Biotech students**) for Alpha/Closed Beta.
*   **Phase 7: Feedback & Iteration** #process/feedback #process/iteration
    *   Actively collect feedback **from the target niche users**.
    *   Monitor V1 Success Metrics (qualitative feedback, activation, usage within the niche).
    *   Prioritize based on niche feedback.
    *   **Decision Point:** Evaluate V1 success **within the MGM Nanded Biotech niche**. Decide whether to continue, pivot, or halt.

## [[5. Technology Stack Summary]]
#tech/stack

*   **[[Frontend]]**: [[ReactJS]] (initialized with [[Create React App]]), `react-markdown` (or similar), [[CSS]] ([[TailwindCSS]])
*   **[[Backend]]**: [[Python]] ([[Flask]] or [[Django]]), [[Gunicorn]]/[[Uvicorn]]
*   **[[Database]]**: [[MongoDB]]
*   **[[Task Queue]]**: [[Celery]], [[Redis]]
*   **[[AI]]**: [[Google AI Studio]] API
*   **[[Infrastructure]]**: [[KVM 4 VPS]] (Linux), [[Nginx]], File System for .md notes
*   **[[Version Control]]**: [[Git]], [[GitHub]] (Free Tier)

## [[6. Team Roles (Initial Suggestion)]]
#team/roles

*   **Founder 1:** Backend ([[Python]] API, DB, [[Celery]]), AI Service Wrapper & Integration, Infrastructure Setup & Deployment.
*   **Founder 2:** Frontend ([[ReactJS]]), [[Landing Page]], User Feedback Collection (Biotech niche), [[Organic Marketing]] (Biotech niche channels), (Optional) [[Concierge MVP]] execution.
    *(Roles are flexible and require collaboration)*

## [[7. Key Risks & Mitigation]]
#project/risk

*   **Niche Definition Failure:** (Mitigation: Already defined, but ensure syllabus access).
*   **Validation Failure:** Niche users don't find value. (Mitigation: [[Landing Page]] & [[Concierge MVP]] for early signals. Be prepared to pivot).
*   **[[Google AI Studio]] Free Tier Limits/Changes:** (Mitigation: Monitor usage, throttle, have paid estimates ready, use multiple accounts cautiously). #risk/cost #risk/dependency
*   **AI Output Quality/Relevance (Biotech):** (Mitigation: Focus prompt engineering based on [[Concierge MVP]] feedback, iterate). #risk/quality
*   **[[Obsidian]] Compatibility Complexity:** Generating high-quality [[Markdown]] is hard. (Mitigation: Start basic, treat wikilinks/tags as stretch goals). #risk/complexity
*   **Founder Burnout:** (Mitigation: Strict MVP scope, realistic timelines, clear roles). #risk/team
*   **PDF Parsing Issues:** (Mitigation: Set expectations low for V1 PDF support, focus text input first). #risk/technical
*   **[[Markdown]] Rendering:** (Mitigation: Choose robust library, test). #risk/technical

## [[8. Next Steps (Immediate & Specific)]]
#project/next-steps

1.  Gather typical **B.Sc Biotechnology syllabi/topics from MGM Nanded**.
2.  Create the simple [[Landing Page]] targeting **MGM Nanded Biotech students**.
3.  Begin Phase 1: Infrastructure Setup.
4.  (Optional but Recommended) Execute Concierge MVP using relevant Biotech topics.