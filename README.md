# 🚀 CogniFlow AI: The Real-Time Visual AI Education & Skill Gap Operating System

> **Hackathon Track:** Lenovo LEAP AI Hackathon 2026 (AKTU Lucknow)  
> **Theme:** AI in Education & Skilling  
> **Problem Statement 1:** *"Students struggle to identify their learning gaps and skills to improve. Learners need individualized study plans based on their pace and weaknesses."*  
> **Benchmark Archetypes:** Masterji Platform Tour ([YouTube](https://youtu.be/I4HEpowCM20)), Chai SQLab ([YouTube](https://youtu.be/MhLycECL_Ec)), ChaiCode DSA Visualizer ([dsa.chaicode.com](https://dsa.chaicode.com)).

---

## 🌟 Executive Overview & The Problem Solved

Traditional computer science education relies on static text, abstract lectures, and binary online judges (like LeetCode) that simply report "Wrong Answer" or "Time Limit Exceeded". Students are unable to **visualize memory pointers**, **inspect relational query execution plans**, or **observe distributed network bottlenecks**. Crucially, students fail to understand **why** their solution failed or what conceptual misconception they harbor.

**CogniFlow AI** combines:
1. **Interactive Multi-Domain Visualizers:**
   - **DSA Visualizer:** Step-by-step array/tree pointer animations, dynamic memory scope inspector, speed sliders, and line-by-line code synchronization.
   - **Chai SQLab:** Interactive SQL execution sandbox, dynamic table catalogs, visual relational operators (Inner/Left/Venn joins), and visual `EXPLAIN` query plans.
   - **Distributed System Design Simulator:** Drag-and-drop architecture canvas (Load Balancers, Microservices, Redis Caches, PostgreSQL Primaries & Replicas), live animated traffic packet flow, and interactive Chaos fault injection.
2. **Groq Cloud LPU Diagnostic Engine:**
   - Ultra-low latency ($< 380\text{ ms}$) AST code analysis using `llama-3.3-70b-versatile` and `deepseek-r1-distill-llama-70b`.
   - Isolates fundamental cognitive gaps (e.g., loop boundary invariants, Cartesian product hazards, single points of failure).
   - Dynamically updates the student's **Skill Radar Chart** and generates **3-step Individualized Remediation Study Plans**.
3. **100% Dynamic Architecture (Zero Hardcoded Data):**
   - All tracks, modules, challenges, initial visual states, and user submissions are dynamically served from PostgreSQL / Supabase.
4. **Real-Time Peer Social Motivation:**
   - Live ticker broadcasting peer milestones across AKTU engineering colleges in real time (*"Priya Verma solved Two Sum II in 8ms (+50 XP)"*).
   - Real-time online learner count pill and peer study rooms.
5. **High-Privilege Admin & Faculty Command Center:**
   - Live student join and session telemetry.
   - Batch-wide **Cohort Skill Gap Heatmap** showing curriculum weaknesses across colleges.
   - Dynamic Curriculum Creator CMS (publish new challenges into PostgreSQL without redeploying code).
   - Groq AI token telemetry and latency charts.
6. **Peer Community Hub:**
   - Share interactive visual solution replay snapshots.
   - Community upvoting, comments, and collaborative discussions.

---

## 📚 Dedicated Architectural Documentation

As part of the enterprise system design, deep-dive specifications are provided in the repository:

- 🏛️ [`PROJECT_ARCHITECTURE.md`](./PROJECT_ARCHITECTURE.md): High-level system structural diagrams, component hierarchy, network routing, and security boundaries.
- ⚙️ [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md): Distributed system design, real-time WebSocket protocol, caching strategies, high availability, and the comprehensive Entity-Relationship (ER) diagram.
- 📖 [`DOCUMENTATION.md`](./DOCUMENTATION.md): Complete REST API specifications, custom middleware documentation, student guide, and admin manual.
- 🧠 [`AI_USES.md`](./AI_USES.md): Detailed Groq Cloud AI integration, system prompts, JSON schema contracts, and the mathematical formula for skill radar adaptation.

---

## 🛠️ Tech Stack

- **Frontend & App Engine:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **AI Acceleration:** Groq Cloud SDK (`llama-3.3-70b-versatile` & `deepseek-r1-distill-llama-70b`).
- **Persistence & Realtime:** PostgreSQL 16 on Supabase (`supabase/schema.sql` & `supabase/seed.sql`).
- **Real-Time Gateway:** Node.js WebSocket Server (Socket.io) with in-memory presence registry.
- **Enterprise Middlewares:**
  - `authMiddleware.ts`: Cryptographic JWT session verification + demo role switcher.
  - `rbacMiddleware.ts`: Role-based access control (`student`, `mentor`, `admin`).
  - `rateLimitMiddleware.ts`: Token-bucket algorithm protecting Groq AI endpoints.
  - `auditMiddleware.ts`: `X-Trace-Id` request tracing and latency telemetry.
  - `validationMiddleware.ts`: Zod runtime schema validation.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "ai education"

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your Groq API key from [console.groq.com](https://console.groq.com) and Supabase credentials from [supabase.com](https://supabase.com).  
*(Note: If API keys are omitted, the built-in deterministic engine will run seamlessly with full visual capabilities!)*

### 3. Start the Application
```bash
# Run the Next.js development server
npm run dev

# (Optional) In a separate terminal, launch the WebSocket presence server
npm run ws:server
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Navigation & Demo Walkthrough for Jury

1. **Mission Control (`/`):**
   - View your live **Skill Radar Matrix** with 5 axes and isolated learning gaps.
   - Inspect dynamic tracks (DSA, SQL Lab, System Design) and the live student pulse ticker.
2. **DSA Visualizer (`/tracks/dsa`):**
   - Click **Run & Visualize with Groq AI**.
   - Watch array elements glow, pointer tags (`left`, `right`) bounce, and the code line synchronizer highlight in real time.
   - Review the **AI Skill Gap Diagnosis Card** and individualized study plan below the editor.
3. **Chai SQLab (`/tracks/sql`):**
   - Run the SQL Join query and toggle between **Catalog Tables**, **Visual EXPLAIN Plan**, and the **Relational Venn Join** animation.
4. **Distributed System Design (`/tracks/system-design`):**
   - Watch 20,000 RPS packet stream across Nginx, Microservices, Redis, and Postgres.
   - Click any node to trigger **Chaos Failure** and watch circuit breakers and failovers animate live.
   - Click **AI Architecture Review** to get Groq's resilience score.
5. **Admin Command Center (`/admin`):**
   - Click the **"🎓 Student Mode / 🛡️ Admin Mode"** toggle in the top-right of the navbar.
   - Observe live active student sessions, college breakdown, cohort skill gap heatmap, and use the **Dynamic Curriculum Creator** to publish new challenges into the database!
6. **Peer Community Hub (`/community`):**
   - View shared visual traces, upvote peers, and share your own solutions.
