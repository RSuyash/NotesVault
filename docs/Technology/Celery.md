# Celery
#tech/queue #tech/backend #python

A distributed task queue system chosen for NotesVault to handle asynchronous tasks, primarily the [[AI]] calls for the [[Document Generator]].

**Purpose:**
*   Prevents blocking web requests during potentially long-running AI API calls.
*   Allows for task management, retries (optional), and scaling workers (future).

**Implementation (MVP V1):**
*   Used with a [[Redis]] broker.
*   The [[AI Service Wrapper]] will run as a Celery worker process.
*   The [[Backend]] API will enqueue tasks using Celery's API.

**Relevant Documents:**
*   [[Architecture]]
*   [[MVP_Plan_V1_Rev2]]
*   [[Backend]]
*   [[AI Service Wrapper]]
*   [[Redis]]