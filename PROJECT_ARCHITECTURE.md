# CogniFlow AI: Project Architecture Blueprint

**Project Title:** CogniFlow AI — Real-Time Visual Education & Adaptive Skill Gap Web Platform  
**Hackathon Target:** Lenovo LEAP AI Hackathon 2026 (AKTU Lucknow)  
**Theme:** AI in Education & Skilling — Problem Statement 1 (Learning Gaps, Weakness Identification & Individualized Study Plans)  
**Benchmark Archetypes:** Masterji Platform Tour ([YouTube: I4HEpowCM20](https://youtu.be/I4HEpowCM20)), Chai SQLab ([YouTube: MhLycECL_Ec](https://youtu.be/MhLycECL_Ec)), ChaiCode DSA Visualizer ([dsa.chaicode.com](https://dsa.chaicode.com))

---

## 1. Executive Structural Overview

CogniFlow AI solves the crisis of abstract computing education by establishing a unified, multi-tier reactive architecture. Rather than static video lectures or isolated algorithmic text, the system couples **Abstract Syntax Tree (AST) parsing** with **Groq ultra-low-latency LPU AI models** to project executable code, SQL queries, and distributed network architectures into synchronized, frame-by-frame visual animations.

All curriculum modules, visual frames, user progressions, live presence indicators, and community interactions are dynamically persisted in **Supabase PostgreSQL** and broadcast through an event-driven **WebSocket & CDC Gateway**.

---

## 2. High-Level Enterprise Architecture

The following structural diagram illustrates the multi-tier separation between the Client Presentation Layer, Edge Gateway & Middlewares, Core Application Microservices, Real-Time Ingestion Engine, AI Inference Core, and the Persistence Layer.

```mermaid
graph TB
    %% Client Tier
    subgraph Client_Tier ["Client Presentation Layer (Next.js 14 + React 18)"]
        DSA_UI["DSA Interactive Canvas & Stepper"]
        SQL_UI["SQL Lab & Relational Plan Visualizer"]
        SYS_UI["System Design Traffic Simulator"]
        COMM_UI["Peer Community & Replay Hub"]
        ADM_UI["Admin Command & Analytics Center"]
        TICKER_UI["Live Social Motivation Ticker"]
    end

    %% Edge & Ingress Tier
    subgraph Edge_Ingress ["Edge Gateway & Ingress (Nginx / Cloudflare)"]
        TLS_Term["TLS 1.3 Termination & DDoS Shield"]
        Load_Bal["Round-Robin Ingress Load Balancer"]
    end

    %% Security & Middleware Chain
    subgraph Middleware_Pipeline ["Custom Enterprise Middleware Pipeline"]
        direction TB
        M_Auth["Auth Middleware (Supabase JWT / Session)"]
        M_RBAC["RBAC Middleware (Student / Mentor / Admin)"]
        M_Rate["Token-Bucket Rate Limiter (Groq Shield)"]
        M_Audit["Telemetry & Request Tracing Middleware"]
        M_Val["Zod Schema Validation Middleware"]
        M_Auth --> M_RBAC --> M_Rate --> M_Audit --> M_Val
    end

    %% Core Application Tier
    subgraph Application_Tier ["Application Services Layer (Node.js / Next.js Engine)"]
        Curriculum_Svc["Curriculum & Track Engine"]
        Submission_Svc["Submission & Execution Orchestrator"]
        DSA_Engine["DSA AST & Visual Frame Generator"]
        SQL_Engine["SQL Sandbox & Relational Planner"]
        SysDesign_Engine["System Topology & Traffic Simulator"]
        Diagnostic_Svc["AI Skill Gap Diagnostic Core"]
        Community_Svc["Community & Social Interaction Service"]
        Admin_Svc["Admin Telemetry & CMS Service"]
    end

    %% Real-Time & Event Gateway
    subgraph Realtime_Tier ["Real-Time Gateway & Event Mesh"]
        WS_Gateway["WebSocket Gateway Server (Socket.io)"]
        Presence_Tracker["In-Memory Live Presence Tracker"]
        Supa_CDC["Supabase Realtime (PostgreSQL CDC/WAL)"]
    end

    %% AI Inference Tier
    subgraph AI_Inference_Tier ["AI Inference Acceleration Core (Groq Cloud)"]
        Groq_Gateway["Groq Client Gateway (HTTP/2 Connection Pool)"]
        Llama_Engine["Llama-3.3-70b-versatile (Visual Frame Synthesis)"]
        DeepSeek_Engine["DeepSeek-R1-Distill-Llama-70b (Diagnostic Reasoning)"]
        JSON_Constrain["Structured JSON-Schema Enforcement Engine"]
    end

    %% Persistence Tier
    subgraph Persistence_Tier ["Persistence & Storage (Supabase PostgreSQL 16)"]
        PG_Primary[(PostgreSQL 16 Primary Database)]
        PG_Replica[(Read Replica & Analytics Pool)]
        PG_WAL["Write-Ahead Log (WAL Stream)"]
        Storage_Bucket["Object Storage (Canvas Snapshots & Avatars)"]
    end

    %% Connections
    Client_Tier --> Edge_Ingress
    Edge_Ingress --> TLS_Term --> Load_Bal --> Middleware_Pipeline
    Middleware_Pipeline --> Application_Tier

    %% WebSocket bi-directional link
    Client_Tier <--> WS_Gateway
    WS_Gateway <--> Presence_Tracker
    Supa_CDC <--> WS_Gateway

    %% App to AI
    Diagnostic_Svc --> Groq_Gateway
    DSA_Engine --> Groq_Gateway
    Groq_Gateway --> Llama_Engine
    Groq_Gateway --> DeepSeek_Engine
    Llama_Engine --> JSON_Constrain
    DeepSeek_Engine --> JSON_Constrain
    JSON_Constrain --> Diagnostic_Svc

    %% App to DB
    Curriculum_Svc --> PG_Primary
    Submission_Svc --> PG_Primary
    Diagnostic_Svc --> PG_Primary
    Community_Svc --> PG_Primary
    Admin_Svc --> PG_Replica

    PG_Primary --> PG_WAL --> Supa_CDC
    PG_Primary -.-> PG_Replica
    Community_Svc --> Storage_Bucket
```

---

## 3. Component Hierarchy & Module Topology

```mermaid
graph LR
    subgraph Core_UI_Components ["Frontend Component Tree"]
        App_Shell["App Shell / Root Layout"]
        Nav["Global Nav + Live Online Pill + XP Bar"]
        
        subgraph Sub_Views ["Dynamic Visual Views"]
            DSA_View["/tracks/dsa/[slug]"]
            SQL_View["/tracks/sql/[slug]"]
            SYS_View["/tracks/system-design/[slug]"]
            COMM_View["/community"]
            ADM_View["/admin"]
        end

        subgraph Visualizer_Elements ["Visualizer Canvas Primitives"]
            Timeline_Bar["Playback Timeline Bar (Play/Pause/Scrub/Speed)"]
            Array_Tree_Canvas["Dynamic SVG/DOM Node Canvas"]
            Memory_Inspector["Variable Scope & Call Stack Panel"]
            SQL_Grid["Virtual Table Grid & Relation Venn"]
            React_Flow_Canvas["Interactive React Flow Topology Canvas"]
        end
    end

    App_Shell --> Nav
    App_Shell --> Sub_Views
    DSA_View --> Timeline_Bar
    DSA_View --> Array_Tree_Canvas
    DSA_View --> Memory_Inspector
    SQL_View --> SQL_Grid
    SYS_View --> React_Flow_Canvas
```

---

## 4. Network Topology & Traffic Routing

```mermaid
flowchart TD
    User([End User / Student])
    Admin([Admin / Instructor])

    subgraph CDN_Edge ["Edge Delivery & CDN"]
        Edge_Cache["Cloudflare CDN & Edge Worker"]
        WAF["Web Application Firewall (DDoS / SQLi / XSS)"]
    end

    subgraph Origin_Cluster ["Origin Server Cluster"]
        direction TB
        App_Server_1["Next.js Web Instance #1"]
        App_Server_2["Next.js Web Instance #2"]
        WS_Node_1["Node.js WebSocket Cluster #1"]
        WS_Node_2["Node.js WebSocket Cluster #2"]
    end

    subgraph External_Cloud ["External Managed Cloud Services"]
        Groq_API["Groq Cloud LPU Farm (US/EU Regional Endpoints)"]
        Supa_Cloud["Supabase Managed Cluster (Postgres 16 + Auth + Storage)"]
    end

    User --> CDN_Edge
    Admin --> CDN_Edge
    CDN_Edge --> WAF --> Edge_Cache
    Edge_Cache -- "HTTPS Traffic" --> App_Server_1 & App_Server_2
    Edge_Cache -- "WSS Traffic (Upgrade)" --> WS_Node_1 & WS_Node_2

    App_Server_1 & App_Server_2 -- "Direct SQL (Pool: PgBouncer)" --> Supa_Cloud
    App_Server_1 & App_Server_2 -- "AI LPU Calls (Keep-Alive Pool)" --> Groq_API
    WS_Node_1 & WS_Node_2 -- "Postgres LISTEN/NOTIFY" --> Supa_Cloud
```

---

## 5. Security & Isolation Boundaries

| Boundary Layer | Threat Vector | Mitigation Strategy | Enforcement Mechanism |
|---|---|---|---|
| **Client Layer** | XSS, CSRF, Token Theft | HttpOnly SameSite=Strict cookies, CSP (Content Security Policy), sanitized DOM outputs | Next.js Security Headers |
| **API Ingress** | Credential stuffing, brute force, DDoS | IP-based rate limiting (100 req/min), Cloudflare Under Attack mode | Edge Nginx / Cloudflare |
| **AI Ingestion (Groq)**| Token exhaustion, prompt injection | Token-bucket rate limiter per user ID (15 AI requests / 5 mins), system prompt delimiter wrapping | `rateLimitMiddleware.ts` |
| **Database Access** | SQL Injection, Unauthorized row read/write | Supabase Row Level Security (RLS) policies, parameterized queries via Prisma / Drizzle | Supabase Auth + Postgres RLS |
| **Administrative Actions**| Privilege escalation | Double-checked RBAC middleware verifying cryptographic role claim `role = 'admin'` from verified JWT | `rbacMiddleware.ts` |
| **Code Execution** | Remote Code Execution (RCE) via user scripts | Client-side WASM execution sandbox + AST symbolic execution without host OS shell access | WebAssembly Sandbox |

---

## 6. Deployment & Container Topology

```mermaid
graph TB
    subgraph Kubernetes_Cluster ["Production Kubernetes / Docker Swarm Pod Topology"]
        subgraph Web_Namespace ["Namespace: frontend-web"]
            Pod_Web1["Pod: nextjs-app-replica-1"]
            Pod_Web2["Pod: nextjs-app-replica-2"]
            Svc_Web["Service: web-cluster-ip:3000"]
        end

        subgraph Realtime_Namespace ["Namespace: realtime-gateway"]
            Pod_WS1["Pod: websocket-gateway-1"]
            Pod_WS2["Pod: websocket-gateway-2"]
            Svc_WS["Service: ws-cluster-ip:4000"]
        end

        subgraph Ingress_Controller ["Ingress Controller"]
            Ingress_Nginx["Ingress-Nginx (Routing /api, /, /socket.io)"]
        end
    end

    Ingress_Nginx --> Svc_Web --> Pod_Web1 & Pod_Web2
    Ingress_Nginx --> Svc_WS --> Pod_WS1 & Pod_WS2
```
