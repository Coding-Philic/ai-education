'use client';

// =====================================================================
// CogniFlow AI: SQL Lab Interactive Relational Engine Visualizer
// Completely Dynamic: Multi-Table In-Memory Execution, Real-Time Animated
// Relational Canvas, Groq Cloud LPU AI Synthesis & Two-Stage AI Tutor
// =====================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Table2,
  GitMerge,
  Layers,
  CheckCircle2,
  Sliders,
  Terminal,
  Search,
  HelpCircle,
  Lightbulb,
  Cpu,
  Check,
  Copy,
  ArrowRight,
  Filter,
  AlertTriangle,
  Code2,
  Zap,
  Eye,
} from 'lucide-react';
import { Challenge, VisualFrame, AiRemediationAdvice } from '@/lib/types';
import { SQLChallengeMeta, SQL_CHALLENGES } from '@/lib/sql-challenges-data';
import { executeSqlEngine, SqlEngineResult, SqlExecutionFrame } from '@/lib/sql-engine';

interface SqlLabVisualizerProps {
  challenge: Challenge;
  allChallenges?: Challenge[];
  onSelectChallenge?: (challenge: Challenge) => void;
}

type SqlCategory = 'all' | 'filtering' | 'joins' | 'aggregates' | 'subqueries' | 'window';
type ViewTab = 'visualizer' | 'results' | 'venn' | 'query_plan' | 'tables';

export default function SqlLabVisualizer({
  challenge,
  allChallenges = [],
  onSelectChallenge,
}: SqlLabVisualizerProps) {
  // Use SQL_CHALLENGES catalog if available, or allChallenges passed from track
  const availableChallenges: SQLChallengeMeta[] =
    SQL_CHALLENGES.length > 0 ? SQL_CHALLENGES : (allChallenges as SQLChallengeMeta[]);

  const [currentChallenge, setCurrentChallenge] = useState<SQLChallengeMeta>(
    (availableChallenges.find((c) => c.id === challenge.id) ||
      availableChallenges[0] ||
      challenge) as SQLChallengeMeta
  );

  const [query, setQuery] = useState(
    currentChallenge.starterCode?.sql ||
      `SELECT s.name, c.title, e.enrolled_at\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id;`
  );

  // Category Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<SqlCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  // Execution & Visualization State
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('visualizer');
  const [executionResult, setExecutionResult] = useState<SqlEngineResult | null>(null);

  // Step-by-Step Frame Player State
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Groq Cloud AI Inference State
  const [aiFrames, setAiFrames] = useState<any[] | null>(null);
  const [aiAlgorithm, setAiAlgorithm] = useState<string>('');
  const [aiModel, setAiModel] = useState<string>('');
  const [aiInferenceLatency, setAiInferenceLatency] = useState<number | null>(null);

  // Stage 2 AI Remediation State (Asynchronous)
  const [remediationAdvice, setRemediationAdvice] = useState<AiRemediationAdvice | null>(null);
  const [isRemediationLoading, setIsRemediationLoading] = useState<boolean>(false);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(1);
  const [hasCopiedSolution, setHasCopiedSolution] = useState(false);

  // Dynamic tables from current challenge
  const tables = (currentChallenge.initialVisualState as any)?.tables || [];

  // Run initial query on mount or challenge switch
  useEffect(() => {
    runLocalEngine(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChallenge.id]);

  // Active Frames Source: AI synthesized frames if available, else local engine frames
  const activeFrames: any[] =
    aiFrames && aiFrames.length > 0
      ? aiFrames
      : executionResult?.frames && executionResult.frames.length > 0
      ? executionResult.frames
      : [];

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying && activeFrames.length > 0) {
      const delay = Math.max(300, Math.floor(1300 / playbackSpeed));
      playTimerRef.current = setTimeout(() => {
        setCurrentFrameIndex((prev) => {
          if (prev >= activeFrames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentFrameIndex, activeFrames, playbackSpeed]);

  const runLocalEngine = (sqlToRun: string) => {
    const result = executeSqlEngine(sqlToRun, tables);
    setExecutionResult(result);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    return result;
  };

  const handleSelectChallenge = (ch: SQLChallengeMeta) => {
    setCurrentChallenge(ch);
    const newQuery = ch.starterCode?.sql || '';
    setQuery(newQuery);
    setRemediationAdvice(null);
    setAiFrames(null);
    setAiAlgorithm('');
    setAiModel('');
    setAiInferenceLatency(null);
    if (onSelectChallenge) onSelectChallenge(ch);
    runLocalEngine(newQuery);
  };

  // Stage 1: Call Groq Cloud AI for Live Relational Frame Generation
  // Stage 2: Background Asynchronous Groq AI Socratic Hints & Invariant Diagnosis
  const handleExecuteSql = async () => {
    setIsExecuting(true);
    setIsRemediationLoading(true);
    setActiveTab('visualizer');

    // Run local preview immediately so UI is responsive
    const localResult = runLocalEngine(query);
    setIsPlaying(true);

    const startTime = performance.now();

    try {
      // Stage 1: Send query to /api/submissions (invokes Groq AI Live Inference)
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: currentChallenge.id,
          query,
          language: 'sql',
        }),
      });

      const subData = await subRes.json();
      const latency = Math.round(performance.now() - startTime);
      setAiInferenceLatency(latency);

      if (subData.success && subData.data?.visualFrames?.length > 0) {
        setAiFrames(subData.data.visualFrames);
        setAiAlgorithm(subData.data.algorithm || 'Relational Query Engine');
        setAiModel(subData.data.model || 'qwen/qwen3.8-27b');
        setCurrentFrameIndex(0);
        setIsPlaying(true);
      }

      // Stage 2: Send query to /api/submissions/remediation (Groq AI Socratic Remediation)
      const remRes = await fetch('/api/submissions/remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          problemStatement: currentChallenge.problemStatement,
          submittedCode: query,
          language: 'sql',
          benchmarkSolution: currentChallenge.benchmarkSolution,
          starterCode: currentChallenge.starterCode,
        }),
      });

      if (remRes.ok) {
        const remData = await remRes.json();
        if (remData.success && remData.data) {
          setRemediationAdvice(remData.data);
        }
      }
    } catch (err) {
      console.error('Groq AI submission execution error:', err);
    } finally {
      setIsExecuting(false);
      setIsRemediationLoading(false);
    }
  };

  // 1-Click Load Canonical Solution & Run
  const handleLoadOptimalSolution = () => {
    const optimalSql =
      remediationAdvice?.solution?.code ||
      (currentChallenge.benchmarkSolution as any)?.sql ||
      currentChallenge.starterCode?.sql ||
      '';
    setQuery(optimalSql);
    runLocalEngine(optimalSql);
    setHasCopiedSolution(true);
    setTimeout(() => setHasCopiedSolution(false), 2000);
  };

  // Filter challenges by category & search query
  const filteredChallenges = availableChallenges.filter((ch) => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory;
    const qLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !qLower ||
      ch.title.toLowerCase().includes(qLower) ||
      ch.problemStatement.toLowerCase().includes(qLower) ||
      (ch.lcNumber && String(ch.lcNumber).includes(qLower));
    return matchesCategory && matchesSearch;
  });

  const activeFrame = activeFrames[currentFrameIndex] || activeFrames[0];

  // Derive Table A (Driving) and Table B (Secondary/Join) from schema
  const tableA = tables[0] || null;
  const tableB = tables[1] || null;

  // Determine active row index in Table A
  const activeRowIdx: number =
    typeof activeFrame?.activeRowIndex === 'number'
      ? activeFrame.activeRowIndex
      : typeof activeFrame?.pointers?.row === 'number'
      ? activeFrame.pointers.row
      : (currentFrameIndex % Math.max(1, tableA?.rows.length || 1));

  // Determine active/probed row index in Table B
  const activeMatchedRowIdx: number =
    typeof activeFrame?.matchedRowIndex === 'number'
      ? activeFrame.matchedRowIndex
      : 0;

  // Match status determination
  const matchStatus: string =
    activeFrame?.matchStatus ||
    (activeFrame?.phase === 'JOIN_EVALUATION' || activeFrame?.phase === 'JOIN'
      ? 'MATCHED'
      : activeFrame?.phase === 'FILTER'
      ? 'FILTER_PASSED'
      : 'SCANNING');

  // Tuples emitted so far
  const totalEmitted = executionResult?.rows || [];
  const emittedSliceCount = Math.min(
    totalEmitted.length,
    Math.max(0, Math.floor(((currentFrameIndex + 1) / Math.max(1, activeFrames.length)) * totalEmitted.length))
  );
  const emittedTuples = totalEmitted.slice(0, Math.max(1, emittedSliceCount));

  return (
    <div className="space-y-6">
      {/* ── Category Filter Pills & Search Drawer Bar ── */}
      <div className="glass-panel p-3.5 rounded-2xl border border-[#E5E1D3] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {[
            { id: 'all', label: `All SQL (${availableChallenges.length})` },
            { id: 'filtering', label: 'Filtering & Sorting (5)' },
            { id: 'joins', label: 'Relational Joins (6)' },
            { id: 'aggregates', label: 'Aggregates & GROUP BY (6)' },
            { id: 'subqueries', label: 'Subqueries & CTEs (3)' },
            { id: 'window', label: 'Window Functions (2)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as SqlCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0D382B] border-[#0D382B] text-white shadow-xs font-bold'
                  : 'bg-white border-[#E5E1D3] text-[#5E6D66] hover:text-[#141A17] hover:border-[#D0CABA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Drawer Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9E98]" />
            <input
              type="text"
              placeholder="Search SQL or LC #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-xs text-[#141A17] placeholder-[#8E9E98] focus:outline-none focus:border-[#0D684D] w-44 md:w-56"
            />
          </div>
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F2E5] text-xs font-semibold text-[#141A17] flex items-center gap-1.5 border border-[#E0DCCF] cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#0D684D]" />
            <span>Curriculum ({filteredChallenges.length})</span>
          </button>
        </div>
      </div>

      {/* ── Curriculum Drawer (when open) ── */}
      {showDrawer && (
        <div className="glass-panel p-4 rounded-2xl border border-[#E5E1D3] bg-[#FAF7EF] shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto">
          {filteredChallenges.map((ch) => {
            const isSelected = currentChallenge.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  handleSelectChallenge(ch);
                  setShowDrawer(false);
                }}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#EFF5F0] border-2 border-[#0D684D] text-[#141A17] shadow-xs'
                    : 'bg-white border-[#E5E1D3] hover:border-[#0D684D]/40 hover:bg-[#FAF8EE] text-[#141A17]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF7EF] border border-[#E5E1D3] text-[#0D684D] font-bold">
                    {ch.lcNumber ? `LC ${ch.lcNumber}` : 'SQL'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      ch.difficultyTag === 'Easy'
                        ? 'bg-[#EFF5F0] text-[#0D684D] border border-[#D5E2D8]'
                        : ch.difficultyTag === 'Medium'
                        ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                        : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                    }`}
                  >
                    {ch.difficultyTag}
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-[#141A17]">{ch.title.split('(')[0]}</div>
                <div className="text-[10px] text-[#4A5852] mt-1 flex items-center justify-between">
                  <span className="capitalize">{ch.category}</span>
                  <span className="text-[#0D684D] font-mono font-semibold">+{ch.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Challenge Header Banner ── */}
      <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D] flex items-center gap-1">
              <Database className="w-3 h-3 text-[#10B981]" /> SQL Lab Relational Engine
            </span>
            {currentChallenge.lcNumber && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#6F7E77]">
                LeetCode #{currentChallenge.lcNumber}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D]">
              +{currentChallenge.xpReward} XP
            </span>
            <span className="text-xs text-[#6F7E77] font-mono">
              Available Tables: {tables.map((t: any) => t.name).join(', ')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#141A17] tracking-tight">{currentChallenge.title}</h2>
          <p className="text-xs text-[#5E6D66] mt-1 max-w-3xl leading-relaxed">
            {currentChallenge.problemStatement}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const starter = currentChallenge.starterCode?.sql || '';
              setQuery(starter);
              runLocalEngine(starter);
            }}
            title="Reset to starter SQL query"
            className="p-2.5 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#5E6D66] hover:text-[#141A17] transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExecuteSql}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isExecuting ? 'Synthesizing with Groq AI...' : 'Run Query & Explain'}</span>
          </button>
        </div>
      </div>

      {/* ── SQL Terminal Bar (Mac Mockup Card) ── */}
      <div className="glass-panel-dark p-4 rounded-2xl border border-[#23302B] flex flex-col h-[200px] shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2825]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
            <Terminal className="w-4 h-4 text-[#34D399]" />
            <span className="text-xs font-bold text-white">Interactive ANSI SQL Terminal</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#7C8E86]">
            {aiModel ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#131917] border border-[#23302B] text-[#34D399] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                Live Groq LPU: {aiModel} {aiInferenceLatency ? `(${aiInferenceLatency}ms)` : ''}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[#131917] border border-[#23302B] text-[#A7F3D0]">
                CogniFlow Relational Compiler
              </span>
            )}
          </div>
        </div>

        <textarea
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            runLocalEngine(e.target.value);
          }}
          className="w-full flex-1 mt-2.5 bg-transparent p-3 rounded-xl font-mono text-xs text-[#A7F3D0] resize-none focus:outline-none caret-[#34D399] leading-relaxed tracking-wide"
          placeholder="Write ANSI SQL (SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY)..."
          spellCheck={false}
        />
      </div>

      {/* ── PRIMARY INTERACTIVE VISUALIZER & INSPECTION TABS ── */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'visualizer'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#5E6D66] hover:text-[#141A17] bg-white border border-[#E5E1D3]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Relational Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'results'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#5E6D66] hover:text-[#141A17] bg-white border border-[#E5E1D3]'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Projected Result ({executionResult?.rowsReturned || 0} rows)</span>
            </button>
            <button
              onClick={() => setActiveTab('venn')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'venn'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#5E6D66] hover:text-[#141A17] bg-white border border-[#E5E1D3]'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Dynamic Venn Join</span>
            </button>
            <button
              onClick={() => setActiveTab('query_plan')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'query_plan'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#3A4742] hover:text-[#141A17] bg-white border border-[#E5E1D3]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual EXPLAIN Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'tables'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#3A4742] hover:text-[#141A17] bg-white border border-[#E5E1D3]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Catalog Tables ({tables.length})</span>
            </button>
          </div>

          {/* AI Model Tag */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#3A4742]">
            <span className="text-[#0D684D] font-bold">Strategy:</span>
            <span className="font-semibold">{aiAlgorithm || executionResult?.joinType || 'Relational Plan'}</span>
          </div>
        </div>

        {/* ── TAB 1: INTERACTIVE RELATIONAL VISUAL CANVAS ── */}
        {activeTab === 'visualizer' && (
          <div className="space-y-4">
            {/* Step Controls Header */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8EE] border border-[#E5E1D3] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>
                <button
                  disabled={currentFrameIndex === 0}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex((p) => Math.max(0, p - 1));
                  }}
                  className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#141A17] disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentFrameIndex >= activeFrames.length - 1}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex((p) => Math.min(activeFrames.length - 1, p + 1));
                  }}
                  className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#141A17] disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex(0);
                  }}
                  className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#141A17] hover:text-[#0D382B] cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#0D684D] font-bold">
                  Step {currentFrameIndex + 1} of {activeFrames.length || 1}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#3A4742] font-semibold">
                  <span>Speed:</span>
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                        playbackSpeed === s
                          ? 'bg-[#0D382B] text-white font-bold'
                          : 'bg-white text-[#3A4742] border border-[#E5E1D3] hover:text-[#141A17] font-semibold'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${(((currentFrameIndex + 1) / Math.max(1, activeFrames.length)) * 100)}%`,
                }}
              />
            </div>

            {/* ── THE VISUAL RELATIONAL EXECUTION CANVAS ── */}
            <div className="relative min-h-[380px] bg-slate-950/90 rounded-2xl border border-slate-800/90 p-5 overflow-hidden flex flex-col justify-between shadow-2xl">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

              {/* Top Station: Driving Table vs Secondary Table with Operator Hub */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10 items-center">
                {/* Driving Table (Left Station) - 5 cols */}
                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 px-1">
                    <span className="flex items-center gap-1.5">
                      <Table2 className="w-3.5 h-3.5" /> Driving Table: {tableA?.name || 'Relation A'}
                    </span>
                    <span className="text-[10px] text-slate-500">{tableA?.rows.length || 0} rows</span>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {tableA?.rows.map((row: any, rIdx: number) => {
                      const isScanning = activeRowIdx === rIdx;
                      return (
                        <div
                          key={rIdx}
                          className={`p-2.5 rounded-xl border transition-all duration-300 relative ${
                            isScanning
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 opacity-80'
                          }`}
                        >
                          {isScanning && (
                            <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 shadow animate-bounce">
                              ▶ SCANNING ROW {rIdx}
                            </span>
                          )}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                            {Object.entries(row).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-500">{k}: </span>
                                <span className={isScanning ? 'text-cyan-200 font-bold' : 'text-slate-300'}>
                                  {String(v ?? 'NULL')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Relational Comparator Engine Hub (Center) - 2 cols */}
                <div className="md:col-span-2 flex flex-col items-center justify-center py-2 relative z-10">
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-indigo-900/60 to-slate-900 border border-indigo-500/50 shadow-xl shadow-indigo-500/20 flex flex-col items-center text-center gap-1.5">
                    <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-wide">
                      {activeFrame?.phase || 'OPERATOR'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-800/40 truncate max-w-[90px]">
                      {activeFrame?.action || 'PROBE'}
                    </span>
                  </div>

                  {/* Dynamic Status Badge */}
                  <div className="mt-2 text-center">
                    {matchStatus === 'MATCHED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 animate-pulse">
                        ✓ MATCHED
                      </span>
                    )}
                    {matchStatus === 'PRUNED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-400 text-rose-300 shadow-md shadow-rose-500/20">
                        ✗ PRUNED
                      </span>
                    )}
                    {matchStatus === 'PRESERVED_NULL' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-400 text-amber-300 shadow-md shadow-amber-500/20">
                        ⚠ NULL PAD
                      </span>
                    )}
                    {matchStatus === 'FILTER_PASSED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                        ✓ FILTER PASS
                      </span>
                    )}
                    {matchStatus === 'FILTER_REJECTED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-400 text-rose-300">
                        ✗ FILTER OUT
                      </span>
                    )}
                    {matchStatus === 'SCANNING' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                        SCANNING
                      </span>
                    )}
                  </div>
                </div>

                {/* Secondary / Joined Table (Right Station) - 5 cols */}
                <div className="md:col-span-5 space-y-2">
                  {tableB ? (
                    <>
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400 px-1">
                        <span className="flex items-center gap-1.5">
                          <Table2 className="w-3.5 h-3.5" /> Joined Table: {tableB.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{tableB.rows.length} rows</span>
                      </div>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {tableB.rows.map((row: any, rIdx: number) => {
                          const isMatched = matchStatus === 'MATCHED' && (activeMatchedRowIdx === rIdx || rIdx === 0);
                          return (
                            <div
                              key={rIdx}
                              className={`p-2.5 rounded-xl border transition-all duration-300 relative ${
                                isMatched
                                  ? 'bg-indigo-950/80 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                                  : 'bg-slate-900/80 border-slate-800 text-slate-300 opacity-80'
                              }`}
                            >
                              {isMatched && (
                                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500 text-white shadow animate-bounce">
                                  ★ KEY MATCH
                                </span>
                              )}
                              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                                {Object.entries(row).map(([k, v]) => (
                                  <div key={k} className="truncate">
                                    <span className="text-slate-500">{k}: </span>
                                    <span className={isMatched ? 'text-indigo-200 font-bold' : 'text-slate-300'}>
                                      {String(v ?? 'NULL')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                      <Database className="w-8 h-8 text-slate-700" />
                      <span>Single-table operation. No secondary join relation active.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Shelf: Emitted Result Relation Stream */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Emitted Result Pipeline (Emitted tuples: {emittedTuples.length})
                  </span>
                  <span className="text-[10px] text-slate-500">Active Buffer RAM Cache</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {emittedTuples.map((tuple, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-[11px] font-mono text-emerald-200 shrink-0 shadow-md shadow-emerald-500/10 animate-fadeIn"
                    >
                      {Object.entries(tuple).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="mr-2">
                          <span className="text-slate-400">{k}:</span> {String(v ?? 'NULL')}
                        </span>
                      ))}
                    </div>
                  ))}
                  {emittedTuples.length === 0 && (
                    <span className="text-xs text-slate-500 italic py-1">Awaiting tuples from execution pipeline...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Step Explanation Card */}
            {activeFrame && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[11px] font-bold uppercase">
                      Phase: {activeFrame.phase || 'SCAN'}
                    </span>
                    <span className="text-xs font-mono text-indigo-300 font-semibold">
                      {activeFrame.action || 'QUERY_STEP'}
                    </span>
                  </div>
                  {activeFrame.variables && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>Active State: {JSON.stringify(activeFrame.variables).slice(0, 50)}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                  {activeFrame.explanation || 'Step execution complete.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PROJECTED RESULT SET TABLE ── */}
        {activeTab === 'results' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#141A17] flex items-center gap-1.5">
                <Table2 className="w-4 h-4 text-[#0D684D]" /> Complete Result Set
              </span>
              {executionResult && (
                <span className="text-[11px] font-mono text-[#0D684D] bg-[#EFF5F0] px-2 py-0.5 rounded border border-[#D5E2D8] font-semibold">
                  {executionResult.rowsReturned} rows in {executionResult.runtimeMs}ms
                </span>
              )}
            </div>

            {executionResult && executionResult.success ? (
              <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      {executionResult.columns.map((col) => (
                        <th key={col} className="p-2.5 font-bold text-cyan-300 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                    {executionResult.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        {executionResult.columns.map((col) => (
                          <td key={col} className="p-2.5 text-slate-200 whitespace-nowrap">
                            {row[col] === null || row[col] === undefined ? (
                              <span className="text-slate-500 italic font-mono">NULL</span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#4A5852]">
                Click &quot;Run Query &amp; Explain&quot; to execute SQL and inspect result set.
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: DYNAMIC VENN DIAGRAM ── */}
        {activeTab === 'venn' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            {executionResult?.vennData ? (
              <div className="space-y-4">
                <div className="relative w-80 h-44 mx-auto flex items-center justify-center">
                  {/* Left Circle */}
                  <div className="absolute left-2 w-40 h-40 rounded-full border-2 border-cyan-400 bg-cyan-500/15 flex flex-col items-start justify-center pl-4 text-xs font-bold text-cyan-300">
                    <span className="capitalize">{executionResult.vennData.leftTable}</span>
                    <span className="text-[11px] font-mono text-slate-300">
                      Total: {executionResult.vennData.leftCount}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/80">
                      Unmatched: {executionResult.vennData.leftOnlyCount}
                    </span>
                  </div>

                  {/* Right Circle */}
                  <div className="absolute right-2 w-40 h-40 rounded-full border-2 border-indigo-400 bg-indigo-500/15 flex flex-col items-end justify-center pr-4 text-xs font-bold text-indigo-300">
                    <span className="capitalize">{executionResult.vennData.rightTable}</span>
                    <span className="text-[11px] font-mono text-slate-300">
                      Total: {executionResult.vennData.rightCount}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400/80">
                      Unmatched: {executionResult.vennData.rightOnlyCount}
                    </span>
                  </div>

                  {/* Intersection (Matched) */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex flex-col items-center justify-center text-xs font-bold text-white shadow-xl shadow-emerald-500/20 animate-pulse">
                    <span>Matched</span>
                    <span className="text-sm font-mono font-black text-emerald-300">
                      {executionResult.vennData.matchCount}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  <span className="font-bold text-cyan-400">Join Predicate:</span>{' '}
                  <code className="font-mono text-amber-300">
                    {executionResult.vennData.joinCondition}
                  </code>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <GitMerge className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Single-table query active. Add a <code className="text-cyan-300 font-mono">JOIN ... ON ...</code> clause to observe dynamic multi-table Venn intersection.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: VISUAL EXPLAIN PLAN ── */}
        {activeTab === 'query_plan' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span>EXPLAIN (ANALYZE, BUFFERS, VERBOSE)</span>
              <span className="text-emerald-400">
                Total Plan Cost: {executionResult?.cost?.toFixed(2) || '12.4'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-700/50">
                <div className="flex items-center justify-between text-indigo-300 font-bold">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-cyan-400" />
                    <span>{executionResult?.explainPlan?.nodeType || 'Relational Plan'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {executionResult?.runtimeMs || 0.15}ms
                  </span>
                </div>
                {executionResult?.explainPlan?.condition && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cond: {executionResult.explainPlan.condition}
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-[10px] text-emerald-400">
                  <span>Rows: {executionResult?.rowsReturned || 0}</span>
                  <span>Startup Cost: 1.15</span>
                  <span>Total Cost: 12.4</span>
                </div>
              </div>

              <div className="pl-6 space-y-2 border-l-2 border-indigo-800/50">
                {executionResult?.explainPlan?.children?.map((child, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                    <span className="font-bold text-cyan-400">
                      ├─ {child.nodeType} on {child.relationName}
                    </span>
                    <p className="text-slate-400 text-[10px]">
                      Startup Cost: {child.startupCost} | Total Cost: {child.totalCost} | Rows: {child.actualRows}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: CATALOG TABLES ── */}
        {activeTab === 'tables' && (
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {tables.map((table: any) => (
              <div key={table.name} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wide block mb-2">
                  Table: {table.name} ({table.rows.length} tuples)
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="text-slate-500 border-b border-slate-800">
                      <tr>
                        {Object.keys(table.rows[0] || {}).map((col) => (
                          <th key={col} className="pb-1 pr-3">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-slate-300 divide-y divide-slate-800/40">
                      {table.rows.map((r: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          {Object.values(r).map((val: any, j: number) => (
                            <td key={j} className="py-1 pr-3">
                              {val === null ? (
                                <span className="text-slate-500 italic">NULL</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── STAGE 2: GROQ AI SOCRATIC GUIDANCE & REMEDIATION PANEL ── */}
      <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6D8]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8]">
              <Sparkles className="w-4 h-4 text-[#0D684D]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141A17] flex items-center gap-2">
                CogniFlow AI Remediation &amp; Socratic Guidance
                {isRemediationLoading && (
                  <span className="text-[10px] font-mono text-[#0D684D] animate-pulse bg-[#EFF5F0] px-2 py-0.5 rounded border border-[#D5E2D8] font-semibold">
                    Synthesizing with Groq LPU...
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#4A5852]">
                Automated relational defect diagnosis, progressive hints, and benchmark solution
              </p>
            </div>
          </div>

          {/* Quick Action: 1-Click Load Canonical Solution */}
          <button
            onClick={handleLoadOptimalSolution}
            className="px-4 py-2 rounded-xl bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
          >
            {hasCopiedSolution ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 fill-white" />}
            <span>{hasCopiedSolution ? 'Loaded & Executing!' : 'Load Canonical Query & Run'}</span>
          </button>
        </div>

        {/* Remediation Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Defect Diagnosis (Why it breaks / Works) - 6 cols */}
          <div className="md:col-span-6 space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF7EF] border border-[#E5E1D3] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#141A17]">
                <HelpCircle className="w-3.5 h-3.5 text-[#0D684D]" />
                <span>Relational Invariant Diagnosis:</span>
              </div>
              <p className="text-xs text-[#2B3632] leading-relaxed">
                {remediationAdvice?.bugExplanation ||
                  'Click "Run Query & Explain" to receive real-time pedagogical diagnosis on join invariants, null semantics, and grouping correctness.'}
              </p>
              {remediationAdvice?.solution && (
                <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-[#4A5852] border-t border-[#E5E1D3] font-semibold">
                  <span>Time: {remediationAdvice.solution.timeComplexity}</span>
                  <span>•</span>
                  <span>Space: {remediationAdvice.solution.spaceComplexity}</span>
                </div>
              )}
            </div>

            {/* Socratic Hints (Level 1, 2, 3) */}
            <div className="p-4 rounded-xl bg-[#FAF7EF] border border-[#E5E1D3] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#141A17]">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Progressive Socratic Hints:</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveHintLevel(lvl)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        activeHintLevel === lvl
                          ? 'bg-[#0D382B] text-white shadow-xs'
                          : 'bg-white text-[#4A5852] border border-[#E5E1D3] hover:text-[#141A17]'
                      }`}
                    >
                      Hint {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {remediationAdvice?.hints && remediationAdvice.hints.length > 0 ? (
                <div className="p-3 rounded-lg bg-white border border-[#E5E1D3] text-xs shadow-xs">
                  <span className="font-bold text-[#0D684D] block mb-1">
                    Level {activeHintLevel}:{' '}
                    {remediationAdvice.hints[activeHintLevel - 1]?.title || 'Invariant Clue'}
                  </span>
                  <p className="text-[#2B3632] leading-relaxed text-[11px]">
                    {remediationAdvice.hints[activeHintLevel - 1]?.hint ||
                      'Consider whether unmatched rows should be preserved using a LEFT JOIN or pruned using an INNER JOIN.'}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-white border border-[#E5E1D3] text-xs text-[#5E6D66]">
                  Click &quot;Run Query &amp; Explain&quot; to synthesize progressive Socratic hints dynamically.
                </div>
              )}
            </div>
          </div>

          {/* Benchmark Optimal Query Solution Code - 6 cols */}
          <div className="md:col-span-6 space-y-2">
            <div className="p-4 rounded-xl bg-[#FAF7EF] border border-[#E5E1D3] flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6D8] mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#141A17]">
                  <Code2 className="w-3.5 h-3.5 text-[#0D684D]" />
                  <span>Canonical Optimal Query Solution</span>
                </div>
                <button
                  onClick={handleLoadOptimalSolution}
                  className="text-[10px] font-mono text-[#0D684D] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Load Into Editor</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-[#0F1413] border border-[#23302B] font-mono text-xs text-[#34D399] overflow-x-auto leading-relaxed flex-1 shadow-inner">
                {remediationAdvice?.solution?.code ||
                  (currentChallenge.benchmarkSolution as any)?.sql ||
                  currentChallenge.starterCode?.sql}
              </pre>

              {remediationAdvice?.solution?.explanation && (
                <p className="text-[11px] text-[#2B3632] mt-2 leading-relaxed">
                  {remediationAdvice.solution.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
