# NotesVault: Project Plan - V1 MVP

**Version:** 1.0 (MVP)
**Date:** 2024-02-29
**Status:** Planning Phase
[[Architecture]]
[[Idea]]
## [[Executive Summary]]

This document outlines the plan for the **V1 [[MVP (Minimum Viable Product)]]** of NotesVault. The primary goal of this initial phase is to **validate the core value proposition** of AI-generated academic notes within a **highly specific niche** ([Define Your Initial Niche - e.g., B.Tech Computer Science, 1st Year, typical Indian University Syllabus Structure]). This MVP will focus *exclusively* on the **[[Document Generator]]** feature, omitting [[Knowledge Graph]] and [[Flash Card]] for future phases. Development will be undertaken by the 2-person founding team using a "[[Sweat Equity]]" model, zero-cash-budget model (beyond essential infrastructure), leveraging free software tiers (including [[Google AI Studio]] for AI) and [[Organic Marketing]]. Success for V1 is defined by user engagement and positive qualitative feedback within the target niche, proving the concept's viability before further expansion.

## [[1. Problem & Opportunity (V1 Context)]]

*   **Problem:** Students in [Your Initial Niche] struggle with efficient note-taking from complex syllabi and lectures, often lacking structured, comprehensive resources tailored precisely to their curriculum.
*   **Opportunity:** Provide a tool that automatically generates structured, relevant notes specifically for [Your Initial Niche] syllabi/topics using AI, saving significant time and potentially improving comprehension compared to manual methods or generic AI interactions.

## [[2. Vision & V1 Goal]]

*   **Vision (Long-Term):** To be the leading AI-powered platform for academic note generation and knowledge management.
*   **V1 Goal:** Develop and launch an [[MVP (Minimum Viable Product)|MVP]] of NotesVault focused *solely* on the [[Document Generator]] for [Your Initial Niche], validating core user value, technical feasibility using free tiers, and gathering critical feedback for iteration.

## [[3. Target Audience (V1)]]

*   **Primary:** Students actively enrolled in **[Your Specific Initial Niche - e.g., B.Tech Computer Science, 1st Year]** who follow a syllabus structure common to [Your Target University Type - e.g., Indian Technical Universities].

## [[4. Core Features & Functionality (V1 Scope)]]

*   **A. Website Platform (Basic):**
    *   User Authentication (Login, Sign Up).
    *   Simple User Dashboard.
    *   Basic Content Display Area for generated notes.
    *   Minimal Static Pages (Homepage/Landing Page, Privacy Policy).
*   **B. AI Solutions (MCP Server - MVP Focus):**
    *   **Document Generator ONLY:**
        *   **Input:**
            *   Phase 1a: Text Input (Topic Name).
            *   Phase 1b: Basic Syllabus PDF Upload (with simple text extraction, acknowledging parsing limitations).
        *   **Process:** Interacts with external Google AI Studio APIs (Free Tier), basic prompt engineering for structured output, renders as HTML/CSS. Minimal image integration (if easily achievable via free APIs/scraping with attribution, otherwise defer).
        *   **Output:** Formatted HTML/CSS notes. Focus on logical structure and relevance to input.
    *   **EXCLUDED FROM V1:** [[Knowledge Graph]] Generator, [[Flash Card]] Generator. These are **post-MVP** considerations, dependent on V1 validation and potential future resources.

## [[5. Content Strategy (V1)]]

*   **Focus:** AI-generated notes (**Core Content**) for the defined niche ONLY. Quality, structure, and relevance to the niche's syllabus topics are the priority. Basic formatting options.

## [[6. Technical Architecture & Infrastructure (V1)]]

*   **Hosting:** [[KVM 4 VPS]] Plan.
*   **AI Implementation:** [[Google AI Studio]] Free Tier (multiple accounts); External API calls handled via asynchronous task queue (e.g., [[Celery]] with [[Redis]]). **No Local LLMs.**
*   **Backend:** [[Python]] ([[Flask]]/[[Django]]) or [[Node.js]] ([[Express]]).
*   **Frontend:** Simple implementation using a lightweight framework or server-side templating. (Later decided [[React]])
*   **Database:** [[PostgreSQL]] or [[MySQL]]. (Later decided [[MongoDB]])
*   **Tools:** Strict reliance on free tiers and open-source software ([[VS Code]], [[Git]], [[GitHub]], etc.).

## [[7. Development Approach & Team (V1)]]

*   **Team:** 2-person founding team ([[Sweat Equity]]).
    *   **Initial Focus Areas:** Founder 1 - Backend & AI Integration; Founder 2 - Frontend & User Feedback/[[Organic Marketing]] (flexible).
*   **Methodology:** [[Lean]], iterative development. Focus on build-measure-learn loop.
*   **A. Early Validation Strategy (Pre/Parallel-Development):**
    *   **[[Landing Page]]**: Create simple page describing V1 value proposition for the niche; collect email sign-ups to gauge interest *before* extensive coding.
    *   **(Optional) [[Concierge MVP]]**: Manually/semi-manually generate notes for the first few interested sign-ups to get deep qualitative feedback on desired output format and value.

## [[8. Financial Plan (V1 - Ultra-Bootstrapped)]]

*   **A. Initial & Ongoing Infrastructure Costs:**
    *   *(Minimum unavoidable cash cost - see table in full plan)*
    *   **Estimated Monthly Cash Outlay:** **~₹ 1,050** (Covers KVM 4 VPS + 3 Domains).
*   **B. Estimated AI Usage Costs:**
    *   **Projected Monthly API Cost:** **~₹ 0** (Using Google AI Studio Free Tier).
    *   **Free Tier Mitigation Strategy:**
        *   Monitor usage against free limits per account.
        *   Implement basic request throttling/queuing to manage rate limits.
        *   **Trigger for Re-evaluation:** If usage consistently hits >70% of limits OR rate limits significantly impact UX, prioritize exploring minimal monetization options (see Sec 10) or seeking external funding *specifically* for paid API access. Maintain estimates for paid API costs (e.g., OpenAI) as a benchmark.
*   **C. Startup & Operational Costs (Cash):**
    *   **Development Tools & Software:** ₹ 0 (Using free alternatives).
    *   **Marketing:** ₹ 0 (100% organic).
    *   **Maintenance/Support:** ₹ 0 (Founder time).
*   **D. Funding:**
    *   Initial cash required: ~₹12.6k (1 year infra) or ~₹25.2k (2 years infra). Self-funded by founders.

## [[9. Marketing & Go-to-Market Strategy (V1)]]

*   **Approach:** 100% [[Organic Marketing]], focused *specifically* on the target niche.
*   **Channels:** Relevant subreddits, Discord servers (where permitted), niche student forums, direct outreach (if appropriate), SEO targeting niche keywords (e.g., "B.Tech CS 1st Year AI notes [University Type] syllabus").
*   **Goal:** Acquire initial beta users for feedback and validation within the defined niche.

## [[10. Monetization Strategy (V1)]]

*   **Phase 1 (MVP) Goal:** **NO MONETIZATION.** Focus is 100% on validating the core product value and achieving user engagement within the niche using the free offering.
*   **Phase 1b/2 Consideration (Post-Validation):** *If* V1 shows strong traction and positive feedback, *consider* introducing a very small, optional paid feature or tier (e.g., "premium formatting," slightly higher usage limits) primarily as a means to test willingness-to-pay and potentially cover future paid API costs. This is *not* the primary goal of V1.

## [[11. Risks & Challenges (V1 Focus)]]

*   **Failure to Validate:** Risk that the target niche does not find significant value in the AI-generated notes compared to existing methods or direct AI use.
*   **Founder Burnout:** High risk due to intense workload on 2 people covering all aspects.
*   **Free Tier Limitations:** AI models change, limits may tighten, rate limiting impacts UX. Over-reliance is fragile.
*   **AI Quality/Relevance:** Ensuring output is accurate and genuinely useful for the specific niche syllabus is challenging.
*   **PDF Parsing (Basic):** Initial simple text extraction may fail on complex syllabus PDFs.
*   **Slow Organic Growth:** Reaching the niche audience organically may take significant time and effort.

## [[12. Success Metrics (V1)]]

*   **Primary:**
    *   **Qualitative Feedback:** Direct user interviews, feedback forms (Focus: Is this useful? How can it be better? Would you recommend it?).
    *   **Activation Rate:** % of registered users who successfully generate at least one note relevant to their studies.
    *   **Core Feature Usage:** Frequency of Document Generator use by active users.
*   **Secondary:**
    *   Number of Landing Page Sign-ups (pre-launch validation).
    *   Number of Registered Users (within the niche).
    *   Task Success Rate (% of generation attempts completing without error).
    *   Server Uptime / Basic Performance Metrics.

## [[13. Roadmap and Next Steps (V1)]]

1.  **Setup [[Landing Page]]**: Describe V1 concept for the niche, collect emails. (Validation Step 1)
2.  **(Optional) [[Concierge MVP]]**: Manually generate notes for first few signups. (Validation Step 2)
3.  **Setup Infrastructure:** KVM 4 VPS, Domains, basic server stack.
4.  **Build Core Platform:** User Auth, basic Dashboard, simple note display.
5.  **Develop MVP Doc Generator (Text Input):** Integrate with Google AI Studio, setup async queue, basic HTML output.
6.  **Develop Basic PDF Upload:** Add simple PDF text extraction capability.
7.  **Internal Testing:** Founders rigorously test core functionality.
8.  **Launch Alpha/Closed Beta:** Invite interested users from the landing page (niche specific).
9.  **Implement Feedback Loop:** Actively solicit and analyze user feedback.
10. **Initiate Organic Marketing:** Begin targeted outreach in niche channels.
11. **Measure & Iterate:** Track V1 Success Metrics, make necessary adjustments based on data and feedback. **Decision Point:** Based on V1 results, decide whether to proceed to Phase 2 (expand features/niche) or pivot.