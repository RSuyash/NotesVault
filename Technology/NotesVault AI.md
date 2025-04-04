# NotesVault AI Details
#tech/ai

This document covers details related to the [[Artificial Intelligence]] aspects of NotesVault.

## Core Service (MVP V1)

*   **Provider:** [[Google AI Studio]]
*   **Access:** External API Calls
*   **Tier:** Free Tier (Multiple Accounts) #cost/free-tier
*   **Implementation:** Via [[AI Service Wrapper (Python/Celery)]] component. See [[Architecture]].

## Key Tasks (MVP V1)

*   **[[Document Generator]]**:
    *   Generate content based on Topic/Syllabus Text.
    *   Output in [[Obsidian]]-compatible [[Markdown]].
    *   Requires careful **Prompt Engineering** tailored to the target niche ([[B.Sc Biotechnology, MGM Nanded]]).

## Future Features (Post-MVP)

*   [[Knowledge Graph]] Generation
*   [[Flash Card]] Generation

## Related Documents

*   [[Idea]]
*   [[MVP_Plan_V1_Rev2]]
*   [[Architecture]]