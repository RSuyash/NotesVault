# Redis
#tech/database #tech/cache #tech/queue

An in-memory data structure store, used in NotesVault primarily as a message broker for [[Celery]].

**Purpose (MVP V1):**
*   Acts as the intermediary for [[Celery]] tasks between the [[Backend]] API (producer) and the [[AI Service Wrapper]] (consumer/worker).

**Implementation:**
*   Will be self-hosted on the [[KVM 4 VPS]].
*   Configured as the broker in the [[Celery]] setup.

**Relevant Documents:**
*   [[Architecture]]
*   [[MVP_Plan_V1_Rev2]]
*   [[Celery]]