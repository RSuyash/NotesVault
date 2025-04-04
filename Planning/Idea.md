# NotesVault: Project Plan
#project/plan #strategy/bootstrapped #tech/ai

**Version:** 1.0
**Date:** 2024-02-29
[[MVP of Version 1.0]]

## [[Executive Summary]]

NotesVault aims to revolutionize note-taking for students across all academic degrees by leveraging [[Artificial Intelligence]]. The platform will automatically generate comprehensive, structured, and personalized notes based on user-uploaded syllabi or specified topics. Key features include a powerful [[Document Generator]], a [[Knowledge Graph]] visualizer, and automated [[Flash Card]] creation. The project will be developed by a 2-person founding team utilizing a "sweat equity" model with an ultra-bootstrapped budget, relying heavily on free software tiers (including [[Google AI Studio]] for AI models) and [[Organic Marketing]] efforts. The initial [[Technical Architecture & Infrastructure|technical infrastructure]] will be a [[KVM 4 VPS]], balancing cost with the necessary control and capability to run backend processes and external API integrations. Success hinges on delivering high-quality AI-generated content, efficient organic growth, and the long-term sustainability of relying on free tiers or transitioning strategically to paid services funded by eventual [[Monetization Strategy (Future)|monetization]].

## [[1. Problem & Opportunity]]

*   **Problem:** Students often struggle with time-consuming note-taking. Existing methods can be inefficient, and while personal AI use (like direct ChatGPT interaction) exists, it often lacks structure, personalization, and integration specific to academic syllabi. Consistency and quality across different subjects and complexities are challenging.
*   **Opportunity:** There is a significant opportunity to provide a dedicated platform that uses [[Artificial Intelligence|AI]] to automate the creation of high-quality, syllabus-specific notes, saving students time and improving learning outcomes. Adding features like [[Knowledge Graph]] and [[Flash Card]] enhances the learning experience further.

## [[2. Vision & Goal]]

*   **Vision:** To be the leading AI-powered platform for academic note generation and knowledge management, accessible to students across all degrees and universities.
*   **Goal:** Develop and launch NotesVault, initially focusing on the core [[Document Generator]] feature, proving its value through AI-generated content quality and user adoption driven by [[Organic Marketing|organic growth]].

## [[3. Target Audience]]

*   **Primary:** University and college students across various disciplines seeking efficient and effective note-taking solutions.
*   **Secondary (Future):** University representatives, educators, lifelong learners.

## [[4. Core Features & Functionality]]

*   **A. Website Platform:**
    *   Standard Pages: Login, Sign Up, Homepage, Contact Us, About Us, Privacy Policy.
    *   Dashboard: Separate views for Users and Admins (with basic CMS).
    *   Content Presentation System: UI for browsing generated notes/syllabi (similar concept to Unacademy course listings).

*   **B. AI Solutions (Microservices - "MCP Server"):**
    *   **[[Document Generator]]**:
        *   Input: Topic Name / Uploaded Syllabus PDF.
        *   Process: Parses input, interacts with external AI APIs ([[Google AI Studio]]), formats content, potentially fetches and integrates relevant images (e.g., WikiCommons via scraping/API, with attribution).
        *   Output: Formatted HTML/CSS notes (target: comprehensive, potentially 300-400+ pages for full syllabus). #output/html #output/css
        *   AI Backend: Relies on **[[Google AI Studio]] Free Tier** (multiple accounts) initially. #cost/free-tier
    *   **[[Knowledge Graph]] Generator:**
        *   Concept: Visualizes relationships between topics/concepts within notes (Obsidian-like). #feature/graph-view
        *   Process: Extracts entities and relationships from generated core content using AI.
    *   **[[Flash Card]] Generator:**
        *   Concept: Creates flashcards automatically from core and derived content. #feature/flashcards
        *   Process: Uses AI to identify key terms/concepts and generate Q&A pairs.

## [[5. Content Strategy]]

*   **Core Content:** AI-generated notes in [[Markdown]] (rendered as HTML/CSS), forming the primary value proposition. Quality, logical flow, and accuracy are paramount. Requires personalized formatting options. #output/markdown
*   **Derived Content:** Content organized/filtered based on core notes (by Topic, Degree, University, College). Includes potential social/networking features (linking content to specific university contexts – requires careful handling of syllabus complexity variations).

## [[6. Technical Architecture & Infrastructure]]
#tech/architecture #tech/infrastructure

*   **Hosting:** [[KVM 4 VPS]] Plan. #hosting/vps
    *   **Rationale:** Provides necessary root access for custom software installation (web server, database, backend runtime), running automation scripts, handling background jobs for AI processing via external APIs, and supporting multiple domains at a reasonable cost point compared to more limited shared hosting.
    *   **Key Capability:** Enables running the backend logic for the MCP server components (interfacing with external APIs).
*   **AI Implementation:**
    *   **External APIs:** Exclusively uses external AI APIs, starting with **[[Google AI Studio]]'s Free Tier** across multiple accounts. #ai/api #cost/free-tier
    *   **No Local LLMs:** The [[KVM 4 VPS]] plan lacks the RAM/GPU resources required to run powerful LLMs locally. #constraints/hardware
*   **Backend:** [[Python]] ([[Flask]]/[[Django]]) or [[Node.js]] ([[Express]]) likely candidates. Requires asynchronous task queue (e.g., [[Celery]] with [[Redis]]/[[RabbitMQ]] free tier/local install) to manage AI API calls without blocking web requests. #tech/backend #tech/queue
*   **Frontend:** Modern JavaScript framework ([[React]], [[Vue]], [[Svelte]]) or potentially server-side templating. #tech/frontend
*   **Database:** [[PostgreSQL]] or [[MySQL]]. #tech/database #tech/sql (Note: Later decided [[MongoDB]])
*   **Tools:** Strict reliance on free tiers and open-source software ([[VS Code]], [[Git]], [[GitHub]] Free Tier, [[Docker]], free monitoring/logging tools where possible). #tools/free #tools/oss

## [[7. Development Approach & Team]]
#process/agile #process/lean #team/founders

*   **Team:** 2-person founding team handling all development, design, deployment, and maintenance initially.
*   **Model:** "[[Sweat Equity]]" - Founders' time and effort constitute the primary investment.
*   **Methodology:** Likely [[Agile]]/[[Lean]] principles, focusing on iterative development starting with an [[MVP (Minimum Viable Product)]].
*   **Tooling:** Exclusively free and open-source tools to minimize cash expenditure.

## [[8. Financial Plan (Ultra-Bootstrapped)]]
#finance/bootstrapped

See [[Financial Plan]] for details.


## [[9. Marketing & Go-to-Market Strategy]]

*   **Approach:** Purely organic growth driven by founder efforts.
*   **Channels:**
    *   **SEO:** Optimize website and content for relevant keywords (AI notes, specific degree notes, etc.).
    *   **Content Marketing:** Blog posts, tutorials, case studies showcasing the platform's value.
    *   **Social Media:** Engage on platforms popular with students (Instagram, Reddit, Discord, LinkedIn).
    *   **Community Building:** Create forums or Discord server for users.
    *   **Word-of-Mouth:** Encourage satisfied users to share.
*   **Focus:** Build a strong product that users find valuable and want to share. Target specific university communities or degree programs initially.

## [[10. Monetization Strategy (Future)]]

*   *(Essential for long-term sustainability, covering costs, and compensating founders)*
*   **Potential Models:**
    *   **Freemium:** Basic note generation free; advanced features (longer docs, premium formatting, unlimited graphs/flashcards, collaboration) require subscription.
    *   **Tiered Subscriptions:** Different usage limits or feature access based on monthly/annual fees.
    *   **Pay-Per-Use:** Charge per large document generated or syllabus processed beyond a free quota.
    *   **Institutional Sales:** Licenses for universities/colleges (longer-term goal).
*   **Initial Phase:** Likely focus entirely on user acquisition and product validation before implementing monetization.

## [[11. Risks & Challenges]]

*   **Founder Burnout:** High risk due to 2-person team covering development, marketing, support, and operations.
*   **Free Tier Limitations:** Google AI Studio terms or limits may change; usage may exceed free quotas quickly with growth, forcing a potentially costly transition to paid APIs. Rate limiting can impact user experience. Reliance on free operational tools may hinder efficiency.
*   **Slow Organic Growth:** Organic marketing takes time and consistent effort; initial user acquisition may be slow without a marketing budget.
*   **AI Quality & Accuracy:** Ensuring consistently high-quality, accurate, and non-plagiarized AI output across diverse subjects is a major technical challenge. LLMs can hallucinate.
*   **Syllabus Parsing Complexity:** PDFs are inconsistent; reliably extracting structure from diverse syllabus formats automatically is difficult.
*   **Technical Scalability:** The KVM 4 VPS may become a bottleneck under heavy user load, especially for concurrent AI generation tasks (even via API).
*   **Competition:** Other AI writing tools or note-taking apps may emerge or adapt.
*   **Monetization Hurdle:** Transitioning a free user base to a paid model can be challenging.

## [[12. Success Metrics]]

*   **User Acquisition:** Number of registered users, signup rate.
*   **Activation & Engagement:** Number of documents generated, feature usage frequency (graphs, flashcards), daily/monthly active users (DAU/MAU).
*   **Retention:** User churn rate.
*   **Performance:** Server uptime, average page load time, AI generation task success rate and speed.
*   **Qualitative:** User feedback, satisfaction scores (NPS), reviews.
*   **Financial (Long-term):** Conversion rate (free-to-paid), Average Revenue Per User (ARPU), Lifetime Value (LTV), covering operational costs.

## [[13. Roadmap and Next Steps (V1)]]

1.  **Setup Infrastructure:** Procure KVM 4 VPS, install OS, web server, database, basic security. Setup domains.
2.  **Develop Core Platform:** Build basic user authentication, dashboard structure, simple content display page.
3.  **Build MVP Doc Generator:**
    *   Focus on text-based input (Topic Name) first.
    *   Integrate with Google AI Studio API (single account initially for testing).
    *   Implement basic Markdown-to-HTML rendering.
    *   Deploy asynchronous task queue for AI calls.
4.  **Refine MVP:** Improve basic formatting, test different prompts for quality.
5.  **Implement Syllabus Upload (Basic):** Add PDF upload and basic text extraction (recognizing limitations).
6.  **Launch Alpha/Beta:** Test with a small group of target users, gather feedback.
7.  **Initiate Organic Marketing:** Start content creation and social media presence.
8.  **Iterate:** Continuously improve based on feedback, focusing on Doc Generator quality before heavily investing time in Graphs/Flashcards.