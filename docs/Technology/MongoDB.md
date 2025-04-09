# MongoDB
#tech/database #tech/nosql

The chosen NoSQL database for the NotesVault [[MVP (Minimum Viable Product)]].

**Rationale:**
*   Flexible schema suits evolving data needs during early development.
*   Good fit for document-centric data (user profiles, document metadata).

**Implementation:**
*   Will be self-hosted on the [[KVM 4 VPS]].
*   Accessed from the [[Python]] [[Backend]] using [[MongoEngine]] (ODM).

**Relevant Documents:**
*   [[Architecture]]
*   [[MVP_Plan_V1_Rev2]]
*   [[Backend]]