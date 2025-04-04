# AI Service Wrapper
#tech/backend #tech/ai #python

A dedicated [[Python]] component (likely running as a [[Celery]] worker) responsible for handling interactions with the external [[AI]] service ([[Google AI Studio]]).

**Purpose:**
*   Decouples AI interaction logic from the main [[Backend]] API.
*   Handles potentially long-running API calls asynchronously.
*   Manages prompt engineering, API key rotation (if using multiple accounts), and formatting of AI output into [[Obsidian]]-compatible [[Markdown]].

**Implementation (MVP V1):**
*   Runs as one or more [[Celery]] worker processes on the [[KVM 4 VPS]].
*   Consumes tasks from the [[Redis]] queue.
*   Calls [[Google AI Studio]] API.
*   Formats response into `.md` file.
*   Saves file to the server's file system.
*   Updates the corresponding [[Document]] record in [[MongoDB]] (via API call or direct DB access).

**Relevant Documents:**
*   [[Architecture]]
*   [[MVP_Plan_V1_Rev2]]
*   [[NotesVault AI]]
*   [[Celery]]
*   [[Google AI Studio]]
*   [[Markdown]]