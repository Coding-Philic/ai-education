'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
  Sparkles, CheckCircle2, AlertTriangle, Code2,
  Sliders, Cpu, Eye, Terminal, Search, Filter,
  Layers, GitBranch, Binary, Network, ArrowRight,
  Hash, ChevronDown, Check, Lightbulb, BookOpen, Copy
} from 'lucide-react';
import { Challenge, VisualFrame, SkillGapAssessment, AiRemediationAdvice } from '@/lib/types';

interface DsaVisualizerProps {
  challenge: Challenge;
  allChallenges?: Challenge[];
  onSelectChallenge?: (challenge: Challenge) => void;
}

// ── Console log type ──
interface ConsoleLog {
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  msg: string;
}

function ts() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLog(prev: ConsoleLog[], type: ConsoleLog['type'], msg: string): ConsoleLog[] {
  return [...prev, { time: ts(), type, msg }].slice(-50); // keep last 50
}

// ── Helpers ──
function getAnimationCategory(hint: string): string {
  if (!hint) return 'generic';
  if (hint.includes('pointer')) return 'two-pointer';
  if (hint.includes('index-jump') || hint.includes('compare')) return 'search';
  if (hint.includes('swap') || hint.includes('split') || hint.includes('merge')) return 'sort';
  if (hint.includes('node') || hint.includes('edge')) return 'graph';
  if (hint.includes('table-fill')) return 'dp';
  if (hint.includes('recurse')) return 'recursion';
  return 'generic';
}

function extractPointers(frame: VisualFrame): Record<string, number> {
  const ptrs: Record<string, number> = {};
  if (frame.pointers) {
    Object.entries(frame.pointers).forEach(([k, v]) => {
      if (typeof v === 'number') ptrs[k] = v;
    });
  }
  const vars = (frame as any).variables || frame.memoryScope || {};
  const pointerKeywords = ['left', 'right', 'mid', 'i', 'j', 'lo', 'hi', 'start', 'end', 'low', 'high', 'slow', 'fast', 'prev', 'curr', 'next', 'ptr'];
  Object.entries(vars).forEach(([k, v]) => {
    if (typeof v === 'number' && pointerKeywords.some(pk => k.toLowerCase().includes(pk))) {
      if (!(k in ptrs)) ptrs[k] = v as number;
    }
  });
  return ptrs;
}

const POINTER_COLORS = [
  { bg: 'bg-emerald-500/20', border: 'border-emerald-400/60', text: 'text-emerald-300' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-400/60', text: 'text-indigo-300' },
  { bg: 'bg-amber-500/20', border: 'border-amber-400/60', text: 'text-amber-300' },
  { bg: 'bg-rose-500/20', border: 'border-rose-400/60', text: 'text-rose-300' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-400/60', text: 'text-cyan-300' },
];

const LOG_COLORS: Record<ConsoleLog['type'], string> = {
  info: 'text-slate-400',
  success: 'text-emerald-400',
  warn: 'text-amber-400',
  error: 'text-rose-400',
};

const LOG_PREFIXES: Record<ConsoleLog['type'], string> = {
  info: '●',
  success: '✓',
  warn: '⚠',
  error: '✗',
};

const LANGS = ['python', 'javascript', 'pseudocode', 'java', 'cpp'] as const;
type Lang = typeof LANGS[number];
const LANG_LABELS: Record<Lang, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  pseudocode: 'Pseudocode',
  java: 'Java',
  cpp: 'C++',
};

export const DSA_CATEGORIES = [
  { id: 'all', label: 'All Challenges' },
  { id: 'arrays', label: 'Arrays & Two Pointers' },
  { id: 'sliding-window', label: 'Sliding Window' },
  { id: 'linked-list', label: 'Linked Lists' },
  { id: 'stacks-queues', label: 'Stacks & Queues' },
  { id: 'trees', label: 'Binary Trees' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dp', label: 'Dynamic Programming' },
  { id: 'sorting-searching', label: 'Sorting & Searching' },
  { id: 'backtracking-heaps', label: 'Backtracking & Heaps' },
] as const;

// ── Multi-Structure Canvas Renderers ──

function renderLinkedList(elements: any[], pointers: Record<string, number>, highlighted: number[]) {
  const nodes = elements && elements.length > 0 ? elements : [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center py-6 px-2 animate-fadeIn">
      {nodes.map((val, idx) => {
        const isHighlighted = highlighted?.includes(idx);
        const activePtrs = Object.entries(pointers).filter(([_, pIdx]) => pIdx === idx);
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="h-6 flex items-center gap-1 mb-1">
                {activePtrs.map(([pName]) => (
                  <span key={pName} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 animate-bounce">
                    {pName}
                  </span>
                ))}
              </div>
              <div className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-mono font-bold transition-all duration-300 ${
                activePtrs.length > 0
                  ? 'bg-emerald-950/70 border-2 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/30 scale-105'
                  : isHighlighted
                  ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-slate-900 border border-slate-700 text-slate-200'
              }`}>
                <span className="text-sm font-bold">{String(val)}</span>
                <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">next</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">[{idx}]</span>
            </div>
            {idx < nodes.length - 1 ? (
              <div className="text-cyan-400 font-mono text-lg pt-4">→</div>
            ) : (
              <div className="flex items-center pt-4 text-slate-600 font-mono text-xs">
                <span className="text-cyan-400 text-lg mr-1">→</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500">NULL</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderStack(elements: any[], pointers: Record<string, number>, highlighted: number[]) {
  const stack = elements || [];
  return (
    <div className="flex flex-col items-center py-4 w-full animate-fadeIn">
      <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
        <span>Stack Top (LIFO)</span>
        <span className="text-amber-400 font-bold">↓</span>
      </div>
      <div className="w-64 min-h-[160px] max-h-[260px] border-b-4 border-x-2 border-indigo-500/60 rounded-b-2xl p-3 flex flex-col-reverse gap-2 bg-slate-950/80 overflow-y-auto shadow-inner shadow-indigo-950/50">
        {stack.length === 0 ? (
          <div className="h-28 flex items-center justify-center text-xs font-mono text-slate-600">
            [ Empty Stack Container ]
          </div>
        ) : (
          stack.map((elem, idx) => {
            const isTop = idx === stack.length - 1;
            const isHighlighted = highlighted?.includes(idx);
            return (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center justify-between transition-all duration-300 ${
                  isTop
                    ? 'bg-amber-500/20 border border-amber-400 text-amber-200 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : isHighlighted
                    ? 'bg-indigo-500/20 border border-indigo-400 text-indigo-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold text-sm">{String(elem)}</span>
                <span className="text-[9px] font-mono text-slate-500">
                  {isTop ? 'TOP [index ' + idx + ']' : 'index ' + idx}
                </span>
              </div>
            );
          })
        )}
      </div>
      <div className="text-[10px] font-mono text-slate-500 mt-2">
        Stack Depth: {stack.length} elements
      </div>
    </div>
  );
}

function renderTreeNodes(elements: any[], pointers: Record<string, number>, highlighted: number[]) {
  const tree = elements && elements.length > 0 ? elements : [5, 1, 4, null, null, 3, 6];
  
  // Dynamically calculate tree depth (supports up to 5 levels)
  const totalLevels = Math.min(5, Math.max(2, Math.floor(Math.log2(Math.max(1, tree.length))) + 1));
  const width = 620;
  const levelHeight = 72;
  const height = totalLevels * levelHeight + 35;

  interface NodeCoord {
    idx: number;
    val: any;
    cx: number;
    cy: number;
    parentIdx: number;
    px: number;
    py: number;
  }

  const nodes: NodeCoord[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number; isActive: boolean; key: string }[] = [];

  for (let lvl = 0; lvl < totalLevels; lvl++) {
    const slotsInLevel = 1 << lvl;
    const colWidth = width / slotsInLevel;
    const cy = 38 + lvl * levelHeight;

    for (let pos = 0; pos < slotsInLevel; pos++) {
      const idx = (slotsInLevel - 1) + pos;
      if (idx >= tree.length) break;

      const val = tree[idx];
      const cx = colWidth * pos + colWidth / 2;

      let parentIdx = -1;
      let px = cx;
      let py = cy;

      if (idx > 0) {
        parentIdx = Math.floor((idx - 1) / 2);
        const parentLvl = lvl - 1;
        const parentSlots = 1 << parentLvl;
        const parentColWidth = width / parentSlots;
        const parentPos = Math.floor(pos / 2);
        px = parentColWidth * parentPos + parentColWidth / 2;
        py = 38 + parentLvl * levelHeight;

        // If current node is not null, draw branch from parent
        if (val !== null && val !== undefined) {
          const isActive = pointers.node === idx || pointers.curr === idx || highlighted?.includes(idx);
          lines.push({
            x1: px,
            y1: py + 14,
            x2: cx,
            y2: cy - 14,
            isActive,
            key: `branch-${parentIdx}-${idx}`,
          });
        }
      }

      nodes.push({ idx, val, cx, cy, parentIdx, px, py });
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fadeIn overflow-visible py-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-2xl h-auto overflow-visible select-none drop-shadow-md"
        style={{ minHeight: `${height}px` }}
      >
        <defs>
          <linearGradient id="branchGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
          </linearGradient>
          <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting branch lines */}
        {lines.map(line => (
          <line
            key={line.key}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.isActive ? 'url(#branchGlow)' : '#334155'}
            strokeWidth={line.isActive ? '3' : '1.75'}
            strokeDasharray={line.isActive ? 'none' : '4 2'}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        ))}

        {/* Tree Nodes */}
        {nodes.map(({ idx, val, cx, cy }) => {
          const isNull = val === null || val === undefined;
          const isHighlighted = highlighted?.includes(idx);
          const activePtrs = Object.entries(pointers).filter(([_, pIdx]) => pIdx === idx);
          const hasPtrs = activePtrs.length > 0;

          if (isNull) {
            return (
              <g key={idx} className="opacity-25">
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill="#090d16"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  null
                </text>
              </g>
            );
          }

          const nodeRadius = totalLevels > 3 ? 16 : 20;

          return (
            <g key={idx} className="transition-all duration-300">
              {/* Pointer labels */}
              {hasPtrs && (
                <g transform={`translate(${cx}, ${cy - nodeRadius - 10})`}>
                  {activePtrs.map(([pName], pIdx) => (
                    <g key={pName} transform={`translate(${(pIdx - (activePtrs.length - 1) / 2) * 36}, 0)`}>
                      <rect
                        x="-16"
                        y="-8"
                        width="32"
                        height="15"
                        rx="4"
                        fill="rgba(6, 182, 212, 0.25)"
                        stroke="#22d3ee"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill="#67e8f9"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {pName}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Node Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={nodeRadius}
                fill={
                  hasPtrs
                    ? '#1e1b4b'
                    : isHighlighted
                    ? '#451a03'
                    : '#0f172a'
                }
                stroke={
                  hasPtrs
                    ? '#22d3ee'
                    : isHighlighted
                    ? '#fbbf24'
                    : '#475569'
                }
                strokeWidth={hasPtrs ? 2.5 : isHighlighted ? 2.2 : 1.75}
                filter={hasPtrs || isHighlighted ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-300"
              />

              {/* Node Value */}
              <text
                x={cx}
                y={cy + 4.5}
                textAnchor="middle"
                fill={hasPtrs ? '#e0f2fe' : isHighlighted ? '#fef3c7' : '#f1f5f9'}
                fontSize={totalLevels > 3 ? '11' : '13'}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {String(val)}
              </text>

              {/* Node Index label below */}
              <text
                x={cx}
                y={cy + nodeRadius + 12}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8.5"
                fontFamily="monospace"
              >
                idx {idx}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function renderGraphNodes(elements: any[], pointers: Record<string, number>, highlighted: number[]) {
  const nodes = elements && elements.length > 0 ? elements : [0, 1, 2, 3];
  return (
    <div className="flex items-center justify-center gap-5 py-6 flex-wrap max-w-lg animate-fadeIn">
      {nodes.map((node, idx) => {
        const isHighlighted = highlighted?.includes(idx);
        const activePtrs = Object.entries(pointers).filter(([_, pIdx]) => pIdx === idx);
        return (
          <div key={idx} className="flex flex-col items-center">
            <div className="h-5 flex items-center gap-1 mb-1">
              {activePtrs.map(([pName]) => (
                <span key={pName} className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/60 animate-bounce">
                  {pName}
                </span>
              ))}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-xs p-2 text-center transition-all duration-300 ${
              activePtrs.length > 0
                ? 'bg-purple-600/30 border-2 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/40 scale-110'
                : isHighlighted
                ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/30'
                : 'bg-slate-900 border border-slate-700 text-slate-300'
            }`}>
              {typeof node === 'object' ? JSON.stringify(node) : `V(${String(node)})`}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1">
              {isHighlighted ? '● Visited' : '○ Unvisited'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function renderDPTable(elements: any[], pointers: Record<string, number>, highlighted: number[]) {
  const table = elements && elements.length > 0 ? elements : [0, 1, 1, 2, 3, 5, 8];
  return (
    <div className="flex flex-col items-center py-4 w-full overflow-x-auto animate-fadeIn">
      <div className="text-[11px] font-mono text-slate-400 mb-3 flex items-center gap-2">
        <span>Memoization Table:</span>
        <span className="text-cyan-400 font-bold font-mono">dp[0..{Math.max(0, table.length - 1)}]</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center max-w-full px-2">
        {table.map((val, idx) => {
          const isCurrent = pointers.i === idx || pointers.ans === idx || pointers.curr === idx;
          const isHighlighted = highlighted?.includes(idx);
          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-slate-500 mb-1">dp[{idx}]</span>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30 scale-105'
                  : isHighlighted
                  ? 'bg-indigo-500/20 border border-indigo-400 text-indigo-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}>
                {val !== null && val !== undefined ? String(val) : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DsaVisualizer({ challenge, allChallenges = [], onSelectChallenge }: DsaVisualizerProps) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenge);
  const [lang, setLang] = useState<Lang>('python');
  const [code, setCode] = useState(
    (challenge.starterCode as any)?.python || (challenge.starterCode as any)?.pseudocode || ''
  );
  const [frames, setFrames] = useState<VisualFrame[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [skillGap, setSkillGap] = useState<SkillGapAssessment | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [detectedAlgo, setDetectedAlgo] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { time: ts(), type: 'info', msg: 'CogniFlow AI Terminal ready.' },
    { time: ts(), type: 'info', msg: 'Paste any algorithm or pseudocode and click Run & Visualize.' },
  ]);

  // Stage 2: AI Remediation, Progressive Hints & Optimal Solution
  const [remediation, setRemediation] = useState<AiRemediationAdvice | null>(null);
  const [remediationLoading, setRemediationLoading] = useState(false);
  const [remediationTab, setRemediationTab] = useState<'hints' | 'solution' | 'breakdown'>('hints');
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(1);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [solutionLoadedAlert, setSolutionLoadedAlert] = useState(false);

  // Challenge Category & Search filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom Input Bar state
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customArrayStr, setCustomArrayStr] = useState('10, 22, 35, 47, 50, 63, 75, 88, 99');
  const [customTargetStr, setCustomTargetStr] = useState('47');

  // Dynamically extracted elements for visualization canvas
  const [visualElements, setVisualElements] = useState<any[]>(
    (challenge.initialVisualState as any)?.elements || [10, 22, 35, 47, 50, 63, 75, 88, 99]
  );
  const [editorMode, setEditorMode] = useState<'practice' | 'visualization'>('visualization');
  const consoleRef = useRef<HTMLDivElement>(null);
  const codeLines = code.split('\n');

  // Sync if parent updates challenge
  useEffect(() => {
    setCurrentChallenge(challenge);
    setCode((challenge.starterCode as any)?.[lang] || (challenge.starterCode as any)?.python || (challenge.starterCode as any)?.pseudocode || '');
    if ((challenge.initialVisualState as any)?.elements) {
      const elems = (challenge.initialVisualState as any).elements;
      setVisualElements(elems);
      setCustomArrayStr(Array.isArray(elems) ? elems.join(', ') : '');
      if ((challenge.initialVisualState as any)?.target !== undefined) {
        setCustomTargetStr(String((challenge.initialVisualState as any).target));
      }
    }
  }, [challenge]);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Auto-run on mount
  useEffect(() => {
    handleRunCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && frames.length > 0) {
      timer = setTimeout(() => {
        if (currentStep < frames.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1400 / speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, frames.length, speed]);

  // Switch challenge handler
  const handleSelectChallenge = (ch: Challenge) => {
    setCurrentChallenge(ch);
    const newCode = (ch.starterCode as any)?.[lang] || (ch.starterCode as any)?.python || '';
    setCode(newCode);
    const elems = (ch.initialVisualState as any)?.elements || [10, 22, 35, 47, 50, 63, 75, 88, 99];
    setVisualElements(elems);
    setCustomArrayStr(elems.join(', '));
    if ((ch.initialVisualState as any)?.target !== undefined) {
      setCustomTargetStr(String((ch.initialVisualState as any).target));
    }
    if (onSelectChallenge) onSelectChallenge(ch);

    // Run right away with new challenge
    runAlgorithm(newCode, ch);
  };

  // Apply custom array/target from toolbar
  const handleApplyCustomInputs = () => {
    const parsedNums = customArrayStr
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
    const targetVal = parseInt(customTargetStr.trim(), 10);

    if (parsedNums.length > 0) {
      setVisualElements(parsedNums);

      // Also update code literal if found
      let updatedCode = code;
      // Replace array definition
      if (updatedCode.includes('my_list =') || updatedCode.includes('numbers =') || updatedCode.includes('arr =')) {
        updatedCode = updatedCode.replace(
          /((?:my_list|numbers|arr|nums)\s*=\s*)\[[\d,\s\-]+\]/i,
          `$1[${parsedNums.join(', ')}]`
        );
      }
      // Replace target definition
      if (!isNaN(targetVal) && (updatedCode.includes('target_value =') || updatedCode.includes('target ='))) {
        updatedCode = updatedCode.replace(
          /((?:target_value|target|val)\s*=\s*)-?\d+/i,
          `$1${targetVal}`
        );
      }
      setCode(updatedCode);
      runAlgorithm(updatedCode, currentChallenge, parsedNums);
    }
  };

  const handleRunCode = () => {
    runAlgorithm(code, currentChallenge);
  };

  const runAlgorithm = async (codeToRun: string, ch: Challenge, overrideElements?: number[]) => {
    setLoading(true);
    setIsPlaying(false);
    setDetectedAlgo('');
    setFrames([]);
    setCurrentStep(0);

    const startTime = Date.now();

    setConsoleLogs(prev => addLog(prev, 'info', `─────────────────────────────`));
    setConsoleLogs(prev => addLog(prev, 'info', `Submitting code [${lang}] to AI Execution Core...`));
    setConsoleLogs(prev => addLog(prev, 'info', `Challenge: ${ch.title}`));

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: ch.id, code: codeToRun, language: lang, mode: editorMode }),
      });

      const elapsed = Date.now() - startTime;
      const json = await res.json();

      if (!res.ok || !json.success) {
        setConsoleLogs(prev => addLog(prev, 'error', `HTTP ${res.status}: ${json.error || 'Request failed'}`));
        return;
      }

      if (json.success && json.data) {
        const vf: VisualFrame[] = json.data.visualFrames || [];
        const algo = (json.data as any).algorithm || (vf[0] as any)?.algorithm || 'Unknown';
        const isGroqReal = algo !== 'Algorithm' && vf.length > 4;

        // ── Extract actual array elements from AI frames or user code ──
        let extractedElements: number[] | null = overrideElements || null;
        if (!extractedElements) {
          const ds = (vf[0] as any)?.dataStructureState;
          if (Array.isArray(ds?.elements) && ds.elements.length > 0 && typeof ds.elements[0] === 'number') {
            extractedElements = ds.elements;
          }
        }
        if (!extractedElements) {
          const match = codeToRun.match(/(?:[a-zA-Z_]\w*\s*=\s*\[|\[|\{)([\d,\s\.\-]+)(?:\]|\})/);
          if (match) {
            const nums = match[1].split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            if (nums.length >= 2) extractedElements = nums;
          }
        }
        if (extractedElements && extractedElements.length > 0) {
          setVisualElements(extractedElements);
          setCustomArrayStr(extractedElements.join(', '));
          setConsoleLogs(prev => addLog(prev, 'info', `Active Canvas Array: [${extractedElements!.slice(0, 8).join(', ')}${extractedElements!.length > 8 ? '...' : ''}]`));
        }

        setConsoleLogs(prev => addLog(prev, 'success', `Execution trace generated in ${elapsed}ms`));
        const realModel = (json.data as any).model || 'qwen/qwen3.8-27b';
        setConsoleLogs(prev => addLog(prev, isGroqReal ? 'success' : 'info',
          isGroqReal
            ? `Groq LPU Acceleration Active ✓ (${realModel})`
            : `Local Cognitive Simulation Engine ✓`
        ));
        setConsoleLogs(prev => addLog(prev, 'success', `Algorithm identified: "${algo}"`));
        setConsoleLogs(prev => addLog(prev, 'info', `Visual animation frames: ${vf.length}`));
        setConsoleLogs(prev => addLog(prev, 'info', `Evaluation: ${json.data.evaluation}`));

        if (json.data.skillGap) {
          setConsoleLogs(prev => addLog(prev, 'info', `Skill Gap Score: ${json.data.skillGap.conceptSeverityScore}/100`));
          setConsoleLogs(prev => addLog(prev, 'info', `Diagnosis: ${json.data.skillGap.gapCategory}`));
        }

        setFrames(vf);
        setCurrentStep(0);
        setSkillGap(json.data.skillGap);
        setEvaluationStatus(json.data.evaluation === 'passed' ? 'passed' : 'failed');
        setDetectedAlgo(algo);
        setIsPlaying(true);
        setConsoleLogs(prev => addLog(prev, 'success', `Animation started → ${vf.length} steps`));

        // ── Stage 2: Automatically trigger background AI Remediation, Hints & Solution ──
        fetchRemediation(codeToRun, ch.id, lang);
      }
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      setConsoleLogs(prev => addLog(prev, 'error', `Network error after ${elapsed}ms: ${err?.message || 'Unknown'}`));
      console.error('Visualization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemediation = async (codeToAnalyze: string, challengeId: string, currentLang: string) => {
    setRemediationLoading(true);
    setConsoleLogs(prev => addLog(prev, 'info', 'Stage 2: Invoking AI Tutor for progressive hints & solution...'));
    try {
      const res = await fetch('/api/submissions/remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code: codeToAnalyze, language: currentLang }),
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setRemediation(resJson.data);
        setRevealedHintLevel(1);
        setConsoleLogs(prev => addLog(prev, 'success', 'Stage 2: AI Hints & Benchmark Solution synthesized ✓'));
        if (resJson.data.isBuggy) {
          setConsoleLogs(prev => addLog(prev, 'warn', 'AI Defect Doctor: Identified invariant violation in code'));
        }
      }
    } catch (err) {
      console.error('Stage 2 Remediation error:', err);
    } finally {
      setRemediationLoading(false);
    }
  };

  const activeFrame: VisualFrame = frames[currentStep] || {
    step: 1, lineNumber: 1, action: 'IDLE',
    explanation: 'Paste any algorithm above and click "Run & Visualize". AI will trace every step.',
    pointers: {}, highlightedElements: [], memoryScope: {},
  };

  const activeHint = (activeFrame as any).animationHint || '';
  const animCat = getAnimationCategory(activeHint);
  const pointers = extractPointers(activeFrame);
  const pointerKeys = Object.keys(pointers);

  const allVars: Record<string, any> = {
    ...(activeFrame.memoryScope || {}),
    ...((activeFrame as any).variables || {}),
    ...pointers,
  };

  const activeLine = (activeFrame.lineNumber ?? 1) - 1;
  const activeElements: any[] = (
    activeFrame.dataStructureState?.elements &&
    Array.isArray(activeFrame.dataStructureState.elements) &&
    activeFrame.dataStructureState.elements.length > 0
  ) ? activeFrame.dataStructureState.elements : visualElements;

  const currentStructureType =
    activeFrame.dataStructureState?.type ||
    (currentChallenge.initialVisualState as any)?.type ||
    'ARRAY';

  const challengesList = allChallenges.length > 0 ? allChallenges : [currentChallenge];
  const filteredChallenges = challengesList.filter((ch: any) => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      ch.title.toLowerCase().includes(q) ||
      ch.slug.toLowerCase().includes(q) ||
      (ch.lcNumber && String(ch.lcNumber).includes(q)) ||
      (ch.problemStatement && ch.problemStatement.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Dynamic problem title
  const displayedTitle = detectedAlgo && detectedAlgo !== 'Algorithm' && !currentChallenge.title.toLowerCase().includes(detectedAlgo.toLowerCase())
    ? `${detectedAlgo} — Live Execution Trace`
    : currentChallenge.title;

  return (
    <div className="space-y-4">

      {/* ── Mode Switcher: Visualization vs Practice Mode ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-[#FAF8EE] rounded-2xl border border-[#E5E1D3]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FAF8EE] p-1 rounded-full border border-[#E5E1D3]">
            <button
              onClick={() => setEditorMode('practice')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorMode === 'practice'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#5E6D66] hover:text-[#141A17]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Practice Mode (AI Compiler)</span>
            </button>
            <button
              onClick={() => {
                setEditorMode('visualization');
                const canonical = (currentChallenge.starterCode as any)?.[lang] || (currentChallenge.starterCode as any)?.python || '';
                if (canonical) setCode(canonical);
              }}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorMode === 'visualization'
                  ? 'bg-[#0D382B] text-white shadow-xs font-bold'
                  : 'text-[#5E6D66] hover:text-[#141A17]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Visualization Mode (Locked)</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#5E6D66] hidden md:flex items-center gap-2 pr-2">
          {editorMode === 'practice' ? (
            <span className="text-[#0D684D] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Write ANY code (Python, JS, Java, C++) → AI parses & animates exact numbers
            </span>
          ) : (
            <span className="text-[#0D382B] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0D684D]" />
              Pre-configured algorithmic benchmarks & step-by-step memory stepper
            </span>
          )}
        </div>
      </div>

      {/* ── Category Tabs Pill Row ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DSA_CATEGORIES.map(cat => {
          const isCatSelected = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? (allChallenges.length > 0 ? allChallenges.length : 1)
            : (allChallenges as any[]).filter(c => c.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isCatSelected
                  ? 'bg-[#0D382B] border-[#0D382B] text-white shadow-xs font-bold'
                  : 'bg-white border-[#E5E1D3] text-[#5E6D66] hover:text-[#141A17] hover:border-[#D0CABA]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isCatSelected ? 'bg-[#145341] text-white' : 'bg-[#FAF8EE] text-[#6F7E77] border border-[#E5E1D3]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search Bar, Algorithm Chips & Custom Input Bar ── */}
      <div className="glass-panel p-4 rounded-2xl border border-[#E5E1D3] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8E9E98] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 50+ algorithms (e.g. Reverse List, Tree, Coin Change, LC 206, Binary)..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8EE] border border-[#E5E1D3] rounded-full text-xs text-[#141A17] placeholder-[#8E9E98] font-mono focus:outline-none focus:border-[#0D684D] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E9E98] hover:text-[#141A17] text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-[#6F7E77]">
              Showing <strong className="text-[#141A17]">{filteredChallenges.length}</strong> of {allChallenges.length || 1}
            </span>
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono border flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                showCustomInput
                  ? 'bg-[#EFF5F0] border-[#0D684D] text-[#0D382B] font-semibold'
                  : 'bg-white border-[#E5E1D3] text-[#5E6D66] hover:text-[#141A17]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showCustomInput ? 'Hide Custom' : 'Custom Inputs'}</span>
            </button>
          </div>
        </div>

        {/* Algorithm Selection Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredChallenges.length === 0 ? (
            <div className="text-xs text-[#8E9E98] font-mono py-2">
              No matching algorithms found for &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredChallenges.map((ch: any) => {
              const isSelected = currentChallenge.id === ch.id;
              const shortTitle = ch.title.split(' (LC')[0].split(' - ')[0];
              const diff = ch.difficultyTag || 'Medium';
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#EFF5F0] border-[#0D684D] text-[#0D382B] shadow-xs ring-1 ring-[#0D684D]/30 font-bold'
                      : 'bg-white border-[#E5E1D3] text-[#4E5C56] hover:text-[#141A17] hover:border-[#D0CABA]'
                  }`}
                >
                  {ch.lcNumber && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#6F7E77]">
                      LC {ch.lcNumber}
                    </span>
                  )}
                  <span>{shortTitle}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                    diff === 'Easy'
                      ? 'bg-[#EFF5F0] border-[#D5E2D8] text-[#0D684D]'
                      : diff === 'Hard'
                      ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]'
                      : 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                  }`}>
                    {diff}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Collapsible Custom Input Drawer */}
      {showCustomInput && (
        <div className="glass-panel p-4 rounded-xl border border-cyan-800/40 bg-slate-950/70 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Custom Input Array (comma-separated):
              </label>
              <input
                type="text"
                value={customArrayStr}
                onChange={e => setCustomArrayStr(e.target.value)}
                placeholder="10, 22, 35, 47, 50, 63, 75, 88, 99"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="w-full sm:w-36">
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Target Value:
              </label>
              <input
                type="text"
                value={customTargetStr}
                onChange={e => setCustomTargetStr(e.target.value)}
                placeholder="47"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="pt-4 sm:pt-4 w-full sm:w-auto">
              <button
                onClick={handleApplyCustomInputs}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                Apply & Trace
              </button>
            </div>
          </div>
          
          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1">
            <span className="font-mono">Quick Presets:</span>
            <button
              onClick={() => {
                setCustomArrayStr('10, 22, 35, 47, 50, 63, 75, 88, 99');
                setCustomTargetStr('47');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px]"
            >
              Binary Search [10..99]
            </button>
            <button
              onClick={() => {
                setCustomArrayStr('2, 7, 11, 15');
                setCustomTargetStr('9');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-[10px]"
            >
              Two Sum [2, 7, 11, 15]
            </button>
            <button
              onClick={() => {
                setCustomArrayStr('64, 34, 25, 12, 22, 11, 90');
                setCustomTargetStr('');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[10px]"
            >
              Bubble Sort [64, 34..]
            </button>
            <button
              onClick={() => {
                setCustomArrayStr('2, 1, 5, 1, 3, 2');
                setCustomTargetStr('3');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px]"
            >
              Sliding Window (k=3)
            </button>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#E5E1D3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D]">DSA Visual Lab</span>
            {detectedAlgo && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#10B981]" /> AI Detected: {detectedAlgo}
              </span>
            )}
            <span className="text-xs text-[#6F7E77] font-mono font-medium">+{currentChallenge.xpReward} XP</span>
          </div>
          <h2 className="text-xl font-bold text-[#141A17] tracking-tight">{displayedTitle}</h2>
          <p className="text-xs text-[#5E6D66] mt-1 max-w-3xl leading-relaxed">{currentChallenge.problemStatement}</p>
        </div>
        {evaluationStatus !== 'idle' && (
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold border shrink-0 ${
            evaluationStatus === 'passed'
              ? 'bg-[#EFF5F0] border-[#D5E2D8] text-[#0D684D]'
              : 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]'
          }`}>
            {evaluationStatus === 'passed'
              ? <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              : <AlertTriangle className="w-4 h-4 text-[#E11D48]" />}
            <span>{evaluationStatus === 'passed' ? 'Solution Verified ✓' : 'Gap Isolated — Review Below'}</span>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT: Animation Canvas */}
        <div className="lg:col-span-7 space-y-4">

          <div className="glass-panel-glow p-6 rounded-2xl relative overflow-visible min-h-[320px] transition-all duration-300">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Visual Trace Canvas</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 font-semibold flex items-center gap-1.5 text-[11px]">
                  {currentStructureType === 'LINKED_LIST' && <GitBranch className="w-3.5 h-3.5 text-emerald-400" />}
                  {currentStructureType === 'STACK' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                  {currentStructureType === 'TREE' && <Binary className="w-3.5 h-3.5 text-cyan-400" />}
                  {currentStructureType === 'GRAPH' && <Network className="w-3.5 h-3.5 text-purple-400" />}
                  {currentStructureType === 'DP_TABLE' && <Hash className="w-3.5 h-3.5 text-indigo-400" />}
                  {currentStructureType === 'ARRAY' && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{currentStructureType.replace('_', ' ')}</span>
                </span>
                {animCat !== 'generic' && (
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">{animCat}</span>
                )}
                <span>Frame {frames.length > 0 ? currentStep + 1 : 0} / {frames.length}</span>
              </div>
            </div>

            {/* Multi-Data Structure Canvas */}
            <div className="py-4 flex flex-col items-center justify-center min-h-[260px] w-full transition-all duration-300 overflow-visible">
              {currentStructureType === 'LINKED_LIST' && renderLinkedList(activeElements, pointers, activeFrame.highlightedElements || [])}
              {currentStructureType === 'STACK' && renderStack(activeElements, pointers, activeFrame.highlightedElements || [])}
              {currentStructureType === 'TREE' && renderTreeNodes(activeElements, pointers, activeFrame.highlightedElements || [])}
              {currentStructureType === 'GRAPH' && renderGraphNodes(activeElements, pointers, activeFrame.highlightedElements || [])}
              {currentStructureType === 'DP_TABLE' && renderDPTable(activeElements, pointers, activeFrame.highlightedElements || [])}
              {(currentStructureType === 'ARRAY' || !['LINKED_LIST', 'STACK', 'TREE', 'GRAPH', 'DP_TABLE'].includes(currentStructureType)) && (
                <div className="flex flex-col items-center justify-center gap-6 w-full">
                  <div className="flex items-end gap-2.5 sm:gap-3.5 flex-wrap justify-center">
                    {activeElements.map((val: any, idx: number) => {
                      const pointingKeys = pointerKeys.filter(k => pointers[k] === idx);
                      const isHighlighted = activeFrame.highlightedElements?.includes(idx);
                      const displayVal = typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(2) : String(val);
                      return (
                        <div key={idx} className="flex flex-col items-center transition-all duration-500">
                          <div className="h-8 flex flex-col items-center justify-end gap-0.5 mb-1">
                            {pointingKeys.map((pk, pi) => {
                              const col = POINTER_COLORS[pi % POINTER_COLORS.length];
                              return (
                                <span key={pk} className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${col.bg} ${col.text} border ${col.border} animate-bounce`}
                                  style={{ animationDelay: `${pi * 100}ms` }}>
                                  {pk}
                                </span>
                              );
                            })}
                          </div>
                          <div className={`px-2.5 py-2 min-w-[3.2rem] h-12 sm:h-14 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold font-mono transition-all duration-400 ${
                            pointingKeys.length > 0
                              ? 'bg-indigo-600/30 border-2 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/25 scale-110'
                              : isHighlighted
                              ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200 shadow-lg shadow-amber-400/20 scale-105'
                              : 'bg-slate-900 border border-slate-700 text-slate-300'
                          }`}>
                            {displayVal}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Binary search range bar */}
                  {animCat === 'search' && (
                    <div className="w-full px-4 mt-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <span>Search range:</span>
                        <span className="text-cyan-400 font-mono">
                          [{pointers.lo ?? pointers.left ?? 0} → {pointers.hi ?? pointers.right ?? activeElements.length - 1}]
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 transition-all duration-500"
                          style={{
                            marginLeft: `${((pointers.lo ?? pointers.left ?? 0) / (activeElements.length || 1)) * 100}%`,
                            width: `${(((pointers.hi ?? pointers.right ?? (activeElements.length - 1)) - (pointers.lo ?? pointers.left ?? 0) + 1) / (activeElements.length || 1)) * 100}%`,
                          }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step Explanation */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Step {currentStep + 1}: </strong>
                <span>{activeFrame.explanation || 'Analyzing...'}</span>
              </div>
            </div>

            {/* Socratic Edge-Case Hint Banner */}
            {(activeFrame as any).edgeCaseHint && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed animate-fadeIn">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold">AI Pedagogical Hint: </strong>
                  <span>{(activeFrame as any).edgeCaseHint}</span>
                </div>
              </div>
            )}

            {/* Variable Inspector */}
            <div className="mt-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Variable Inspector</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(allVars).slice(0, 9).map(([key, val]) => {
                  const ptColor = pointerKeys.includes(key) ? POINTER_COLORS[pointerKeys.indexOf(key) % POINTER_COLORS.length] : null;
                  return (
                    <div key={key} className={`p-2.5 rounded-lg border transition-all duration-300 ${ptColor ? `${ptColor.bg} ${ptColor.border}` : 'bg-slate-950/60 border-slate-800/80'}`}>
                      <span className={`text-[10px] font-mono uppercase block ${ptColor ? ptColor.text : 'text-slate-500'}`}>{key}</span>
                      <span className={`text-sm font-mono font-bold ${ptColor ? ptColor.text : 'text-slate-200'}`}>
                        {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                      </span>
                    </div>
                  );
                })}
                {Object.keys(allVars).length === 0 && (
                  <div className="col-span-3 text-xs text-slate-500 py-2">Run code to see live variable states</div>
                )}
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="glass-panel p-3.5 rounded-xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} title="Reset"
                className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#4E5C56] hover:text-[#141A17] transition-colors cursor-pointer shadow-xs">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0}
                className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#4E5C56] hover:text-[#141A17] disabled:opacity-40 transition-colors cursor-pointer shadow-xs">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button onClick={() => setCurrentStep(p => Math.min((frames.length || 1) - 1, p + 1))} disabled={currentStep >= (frames.length || 1) - 1}
                className="p-2 rounded-full bg-white hover:bg-[#F5F2E5] border border-[#E0DCCF] text-[#4E5C56] hover:text-[#141A17] disabled:opacity-40 transition-colors cursor-pointer shadow-xs">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 mx-4 hidden sm:block">
              <div className="h-1.5 rounded-full bg-[#EAE6D8]">
                <div className="h-1.5 rounded-full bg-[#0D382B] transition-all duration-300"
                  style={{ width: frames.length > 0 ? `${((currentStep + 1) / frames.length) * 100}%` : '0%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="w-3.5 h-3.5 text-[#6F7E77]" />
              <div className="flex rounded-full bg-[#FAF8EE] p-0.5 border border-[#E5E1D3]">
                {[0.5, 1.0, 2.0].map(s => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors cursor-pointer ${speed === s ? 'bg-[#0D382B] text-white font-bold' : 'text-[#6F7E77] hover:text-[#141A17]'}`}>
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── AI CONSOLE TERMINAL (Mac Mockup Card) ── */}
          <div className="glass-panel-dark rounded-2xl border border-[#23302B] overflow-hidden shadow-sm">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F1413] border-b border-[#1E2825]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <Terminal className="w-3.5 h-3.5 text-[#6F7E77] ml-2" />
                <span className="text-xs font-mono font-semibold text-[#CBD5E1]">AI Response Console</span>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Waiting for Groq...
                  </span>
                )}
                <button
                  onClick={() => setConsoleLogs([{ time: ts(), type: 'info', msg: 'Console cleared.' }])}
                  className="text-[10px] text-slate-600 hover:text-slate-400 font-mono transition-colors"
                >
                  clear
                </button>
              </div>
            </div>

            {/* Log entries */}
            <div
              ref={consoleRef}
              className="h-44 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed bg-[#0a0f1a] space-y-0.5"
            >
              {consoleLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 group">
                  <span className="text-slate-600 shrink-0 select-none">{log.time}</span>
                  <span className={`shrink-0 ${LOG_COLORS[log.type]}`}>{LOG_PREFIXES[log.type]}</span>
                  <span className={`${LOG_COLORS[log.type]} break-all`}>{log.msg}</span>
                </div>
              ))}
              {/* Blinking cursor */}
              <div className="flex items-center gap-1 text-slate-600">
                <span>›</span>
                <span className="inline-block w-2 h-3.5 bg-slate-600 animate-pulse ml-0.5" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Code Editor + AI Diagnosis */}
        <div className="lg:col-span-5 space-y-4">

          {/* Code Editor (Mac Dark Mockup Container) */}
          <div className="glass-panel-dark p-4 rounded-2xl border border-[#23302B] flex flex-col shadow-sm" style={{ height: '420px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2825]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <Code2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-xs font-bold text-white">Code Editor</span>
                <span className="text-[10px] text-[#7C8E86]">— paste any algorithm</span>
              </div>
              <div className="flex rounded-full bg-[#1C2422] p-0.5 border border-[#283330]">
                {LANGS.map(l => (
                  <button key={l} onClick={() => {
                    setLang(l);
                    const starter = (currentChallenge.starterCode as any)?.[l];
                    if (starter) {
                      setCode(starter);
                    } else if (l === 'pseudocode') {
                      setCode(`// Pseudocode: ${currentChallenge.title}
ALGORITHM ${currentChallenge.slug.replace(/-/g, '_').toUpperCase()}():
    // Step 1: Initialize data structure
    SET state = INITIALIZE()
    // Step 2: Iterate and process
    WHILE NOT_EMPTY(state):
        IF CRITERIA_MET(state):
            RETURN RESULT
        TRANSITION(state)
    RETURN FINAL_RESULT`);
                    }
                  }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${lang === l ? 'bg-[#0D382B] text-white font-bold' : 'text-[#7C8E86] hover:text-white'}`}>
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Mode Banner: Read-Only in Visualization Mode vs Editable in Practice Mode */}
            {editorMode === 'visualization' ? (
              <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[11px] text-amber-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>🔒 Visualization Mode (Read-Only) — Benchmark Code Locked</span>
                </span>
                <button
                  onClick={() => setEditorMode('practice')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer text-[10px]"
                >
                  Switch to Practice Mode to edit
                </button>
              </div>
            ) : (
              <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>⚡ Practice Mode (Editable) — Write any custom code for AI compilation</span>
                </span>
                <span className="text-[10px] text-emerald-400/80">Groq AI Active</span>
              </div>
            )}

            {/* Editor with line numbers overlay */}
            <div className="flex-1 mt-2 bg-[#0A0E0D] rounded-xl border border-[#1E2825] overflow-hidden relative">
              {/* Line numbers + active-line highlight overlay */}
              <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-10 font-mono text-xs leading-[1.6rem] pt-2 pl-2">
                {codeLines.map((_, idx) => (
                  <div key={idx} className={`flex items-center h-[1.6rem] transition-colors duration-200 ${
                    idx === activeLine && frames.length > 0
                      ? 'bg-emerald-500/20 border-l-2 border-[#10B981] -ml-2 pl-2'
                      : ''
                  }`}>
                    <span className="w-7 shrink-0 text-right pr-3 text-[#52645D] text-[10px] select-none">{idx + 1}</span>
                  </div>
                ))}
              </div>
              {/* Main textarea: readOnly in visualization mode, fully editable in practice mode */}
              <textarea
                value={code}
                onChange={e => {
                  if (editorMode === 'visualization') return;
                  setCode(e.target.value);
                }}
                readOnly={editorMode === 'visualization'}
                spellCheck={false}
                wrap="off"
                className={`absolute inset-0 w-full h-full resize-none bg-transparent font-mono text-xs text-emerald-200 leading-[1.6rem] pt-2 pl-10 pr-3 focus:outline-none caret-[#34D399] z-20 overflow-x-auto ${
                  editorMode === 'visualization' ? 'cursor-not-allowed select-text opacity-85' : ''
                }`}
                placeholder={
                  editorMode === 'visualization'
                    ? '# Visualization Mode: Benchmark algorithm is locked read-only.\n# Switch to Practice Mode above to edit or paste your own code.'
                    : '# Practice Mode: Paste or write any algorithm here\n# Binary Search, Two Pointer, Merge Sort, BFS, DP...\n# Click Run & Visualize with AI below — AI traces every step!'
                }
              />
            </div>

            {/* Run button */}
            <button
              onClick={handleRunCode}
              disabled={loading}
              className="mt-3 w-full py-3 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#34D399]" />
              <span>
                {loading
                  ? 'AI Analyzing...'
                  : editorMode === 'practice'
                  ? 'Run & Visualize with AI (Practice Mode)'
                  : 'Run & Step Benchmark (Visualization Mode)'}
              </span>
            </button>
          </div>

          {/* AI Pedagogical Remediation Panel: Defect Doctor, Progressive Hints & Optimal Solution */}
          <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] space-y-4 animate-fadeIn shadow-xs">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#EAE6D8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>AI Invariant Core & Tutor</span>
                    {remediationLoading && (
                      <span className="text-[10px] font-mono font-normal text-cyan-400 animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Analyzing...
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400">Live defect diagnosis, progressive clues & optimal code</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setRemediationTab('hints')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    remediationTab === 'hints'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Hints</span>
                  {remediation?.hints && (
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[9px] font-mono text-cyan-300">
                      {remediation.hints.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setRemediationTab('solution')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    remediationTab === 'solution'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Benchmark Solution</span>
                </button>

                <button
                  onClick={() => setRemediationTab('breakdown')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    remediationTab === 'breakdown'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Skill Gap</span>
                </button>
              </div>
            </div>

            {/* Why this code breaks (Defect Diagnosis Alert) */}
            {remediation && remediation.isBuggy && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Why This Code Breaks (AI Defect Diagnosis)</span>
                </div>
                <p className="text-[11.5px] text-rose-200/90 leading-relaxed font-sans pl-6">
                  {remediation.bugExplanation}
                </p>
              </div>
            )}

            {/* If correct/passing */}
            {remediation && !remediation.isBuggy && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 font-semibold">Solution Invariants Verified ✓ </strong>
                  <span className="text-[11.5px] text-emerald-200/90">{remediation.bugExplanation}</span>
                </div>
              </div>
            )}

            {/* Loading Shimmer */}
            {remediationLoading && (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>AI Tutor synthesizing progressive hints & optimal code in {lang}...</span>
                </div>
                <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* Tab 1: AI Progressive Hints */}
            {!remediationLoading && remediationTab === 'hints' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Progressive Socratic Hints (learn step-by-step):</span>
                  <button
                    onClick={() => setRevealedHintLevel(3)}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-mono"
                  >
                    Reveal All Hints
                  </button>
                </div>

                {remediation?.hints ? (
                  remediation.hints.map((h, i) => {
                    const isRevealed = h.level <= revealedHintLevel;
                    const levelBadge = h.level === 1
                      ? { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', label: 'Hint 1: Conceptual Direction' }
                      : h.level === 2
                      ? { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', label: 'Hint 2: Edge Case & Invariants' }
                      : { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', label: 'Hint 3: Concrete Algorithmic Step' };

                    return (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${
                          isRevealed
                            ? 'bg-slate-900/80 border-slate-700/80 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${levelBadge.bg}`}>
                            {levelBadge.label}
                          </span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHintLevel(h.level)}
                              className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 text-[10px] font-mono cursor-pointer transition-all flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Reveal Hint {h.level}
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-slate-200 leading-relaxed font-sans">{h.hint}</p>
                        ) : (
                          <p className="text-xs text-slate-500 font-mono italic">
                            [ Click 'Reveal Hint {h.level}' when you want a targeted clue ]
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
                    Click 'Run & Visualize' to receive AI hints for your code.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Complete Benchmark Solution */}
            {!remediationLoading && remediationTab === 'solution' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Language:</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/70 text-indigo-300 font-mono text-[10px] font-bold uppercase">
                      {remediation?.solution?.language || lang}
                    </span>
                    {remediation?.solution?.timeComplexity && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]">
                        Time: {remediation.solution.timeComplexity}
                      </span>
                    )}
                    {remediation?.solution?.spaceComplexity && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]">
                        Space: {remediation.solution.spaceComplexity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy code */}
                    <button
                      onClick={() => {
                        if (remediation?.solution?.code) {
                          navigator.clipboard.writeText(remediation.solution.code);
                          setCopiedSolution(true);
                          setTimeout(() => setCopiedSolution(false), 2000);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSolution ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Load into Editor Button */}
                    <button
                      onClick={() => {
                        if (remediation?.solution?.code) {
                          setCode(remediation.solution.code);
                          setSolutionLoadedAlert(true);
                          setTimeout(() => setSolutionLoadedAlert(false), 3000);
                          runAlgorithm(remediation.solution.code, currentChallenge);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-90 text-white text-[11px] font-bold shadow-md shadow-emerald-700/30 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Load Solution & Trace</span>
                    </button>
                  </div>
                </div>

                {solutionLoadedAlert && (
                  <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✓ Solution loaded into Code Editor! AI is now animating the optimal trace.</span>
                  </div>
                )}

                {/* Code container */}
                <div className="relative rounded-xl border border-slate-800 bg-slate-950/90 p-3 overflow-x-auto max-h-64 shadow-inner">
                  <pre className="font-mono text-xs text-cyan-200 leading-relaxed">
                    <code>{remediation?.solution?.code || (currentChallenge.starterCode as any)?.[lang] || '# Solution ready upon running code'}</code>
                  </pre>
                </div>

                {/* Explanation */}
                {remediation?.solution?.explanation && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                    <strong className="text-white block mb-1">Algorithm Explanation:</strong>
                    <span>{remediation.solution.explanation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Skill Gap & Mastery */}
            {!remediationLoading && remediationTab === 'breakdown' && (
              <div className="space-y-3 animate-fadeIn">
                {skillGap ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{skillGap.gapCategory}</span>
                      <span className="text-xs font-mono text-cyan-400">
                        Mastery: {100 - (skillGap.conceptSeverityScore || 0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-700"
                        style={{ width: `${100 - (skillGap.conceptSeverityScore || 0)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{skillGap.rootCauseAnalysis}</p>
                    {skillGap.adaptiveStudyPlan?.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                          {step.stepOrder}
                        </span>
                        <div>
                          <strong className="text-white font-medium">{step.action}: </strong>
                          <span className="text-slate-400">{step.recommendation}</span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Run any algorithm to view skill gap breakdown.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
