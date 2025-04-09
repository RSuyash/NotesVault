#tech/architecture

## [[Backend]]
#tech/backend
#### Technologies
- [[Node.js|NPM]] (Implied Node.js environment)
- [[Python]]
#### Databases
- [[MongoDB]] #tech/database #tech/nosql

## [[Frontend]]
#tech/frontend
- [[ReactJs]]

```mermaid
graph LR
    subgraph User
        U[User]
        UL[Browser]
    end

    subgraph NotesVault (KVM 4 VPS)
        A[Frontend (ReactJS)]
        B[Backend API (Python/Flask)]
        C[AI Service Wrapper (Python/Celery)]
        D[MongoDB]
        E[Redis]
        F[/var/www/notesvault/notes/ (File System)]
    end

    subgraph External Services
        G[Google AI Studio API]
    end

    UL -- HTTP Requests --> A
    A -- API Calls --> B
    B -- CRUD Operations --> D
    B -- Enqueue Task --> C
    C -- Dequeue Task --> E
    C -- API Calls --> G
    C -- Writes .md Files --> F
    C -- Updates Status/Path --> B
    B -- Serves .md Files --> A
    A -- Displays Markdown --> UL

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
    style E fill:#ccf,stroke:#333,stroke-width:2px
    style F fill:#ccf,stroke:#333,stroke-width:2px
    style G fill:#f9f,stroke:#333,stroke-width:2px
```
