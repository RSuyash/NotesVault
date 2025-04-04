# KVM 4 VPS
#tech/infrastructure #hosting/vps

The chosen hosting solution for NotesVault's [[MVP (Minimum Viable Product)]].

**Rationale:**
*   Provides root access needed for installing custom software ([[Python]], [[Node.js]], [[MongoDB]], [[Redis]], [[Nginx]], etc.).
*   Capable of running background processes (like the [[Celery]] workers for the [[AI Service Wrapper]]).
*   Cost-effective compared to more managed solutions, fitting the ultra-bootstrapped budget. #finance/bootstrapped

**Limitations:**
*   Lacks sufficient RAM/GPU for running powerful LLMs locally. #constraints/hardware
*   May become a bottleneck under heavy load (potential [[Technical Scalability|scalability]] issue). #risk/technical

**Relevant Documents:**
*   [[Idea]]
*   [[MVP of Version 1.0]]
*   [[MVP_Plan_V1_Rev2]]
*   [[Architecture]]
*   [[Financial Plan]]