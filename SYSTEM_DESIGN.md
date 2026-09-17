# CogniFlow AI: Comprehensive System Design Document

**System Name:** CogniFlow AI Distributed Visual Education Engine  
**Audience:** System Architects, Staff Engineers, Hackathon Evaluation Jury (Lenovo LEAP AI Hackathon 2026)  
**Core Problem Solved:** Dynamic, zero-hardcoded computer science visual education with real-time peer synchronization and sub-second AI learning gap detection.

---

## 1. System Requirements & Design Goals

### 1.1 Functional Requirements
1. **Unified Visualizer Pipeline:** Ingest arbitrary code, SQL statements, and distributed system canvas nodes, converting them dynamically into discrete, scrubbable animation state frames.
2. **AI Skill Gap Diagnostics:** On every submission or test run, automatically isolate fundamental misconceptions (e.g., recursion boundary errors, index scanning deficits, network bottlenecks) and update the student's mastery radar.
3. **Zero Hardcoded Content:** 100% of tracks, modules, challenges, visual metadata, and starter templates must be fetched dynamically from Supabase PostgreSQL.
4. **Real-Time Peer Pulse & Presence:** Stream live student counters, recent solution milestones, and active room peer bubbles via bi-directional WebSockets and Supabase Realtime CDC.
5. **Role-Based Admin Command Center:** Real-time visibility into student join velocity, learning gap frequency heatmaps, challenge authoring CMS, and Groq token telemetry.
6. **Community Collaboration:** Forkable visual execution traces, solution replays, threaded discussions, and upvoting.

### 1.2 Non-Functional Requirements & Quantitative SLOs
| Metric | Target Objective | Strategy |
|---|---|---|
| **Visual Step Generation Latency** | $\le 600\text{ ms}$ | Groq LPU LPUs with Llama-3.3-70B streaming + structured JSON output |
| **WebSocket Event Fan-out** | $\le 50\text{ ms}$ | Node.js lightweight event loop with in-memory presence maps |
| **Database Read Latency (p95)** | $\le 15\text{ ms}$ | Supabase PostgreSQL with PgBouncer connection pooling and indexed queries |
| **System Availability** | $99.95\%$ uptime | Stateless Next.js worker pods, horizontal WebSocket nodes, managed DB |
| **Animation Smoothness** | 60 FPS | Hardware-accelerated CSS transforms, requestAnimationFrame, and SVG layouts |

---

## 2. Distributed System Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Learner
    participant Web as Next.js Web App
    participant GW as Gateway & Middlewares
    participant WS as WebSocket Gateway
    participant DB as Supabase PostgreSQL
    participant Groq as Groq AI LPU Engine
    actor Admin as Admin Dashboard

    Note over Student,Web: 1. Code / Query Submission Phase
    Student->>Web: Enters Solution & Clicks "Run & Diagnose"
    Web->>GW: POST /api/submissions (Payload + Auth Token)
    GW->>GW: Verify JWT, Check Rate Limit, Validate Zod Schema
    GW->>DB: INSERT INTO submissions (status = 'processing')
    
    Note over GW,Groq: 2. AI Reasoning & Visual Frame Synthesis
    GW->>Groq: Request AST analysis + Step-by-Step Animation Frames
    Note over Groq: Groq compiles code into JSON state array:<br/>[{step:1, line:2, memory:{}}, {step:2, line:4, memory:{...}}]<br/>Extracts Cognitive Misconceptions
    Groq-->>GW: Return Validated JSON (Frames + Gap Diagnosis)

    Note over GW,DB: 3. Persistence & Telemetry
    GW->>DB: UPDATE submissions (status = 'passed', frames = jsonb)
    GW->>DB: INSERT INTO skill_gap_assessments (gap_category, confidence)
    GW->>DB: UPDATE user_profiles (xp = xp + 50, streak = streak + 1)

    Note over GW,WS: 4. Real-Time Broadcast & Social Motivation
    GW->>WS: Emit 'solve_event' ({ user: 'Aman', challenge: 'Merge Intervals' })
    WS-->>Student: Broadcast to all active clients (Updates Live Ticker)
    WS-->>Admin: Stream real-time metric update (Live Progress & Heatmap)

    Note over Web,Student: 5. Interactive Animation Playback
    GW-->>Web: Deliver 200 OK + Visual JSON + Diagnostic Report
    Web->>Student: Mounts Animation Engine + Highlights Skill Gap on Radar
```

---

## 3. Real-Time WebSocket Protocol & State Synchronization

The WebSocket subsystem operates on top of Socket.io and native WebSockets to handle real-time student presence, live solves, and peer study room synchronization.

```mermaid
graph TB
    subgraph Client_Connections ["Concurrent Student Browser Instances"]
        C1["Student #1 (Delhi)"]
        C2["Student #2 (Lucknow)"]
        C3["Student #3 (Noida)"]
    end

    subgraph WS_Server_Cluster ["Real-Time Gateway Nodes"]
        WS1["WebSocket Node A"]
        WS2["WebSocket Node B"]
    end

    subgraph Redis_PubSub ["Redis / In-Memory Channel Hub"]
        Ch_Presence["Channel: presence:global"]
        Ch_Solves["Channel: events:live-solves"]
        Ch_Rooms["Channel: room:dsa-trees"]
    end

    C1 <--> WS1
    C2 <--> WS1
    C3 <--> WS2

    WS1 <--> Redis_PubSub
    WS2 <--> Redis_PubSub
```

### 3.1 WebSocket Event Schema Dictionary

#### Event: `presence:join`
```json
{
  "event": "presence:join",
  "userId": "usr_998124",
  "username": "VikramDev",
  "track": "dsa-algorithms",
  "challengeId": "ch_binary_search",
  "timestamp": "2026-09-11T05:58:00Z"
}
```

#### Event: `ticker:live_solve`
```json
{
  "event": "ticker:live_solve",
  "userId": "usr_772109",
  "username": "Ananya Sharma",
  "college": "IET Lucknow",
  "challengeTitle": "Invert Binary Tree",
  "xpEarned": 50,
  "executionTime": "4ms",
  "timestamp": "2026-09-11T05:58:12Z"
}
```

#### Event: `admin:live_metric_stream`
```json
{
  "event": "admin:live_metric_stream",
  "activeLearners": 438,
  "solvesLastMinute": 24,
  "topStrugglingTopic": "Graph Cycle Detection (BFS/DFS)",
  "groqP99LatencyMs": 380
}
```

---

## 4. Multi-Tier Caching & Performance Strategy

```mermaid
flowchart LR
    Request([Client Request]) --> L1_Browser[L1: Browser SWR / Zustand Cache]
    L1_Browser -- Cache Miss --> L2_Edge[L2: Cloudflare Edge Cache (Static Tracks)]
    L2_Edge -- Cache Miss --> L3_Memory[L3: Redis / In-Memory Server LRU]
    L3_Memory -- Cache Miss --> L4_DB[(L4: Supabase PostgreSQL Primary)]

    L4_DB -. Write Invalidation .-> L3_Memory
    L3_Memory -. Stale While Revalidate .-> L2_Edge
```

1. **L1 (Client-Side SWR / Zustand):** Active visual frame sequences are cached in browser memory to ensure stutter-free stepping backward and forward without network roundtrips.
2. **L2 (Edge Cache):** Published curriculum tracks, challenge markdown definitions, and schema metadata are cached with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
3. **L3 (Server-Side Memory LRU):** Common AI visual frame outputs for identical test cases are hashed (`SHA-256(challengeId + codeHash)`) to bypass Groq calls on duplicate submissions, saving API credits.
4. **L4 (PostgreSQL Connection Pooling):** Supabase PgBouncer pool keeps up to 500 parallel serverless connections alive.

---

## 5. High Availability, Fault Tolerance & Resiliency

```mermaid
graph TD
    SubRequest[Submission Request Received] --> CircuitBreaker{Groq Circuit Breaker}
    CircuitBreaker -- Closed (Normal) --> CallGroq[Invoke Groq LPU]
    CircuitBreaker -- Open (Tripped) --> FallbackEngine[Fallback Rule-Based AST Tracer]
    CallGroq -- Error / Timeout > 3s --> IncrementFailure[Increment Error Counter]
    IncrementFailure --> ThresholdCheck{Errors > 5 in 30s?}
    ThresholdCheck -- Yes --> TripBreaker[Open Circuit Breaker for 60s]
    ThresholdCheck -- No --> FallbackEngine
    CallGroq -- Success --> ReturnFrames[Deliver Visual Frames & Save to DB]
    FallbackEngine --> ReturnFrames
```

- **Resilience Design Pattern:**
  - **Circuit Breaker:** Protects against upstream AI outages. If Groq API throws 5 consecutive timeouts, the system gracefully falls back to deterministic AST static stepping.
  - **Dead Letter Queue (DLQ):** Failed telemetry and audit events are pushed to an asynchronous retry table rather than blocking user requests.
  - **Supabase Auto-Reconnection:** Client WebSocket listeners implement exponential backoff ($1\text{s}, 2\text{s}, 4\text{s}, \dots, 30\text{s}$) with jitter.

---

## 6. Comprehensive Database Schema & Entity-Relationship (ER) Model

```mermaid
erDiagram
    USERS ||--|| USER_PROFILES : has
    USERS ||--o{ ENROLLMENTS : takes
    USERS ||--o{ SUBMISSIONS : creates
    USERS ||--o{ SKILL_GAP_ASSESSMENTS : receives
    USERS ||--o{ COMMUNITY_POSTS : authors
    USERS ||--o{ COMMUNITY_COMMENTS : writes
    USERS ||--o{ LIVE_SESSIONS : connects

    TRACKS ||--o{ MODULES : organizes
    MODULES ||--o{ CHALLENGES : contains
    CHALLENGES ||--o{ SUBMISSIONS : evaluates
    CHALLENGES ||--o{ COMMUNITY_POSTS : references

    USERS {
        uuid id PK
        string email UK
        string role "student | mentor | admin"
        timestamp created_at
        timestamp updated_at
    }

    USER_PROFILES {
        uuid user_id PK, FK
        string full_name
        string username UK
        string college_name
        string avatar_url
        int total_xp
        int current_streak
        jsonb skill_radar_metrics
        timestamp last_active_at
    }

    TRACKS {
        uuid id PK
        string title
        string slug UK
        string domain "dsa | sql | system_design"
        text description
        string icon
        int order_index
        boolean is_published
        timestamp created_at
    }

    MODULES {
        uuid id PK
        uuid track_id FK
        string title
        string slug UK
        text summary
        int difficulty_level
        int order_index
    }

    CHALLENGES {
        uuid id PK
        uuid module_id FK
        string title
        string slug UK
        text problem_statement
        string challenge_type "dsa_algo | sql_lab | system_design"
        jsonb starter_code
        jsonb initial_visual_state
        jsonb test_cases
        jsonb benchmark_solution
        int xp_reward
        int order_index
    }

    SUBMISSIONS {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        text submitted_code
        jsonb submitted_architecture
        string status "passed | failed | syntax_error"
        int runtime_ms
        jsonb visual_frames
        timestamp created_at
    }

    SKILL_GAP_ASSESSMENTS {
        uuid id PK
        uuid user_id FK
        uuid submission_id FK
        string domain
        string gap_category
        string root_cause
        text remedy_explanation
        jsonb adaptive_study_plan
        int severity_score
        timestamp created_at
    }

    COMMUNITY_POSTS {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        string title
        text content
        jsonb visual_replay_snapshot
        int upvotes_count
        timestamp created_at
    }

    COMMUNITY_COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        text comment_body
        timestamp created_at
    }

    LIVE_SESSIONS {
        uuid id PK
        uuid user_id FK
        string current_track
        string current_challenge_id
        timestamp last_heartbeat
        boolean is_online
    }
```
