# NotesVault Study Groups - MVP Architecture

## Overview

This document outlines the architecture for the **core Study Groups** feature in NotesVault, designed to be modular and extensible for future AI-powered tools and collaboration features.

---

## MVP Scope

- Create **public/private** study groups
- Invite members
- Share notes
- Group chat
- Schedule study sessions
- Dedicated **Study Groups Dashboard**

---

## High-Level Architecture

```mermaid
flowchart TD
  subgraph Frontend
    A1[Study Groups Dashboard]
    A2[Group Management UI]
    A3[Notes Sharing UI]
    A4[Chat UI]
    A5[Schedule UI]
  end

  subgraph Backend
    B1[Auth Service]
    B2[Group Service]
    B3[Notes Service]
    B4[Chat Service]
    B5[Schedule Service]
    B6[User Service]
  end

  subgraph Storage
    C1[Users DB]
    C2[Groups DB]
    C3[Notes DB]
    C4[Chat DB]
    C5[Schedule DB]
  end

  A1 --> A2 --> B2
  A1 --> A3 --> B3
  A1 --> A4 --> B4
  A1 --> A5 --> B5

  B1 --> C1
  B2 --> C2
  B3 --> C3
  B4 --> C4
  B5 --> C5
  B2 --> B1
  B3 --> B1
  B4 --> B1
  B5 --> B1
  B2 --> B6 --> C1
```

---

## Module Responsibilities

### Auth Service
- User login/signup
- JWT tokens
- Role validation

### User Service
- User profiles
- Invitations
- Membership management

### Group Service
- Create, update, delete groups
- Privacy settings
- Membership roles

### Notes Service
- Upload/share notes
- Permissions
- Document style copying (future)

### Chat Service
- Real-time chat
- Message history

### Schedule Service
- Create/view study sessions
- Calendar integration

---

## Future Features & Integration Points

- **Exam Paper Predictor:** Connects to AI service analyzing PYQs, outputs scores and reasoning.
- **Assignment System:** AI-assisted assignment management, plagiarism detection, topic suggestions.
- **Timetable Manager:** Exam schedule, buffer predictor, integrated with study groups.
- **Dashboard Access Control:** Rate limits, paid features, guest vs logged-in.
- **Document Style Copying:** Replicate formatting/styles of exam papers.
- **AI Tools:** Flashcard generator, podcast creator, question predictor.

---

## Design Principles

- Modular microservices or well-separated modules
- API-driven, no secrets or hardcoded env values
- Extensible for future AI and collaboration features
- Role-based access control
- Clean separation of concerns

---

*Generated on 2025-04-07 18:48 IST*




## MAIN IDEA

### **NotesVault Study Groups MVP - Architecture Design**

#### **Core Features**
- Create **public/private** groups
- **Invite** others
- **Share notes**
- **Chat**
- **Schedule study sessions**
- Dedicated **Study Groups Dashboard**

---

### **Design Principles**
- Modular, extensible foundation for future AI tools, assignment system, timetable, etc.
- Clean separation of **core group management**, **content sharing**, **communication**, and **scheduling**
- API-driven, no secrets or hardcoded env values
- Frontend and backend decoupled, with clear API contracts
- Role-based access (owner, member, guest)

---

### **Architecture Components**

```mermaid
flowchart TD
  subgraph Frontend
    A1[Study Groups Dashboard]
    A2[Group Creation & Management UI]
    A3[Notes Sharing UI]
    A4[Chat UI]
    A5[Schedule UI]
  end

  subgraph Backend
    B1[Auth Service]
    B2[Group Service]
    B3[Notes Service]
    B4[Chat Service]
    B5[Schedule Service]
    B6[User Service]
  end

  subgraph Storage
    C1[Users DB]
    C2[Groups DB]
    C3[Notes DB]
    C4[Chat DB]
    C5[Schedule DB]
  end

  A1 --> A2 --> B2
  A1 --> A3 --> B3
  A1 --> A4 --> B4
  A1 --> A5 --> B5

  B1 --> C1
  B2 --> C2
  B3 --> C3
  B4 --> C4
  B5 --> C5
  B2 --> B1
  B3 --> B1
  B4 --> B1
  B5 --> B1
  B2 --> B6 --> C1
```

---

### **Module Responsibilities**

- **Auth Service:** User login/signup, JWT tokens, role validation
- **User Service:** Profile, invitations, membership management
- **Group Service:** CRUD groups, privacy settings, membership roles
- **Notes Service:** Upload/share notes, permissions
- **Chat Service:** Real-time/group chat, message history
- **Schedule Service:** Create/view study sessions, calendar integration

---

### **Integration Points for Future Features**

- **AI Services:** Connect to Exam Predictor, Assignment AI, Timetable AI
- **Payment/Rate Limits:** API gateway enforces limits for logged-out users
- **Assignment System:** Extend Group & Notes services
- **Timetable Manager:** Extend Schedule service
- **Document Style Copying:** Extend Notes service with formatting metadata

---

### **Next Step**

Document this architecture in the Memory Bank for persistent context, then proceed to detailed API design and data models.
