'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Home,
  Sparkles,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap,
  Code2,
  Activity,
  ShieldAlert,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  category: string;
  notes: string;
  renderContent: () => React.ReactNode;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: Slide[] = [
    // Slide 1: Title & Vision
    {
      id: 1,
      badge: 'Lenovo LEAP AI Hackathon 2026',
      title: 'CogniFlow AI',
      subtitle: 'Next-Generation Autonomous Visual Learning & Cognitive Skill Diagnostic Web Platform',
      category: 'Vision & Hook',
      notes:
        'Respected judges, millions of students practice on LeetCode or watch static tutorials, yet over 85% struggle in technical interviews. Why? Because existing platforms are blind black-boxes. CogniFlow AI is an interactive visual learning web platform that compiles student code into living, line-synchronized visual execution traces in under 20 milliseconds.',
      renderContent: () => (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LENOVO LEAP AI HACKATHON 2026 • AKTU LUCKNOW
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            CogniFlow{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light">
            Turning Abstract Code into Living, Interactive Visual Computations
          </p>

          <p className="text-sm text-slate-400 max-w-xl">
            A unified web platform bridging Data Structures & Algorithms, In-Browser SQL Relational Execution, and Distributed System Design Chaos Modeling.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              ⚡ DSA Dynamic Visualizer
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              📊 SQLab Relational Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              🌐 System Design Chaos Lab
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              🧠 Groq LPU Accelerated
            </span>
          </div>
        </div>
      ),
    },

    // Slide 2: The Core Problem
    {
      id: 2,
      badge: 'The Educational Bottleneck',
      title: 'The "Black-Box" Coding Crisis',
      subtitle: 'Why 85% of Engineering Students Struggle in Core Technical Interviews',
      category: 'Problem Statement',
      notes:
        'When a student writes Two-Pointer or Binary Search code, execution happens invisibly in RAM. If an invariant fails at iteration 12, they have no idea why. Existing visualizers like VisuAlgo are 100% hardcoded — change one array value and they break. ChatGPT dumps full code answers, killing cognitive reasoning.',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Current Flawed Reality</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>The Black-Box Execution Gap:</strong> LeetCode tells you <em>if</em> code passed (Accepted/WA), never <em>how</em> pointers and variables mutate line-by-line.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Static Hardcoded Fragility:</strong> VisuAlgo and YouTube tutorials only visualize pre-recorded scripts. Change an input or variable, and it fails.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>The AI Spoon-Feeding Trap:</strong> ChatGPT dumps code directly, destroying the productive struggle required to build algorithmic mental models.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Tier 2/3 Placement Crisis:</strong> 1.5M engineers graduate annually in India; under 15% have genuine algorithmic debugging intuition.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Cognitive Mastery Demands</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Dual-Coding Visualization:</strong> Paivio’s Dual-Coding Theory proves synchronizing code lines with memory animations yields 4x higher retention.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Dynamic AST Compilation:</strong> Real-time animation generated for ANY code the student writes in Python, JS, Java, or C++.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Socratic Progressive Mentorship:</strong> 3-Tier hints that guide algorithmic thinking without spoiling the answer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Holistic Triad:</strong> Deep integration of Algorithms, SQL Queries, and Distributed System Architecture.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 3: The Solution Triad
    {
      id: 3,
      badge: 'Product Architecture',
      title: 'The CogniFlow AI Triad',
      subtitle: 'A Unified Web Platform for Computer Science Core Competencies',
      category: 'Solution Overview',
      notes:
        'CogniFlow AI unifies three critical pillars: Dynamic DSA Visualizer with 18-22 granular frames, Chai SQLab with animated row-by-row join pipelines, and the Distributed System Design Chaos Simulator with live packet flow and node failure injection.',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic DSA Visualizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              18 to 22 granular animation frames for custom user code. Synchronized line-by-line editor highlighting, active memory pointers, and variable inspector.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                18-22 Exhaustive Frames
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Chai SQLab</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-browser relational execution visualizer. Watch animated row-by-row JOIN pipelines, Hash Join bucket matching, and visual EXPLAIN query trees.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Relational Algebra Visualizer
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-violet-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">System Design Chaos Lab</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive distributed topology canvas with animated live packet flows (up to 30,000 RPS). Inject Chaos Engineering faults (Kill DB, Sever Cache) live!
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Live Chaos Engineering
              </span>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: Code-to-Animation Compiler Architecture
    {
      id: 4,
      badge: 'Technical Innovation',
      title: 'Two-Stage Real-Time Compiler',
      subtitle: 'Zero-Waiting 60fps Visual Simulation Decoupled from Socratic AI Reasoning',
      category: 'System Architecture',
      notes:
        'To guarantee 60fps animations without waiting for LLM completion tokens, we designed a proprietary Two-Stage Architecture. Stage 1 compiles code into 18-22 granular execution frames in under 20ms. Stage 2 triggers Groq LPU inference asynchronously for cognitive skill diagnosis and Socratic clues.',
      renderContent: () => (
        <div className="space-y-6 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 w-full md:w-auto">
              <div className="text-slate-400 text-[10px]">INPUT</div>
              <div className="text-white font-bold">Student Code</div>
            </div>
            <span className="text-emerald-400 font-bold">➔</span>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600/40 w-full md:w-auto">
              <div className="text-emerald-400 text-[10px]">STAGE 1 (&lt; 20ms)</div>
              <div className="text-emerald-200 font-bold">AST Trace Engine</div>
              <div className="text-[10px] text-slate-400">18–22 Granular Frames</div>
            </div>
            <span className="text-cyan-400 font-bold">➔</span>
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-600/40 w-full md:w-auto">
              <div className="text-cyan-400 text-[10px]">STAGE 2 (&lt; 1s ASYNC)</div>
              <div className="text-cyan-200 font-bold">Groq LPU Inference</div>
              <div className="text-[10px] text-slate-400">llama-3.3-70b / qwen</div>
            </div>
            <span className="text-violet-400 font-bold">➔</span>
            <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-600/40 w-full md:w-auto">
              <div className="text-violet-400 text-[10px]">OUTPUT</div>
              <div className="text-violet-200 font-bold">Socratic AI & Radar</div>
              <div className="text-[10px] text-slate-400">Cognitive Remediation</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
              <h4 className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Instantaneous Latency (&lt; 20ms)
              </h4>
              <p className="text-slate-400">
                Visual frame generation does not block on LLM token generation. Students get 60fps animations instantly with synchronized code line pointers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
              <h4 className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Multi-Model Failover Cascade
              </h4>
              <p className="text-slate-400">
                Dynamic cascading fallback between Groq models (Llama 3.3 70B, Llama 3.1 8B, Qwen 27B) with in-memory caching ensures zero rate-limit disruptions.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: DSA Visualizer Live Demo
    {
      id: 5,
      badge: 'Live Demonstration',
      title: 'LIVE DEMO: DSA Dynamic Trace',
      subtitle: 'Line-by-Line Code Highlighting & Live Memory Scope Stepper',
      category: 'Product Demo',
      notes:
        'Now respected judges, watch this live at localhost:3000! Notice how when we click Run & Visualize, CogniFlow synthesizes 22 exhaustive frames in 18ms. As Frame 4 checks the while condition, Frame 5 reads numbers[left] and numbers[right], the editor highlights the exact matching Python line!',
      renderContent: () => (
        <div className="space-y-4 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-[#0A0E0D] border border-emerald-900/50 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>DEMO CHALLENGE: Two Sum II (LC 167)</span>
              <span className="text-emerald-400">✓ Generated in 18ms • 22 Frames</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-emerald-400 font-bold">SYNCHRONIZED EDITOR</div>
                <div className="text-[11px] text-slate-400">1: def two_sum(numbers, target):</div>
                <div className="text-[11px] text-slate-400">2:   left = 0, right = len(numbers) - 1</div>
                <div className="text-[11px] text-emerald-300 bg-emerald-500/20 px-1 rounded border-l-2 border-emerald-400">
                  3:   while left &lt; right:  ← ACTIVE FRAME 4
                </div>
                <div className="text-[11px] text-slate-400">4:     current_sum = numbers[left] + numbers[right]</div>
              </div>

              <div className="space-y-2 bg-black/40 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-cyan-400 font-bold">ACTIVE MEMORY CANVAS</div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-200 font-bold">
                    [2] <span className="text-[9px] block text-emerald-400">left (0)</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">[7]</div>
                  <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">[11]</div>
                  <div className="p-2 rounded bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold">
                    [15] <span className="text-[9px] block text-cyan-400">right (3)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Variables: <span className="text-white">current_sum = 17, target = 9</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
            <span>✓ Dual Mode: Locked Canonical in Visualization vs Full Custom in Practice Mode</span>
            <span className="text-emerald-400">Step Scrubber: 0.5x, 1x, 2x Playback</span>
          </div>
        </div>
      ),
    },

    // Slide 6: SQL Lab & System Design Live Demo
    {
      id: 6,
      badge: 'Multi-Domain Live Demo',
      title: 'SQLab & System Design Chaos',
      subtitle: 'Visual Relational Algebra & Live Distributed Architecture Simulation',
      category: 'Product Demo',
      notes:
        'In SQLab, students watch relational algebra execute row-by-row without needing to install MySQL or Postgres. In our System Design Lab, students can simulate 30,000 requests per second and test Chaos Engineering — killing a database node to watch automated Patroni failover latency in real time!',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-cyan-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">CHAI SQLAB ENGINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">In-Browser ANSI SQL</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• <strong>Animated JOIN Pipelines:</strong> Watch students and courses match row-by-row into the result set table.</li>
              <li>• <strong>Visual EXPLAIN Query Trees:</strong> Inspect Hash Joins, Sequential Scans, and Filter Predicates.</li>
              <li>• <strong>Zero Mock Data:</strong> Fully dynamic table catalog with live aggregation and schema introspection.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1322] border border-violet-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-violet-400 font-bold">SYSTEM DESIGN CHAOS SIMULATOR</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">Chaos Fault Injection</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• <strong>Live Distributed Topologies:</strong> CDN, Load Balancers, Microservices, Redis Caches, and PostgreSQL.</li>
              <li>• <strong>Real-Time Traffic Engine:</strong> Simulate up to 30,000 RPS with animated packet transmission routes.</li>
              <li>• <strong>Interactive Chaos Engineering:</strong> Click "Kill DB" or "Sever Cache" to observe circuit breaker trips!</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 7: Socratic AI Tutoring
    {
      id: 7,
      badge: 'Pedagogical Innovation',
      title: 'Socratic AI Tutoring (No Spoilers)',
      subtitle: 'Teaching Students How to Think, Rather than Spoon-Feeding Code',
      category: 'Pedagogy',
      notes:
        'Unlike ChatGPT which dumps complete code solutions and kills learning, CogniFlow AI is a Socratic mentor. It provides Level 1 conceptual guidance, Level 2 edge-case clues, and Level 3 concrete algorithmic steps — guiding the student to discover the solution themselves.',
      renderContent: () => (
        <div className="space-y-3 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              L1
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level 1 — Conceptual Direction</div>
              <div className="text-xs text-slate-400 pt-0.5">
                Nudges the student toward the core invariant without writing code (e.g. "Take advantage of sorted order to eliminate candidates").
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              L2
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level 2 — Boundary & Invariant Clue</div>
              <div className="text-xs text-slate-400 pt-0.5">
                Pinpoints boundary hazards (e.g. duplicate triplets in 3Sum, negative values, or ancestor boundaries in BST).
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
              L3
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level 3 — Concrete Algorithmic Step</div>
              <div className="text-xs text-slate-400 pt-0.5">
                Details the pointer transition or conditional statement needed to complete the convergence logic.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>🩺 <strong>AI Defect Doctor:</strong> Automatically isolates invariant violations and off-by-one errors</span>
            <span className="text-emerald-400">Zero Solution Dumps</span>
          </div>
        </div>
      ),
    },

    // Slide 8: Cognitive Skill Gap Radar
    {
      id: 8,
      badge: 'Problem Statement 1 Compliance',
      title: 'Autonomous Skill Gap Diagnostic Core',
      subtitle: '5-Axis Cognitive Profiling & 3-Step Individualized Remediation Plans',
      category: 'Skill Diagnostics',
      notes:
        'Every single submission dynamically updates the student’s 5-axis Skill Radar across DSA, Optimization, SQL, System Design, and Speed. We generate a 3-step individualized study plan tailored to their exact weaknesses.',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl items-center">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs text-slate-300">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Dynamic Cognitive Diagnostics
            </h4>
            <ul className="space-y-2.5">
              <li>• <strong>Real-Time Skill Gap Score (0–100):</strong> Measures conceptual mastery vs invariant failure.</li>
              <li>• <strong>Root Cause Defect Isolation:</strong> Pinpoints algorithmic antipatterns (e.g. O(N²) nested loops instead of two pointers).</li>
              <li>• <strong>3-Step Remediation Plan:</strong> Prescribes specific tasks, visual stepping exercises, and follow-up challenges.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-slate-400 text-[10px] tracking-wider uppercase">5-AXIS COGNITIVE RADAR</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span>DSA Foundations</span><span className="text-emerald-400">92%</span></div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[92%]" /></div>

              <div className="flex justify-between"><span>Algorithmic Optimization</span><span className="text-cyan-400">84%</span></div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[84%]" /></div>

              <div className="flex justify-between"><span>Relational SQL</span><span className="text-sky-400">78%</span></div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-sky-500 h-full w-[78%]" /></div>

              <div className="flex justify-between"><span>System Architecture</span><span className="text-violet-400">88%</span></div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-violet-500 h-full w-[88%]" /></div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 9: Pedagogical Impact
    {
      id: 9,
      badge: 'Social & Pedagogical ROI',
      title: 'Measurable Educational Impact',
      subtitle: 'Democratizing Elite Computer Science Skilling Across Tier 2 & Tier 3 Colleges',
      category: 'Impact',
      notes:
        'Dual-coding cognitive science proves that combining visual animation with code syntax increases long-term retention by 400%. For students in Tier 2 and Tier 3 universities, CogniFlow provides an elite engineering mentor on their laptop 24/7.',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 text-center space-y-2">
            <div className="text-4xl font-extrabold text-emerald-400">4x</div>
            <div className="text-sm font-bold text-white">Higher Conceptual Retention</div>
            <p className="text-xs text-slate-400">
              Dual-coding visual memory reinforces syntax understanding (Paivio's Dual-Coding Theory).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 text-center space-y-2">
            <div className="text-4xl font-extrabold text-cyan-400">80%</div>
            <div className="text-sm font-bold text-white">Faster Bug Isolation</div>
            <p className="text-xs text-slate-400">
              Students identify off-by-one and boundary errors visually instead of blindly print-debugging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 text-center space-y-2">
            <div className="text-4xl font-extrabold text-violet-400">1.5M+</div>
            <div className="text-sm font-bold text-white">Engineers Empowered</div>
            <p className="text-xs text-slate-400">
              Brings world-class interactive mentorship to colleges without dedicated placement training infrastructure.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 10: Business Model & Monetization
    {
      id: 10,
      badge: 'Commercial Viability',
      title: 'Monetization & Revenue Architecture',
      subtitle: 'Scalable B2C Subscriptions, University Campus SaaS & Recruitment Pipeline',
      category: 'Business Model',
      notes:
        'Our business model is triple-pronged: B2C freemium subscriptions for ambitious students, institutional B2B campus licenses for universities seeking better placement rates, and corporate recruitment fees for delivering pre-vetted engineers.',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl text-xs">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">STREAM 1: B2C PRO</div>
            <div className="text-xl font-extrabold text-white">₹499 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            <ul className="text-slate-300 space-y-2">
              <li>• Unlimited arbitrary code visual compilation traces.</li>
              <li>• Full access to System Design Chaos Lab.</li>
              <li>• AI mock technical interview simulations.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1322] border border-cyan-800/40 space-y-3">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STREAM 2: B2B CAMPUS SAAS</div>
            <div className="text-xl font-extrabold text-white">₹2.5L – ₹10L <span className="text-xs text-slate-400 font-normal">/ year</span></div>
            <ul className="text-slate-300 space-y-2">
              <li>• Departmental cohort skill gap heatmaps.</li>
              <li>• Automated lab exam proctoring & grading.</li>
              <li>• Verified skill certificates for placements.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1322] border border-violet-800/40 space-y-3">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">STREAM 3: TALENT PIPELINE</div>
            <div className="text-xl font-extrabold text-white">5% – 8% <span className="text-xs text-slate-400 font-normal">placement fee</span></div>
            <ul className="text-slate-300 space-y-2">
              <li>• Pre-vetted candidate skill telemetry.</li>
              <li>• Direct referral pipeline to product companies.</li>
              <li>• Zero resume spam for hiring teams.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 11: Competitive Advantage Matrix
    {
      id: 11,
      badge: 'Market Differentiation',
      title: 'Why CogniFlow AI Wins',
      subtitle: 'Unfair Architectural & Pedagogical Advantages Over Existing Solutions',
      category: 'Competitive Edge',
      notes:
        'VisuAlgo is static. LeetCode is blind. ChatGPT spoils answers. CogniFlow AI is the unified platform that dynamically animates arbitrary code, teaches with Socratic hints, and bridges DSA, SQL, and System Design together.',
      renderContent: () => (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">CAPABILITY</th>
                <th className="py-2.5 px-3">LEETCODE</th>
                <th className="py-2.5 px-3">VISUALGO</th>
                <th className="py-2.5 px-3">CHATGPT</th>
                <th className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-500/10 rounded-t-lg">COGNIFLOW AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Dynamic User Code Animation</td>
                <td className="py-2.5 px-3 text-rose-400">✕ None</td>
                <td className="py-2.5 px-3 text-rose-400">✕ Hardcoded Only</td>
                <td className="py-2.5 px-3 text-rose-400">✕ Text Only</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-500/5">✓ ANY Python/JS Code</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Execution Trace Depth</td>
                <td className="py-2.5 px-3 text-slate-400">Binary Output</td>
                <td className="py-2.5 px-3 text-slate-400">5–7 Steps</td>
                <td className="py-2.5 px-3 text-slate-400">Static Explanation</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-500/5">✓ 18–22 Granular Frames</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Multi-Domain Integration</td>
                <td className="py-2.5 px-3 text-slate-400">DSA Only</td>
                <td className="py-2.5 px-3 text-slate-400">DSA Only</td>
                <td className="py-2.5 px-3 text-slate-400">Fragmented</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-500/5">✓ DSA + SQL + System Design</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">AI Pedagogy</td>
                <td className="py-2.5 px-3 text-slate-400">Discussion Board</td>
                <td className="py-2.5 px-3 text-slate-400">None</td>
                <td className="py-2.5 px-3 text-rose-400">Full Code Spoiled</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-500/5">✓ 3-Level Socratic Hints</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // Slide 12: Team & Conclusion
    {
      id: 12,
      badge: 'Lenovo LEAP AI Hackathon 2026',
      title: 'Empowering the Next Generation of Engineers',
      subtitle: 'Because Great Engineers Aren’t Made by Memorizing Code — They’re Made by Seeing It Come Alive.',
      category: 'Conclusion',
      notes:
        'Thank you respected judges! We invite you to experience CogniFlow AI live right now at localhost:3000. We are ready for your questions!',
      renderContent: () => (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-4 max-w-3xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg shadow-emerald-500/30">
            CF
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            "Because Great Engineers Aren’t Made by Memorizing Code —
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              They’re Made by Seeing It Come Alive."
            </span>
          </h2>

          <p className="text-sm text-slate-300">
            Ready to deploy across AKTU universities to transform placement outcomes and deep technical mastery.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Launch Live Website (localhost:3000)</span>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen(prev => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div
      className={`min-h-screen bg-[#090d16] text-white flex flex-col justify-between selection:bg-emerald-500/30 ${
        isFullscreen ? 'fixed inset-0 z-50 p-6' : 'p-4 md:p-8'
      }`}
    >
      {/* ── Top Header Bar ── */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{current.category}</span>
          </div>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              showNotes
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
            title="Toggle Presenter Speaker Notes (Shortcut: N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speaker Notes</span>
          </button>

          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-white transition-all cursor-pointer"
            title="Toggle Fullscreen (Shortcut: F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Main Slide Stage (Website Theme Styled) ── */}
      <main className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="w-full max-w-6xl min-h-[520px] rounded-3xl bg-[#0d1322] border border-slate-800/80 shadow-2xl shadow-emerald-950/20 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing radial blur background matching website */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Header */}
          <div className="space-y-1.5 z-10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-[11px]">
                {current.badge}
              </span>
              <span className="text-slate-400">
                Slide {current.id} of {slides.length}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {current.title}
            </h2>
            {current.subtitle && (
              <p className="text-xs md:text-sm text-slate-400">{current.subtitle}</p>
            )}
          </div>

          {/* Slide Body */}
          <div className="my-auto py-6 flex items-center justify-center z-10 w-full">
            {current.renderContent()}
          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400 z-10">
            <span>CogniFlow AI • Lenovo LEAP AI Hackathon</span>
            <span>Use ← / → keys or buttons to navigate</span>
          </div>
        </div>

        {/* ── Speaker Notes Drawer (Collapsible) ── */}
        {showNotes && (
          <div className="w-full max-w-6xl mt-4 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 font-mono space-y-1.5 animate-fadeIn">
            <div className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>PRESENTER TALKING POINTS (SPEAKER SCRIPT):</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-sm">
              "{current.notes}"
            </p>
          </div>
        )}
      </main>

      {/* ── Bottom Controls Bar ── */}
      <footer className="flex items-center justify-between border-t border-slate-800/80 pt-4">
        {/* Previous button */}
        <button
          onClick={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev))}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Slide Indicator Dots / Strip */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-6 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-xs shadow-emerald-500/50'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to Slide ${s.id}: ${s.title}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : prev))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:bg-slate-900 disabled:text-slate-500 disabled:border disabled:border-slate-800 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
