'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Brain,
  Target,
  Clock,
  BookOpen,
  Code2,
  Database,
  Network,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Trophy,
  ArrowRight,
  RotateCcw,
  Calendar,
  TrendingUp,
  Star,
} from 'lucide-react';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface RoadmapTask { id: number; title: string; type: string; estimatedMinutes: number; completed?: boolean; }
interface RoadmapTopic {
  id: number; name: string; description: string; estimatedDays: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; xpReward: number;
  tasks: RoadmapTask[]; completed?: boolean; expanded?: boolean;
}
interface Roadmap {
  track: string; level: string; goal: string; mood: string;
  dailyHours: number; totalDays: number; projectedCompletion: string;
  topics: RoadmapTopic[]; generatedBy: string;
}

// ─────────────────────────────────────────
// Onboarding Questions
// ─────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'track',
    question: "Which track do you want to master? 🎯",
    options: [
      { value: 'dsa', label: 'DSA (Data Structures & Algorithms)', icon: '⚡', desc: 'Arrays, Trees, Graphs, DP' },
      { value: 'sql', label: 'SQL & Databases', icon: '🗄️', desc: 'Queries, Joins, Optimization' },
      { value: 'system-design', label: 'System Design', icon: '🏗️', desc: 'Architecture, Scale, Resilience' },
    ],
  },
  {
    id: 'level',
    question: "What's your current experience level? 📊",
    options: [
      { value: 'Beginner', label: 'Beginner', icon: '🌱', desc: 'Just starting out, learning basics' },
      { value: 'Intermediate', label: 'Intermediate', icon: '🔥', desc: 'Know fundamentals, want to go deeper' },
      { value: 'Advanced', label: 'Advanced', icon: '🚀', desc: 'Experienced, targeting FAANG-level' },
    ],
  },
  {
    id: 'goal',
    question: "What's your primary goal? 🏆",
    options: [
      { value: 'FAANG Interview', label: 'Crack FAANG/Big Tech Interview', icon: '🎯', desc: 'Google, Amazon, Meta, Microsoft' },
      { value: 'Startup Job', label: 'Land a Startup Job', icon: '💼', desc: 'Practical skills for fast-paced env' },
      { value: 'Competitive Programming', label: 'Competitive Programming', icon: '🏅', desc: 'ACM-ICPC, Codeforces, LeetCode' },
      { value: 'General Upskilling', label: 'General Upskilling', icon: '📈', desc: 'Improve skills at my own pace' },
    ],
  },
  {
    id: 'hours',
    question: "How many hours per day can you dedicate? ⏱️",
    options: [
      { value: '1', label: '1 hour/day', icon: '🌙', desc: 'Light, steady progress' },
      { value: '2', label: '2 hours/day', icon: '⚡', desc: 'Balanced learning pace' },
      { value: '4', label: '4 hours/day', icon: '🔥', desc: 'Intense, faster completion' },
      { value: '6', label: '6+ hours/day', icon: '💪', desc: 'Bootcamp mode, maximum speed' },
    ],
  },
  {
    id: 'mood',
    question: "How are you feeling today? Your plan adapts to your energy! 🌡️",
    options: [
      { value: 'tired', label: '😴 Tired / Low Energy', icon: '😴', desc: 'Lighter tasks, shorter sessions' },
      { value: 'neutral', label: '😐 Neutral / Focused', icon: '😐', desc: 'Standard balanced roadmap' },
      { value: 'motivated', label: '🔥 Motivated / High Energy', icon: '🔥', desc: 'Aggressive pace, more challenges' },
    ],
  },
];

const TRACK_ICONS: Record<string, React.ReactNode> = {
  dsa: <Code2 className="w-4 h-4" />,
  sql: <Database className="w-4 h-4" />,
  'system-design': <Network className="w-4 h-4" />,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
  Intermediate: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
  Advanced: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
};

const TYPE_ICONS: Record<string, string> = { read: '📖', solve: '💻', practice: '✏️', watch: '🎥' };

// ─────────────────────────────────────────
// XP State (stored in localStorage)
// ─────────────────────────────────────────
function useXP() {
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(1);
  useEffect(() => {
    setXP(parseInt(localStorage.getItem('cogniflow_xp') || '0'));
    setStreak(parseInt(localStorage.getItem('cogniflow_streak') || '1'));
  }, []);
  const addXP = (amount: number) => {
    setXP(prev => {
      const next = prev + amount;
      localStorage.setItem('cogniflow_xp', String(next));
      return next;
    });
  };
  const deductXP = (amount: number) => {
    setXP(prev => {
      const next = Math.max(0, prev - amount);
      localStorage.setItem('cogniflow_xp', String(next));
      return next;
    });
  };
  return { xp, streak, addXP, deductXP };
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function RoadmapPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [reRouting, setReRouting] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [xpToast, setXPToast] = useState<{ amount: number; visible: boolean; isDeduction?: boolean }>({ amount: 0, visible: false });
  const { xp, streak, addXP, deductXP } = useXP();
  const chatRef = useRef<HTMLDivElement>(null);

  // Load saved roadmap from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cogniflow_roadmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRoadmap(parsed);
        setTopics(parsed.topics || []);
        setStep(QUESTIONS.length + 1); // skip onboarding
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [step]);

  const handleSelectAnswer = async (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Last question answered → generate roadmap
      setStep(QUESTIONS.length);
      setLoading(true);
      try {
        const res = await fetch('/api/roadmap/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track: newAnswers.track || 'dsa',
            level: newAnswers.level || 'Beginner',
            goal: newAnswers.goal || 'General Upskilling',
            hours: parseInt(newAnswers.hours || '2'),
            mood: newAnswers.mood || value,
            existingTopics: '',
          }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          const rm: Roadmap = json.data;
          rm.topics = rm.topics.map(t => ({ ...t, expanded: false, completed: false, tasks: t.tasks.map(tk => ({ ...tk, completed: false })) }));
          setRoadmap(rm);
          setTopics(rm.topics);
          localStorage.setItem('cogniflow_roadmap', JSON.stringify(rm));
          setStep(QUESTIONS.length + 1);
        }
      } catch (err) {
        console.error('Roadmap generation failed:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTopic = (topicId: number) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, expanded: !t.expanded } : t));
  };

  const completeTask = (topicId: number, taskId: number) => {
    setTopics(prev => {
      const updated = prev.map(topic => {
        if (topic.id !== topicId) return topic;
        const updatedTasks = topic.tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        );
        const allDone = updatedTasks.every(t => t.completed);
        return { ...topic, tasks: updatedTasks, completed: allDone };
      });
      localStorage.setItem('cogniflow_roadmap', JSON.stringify({ ...roadmap, topics: updated }));
      return updated;
    });

    // Award XP
    const task = topics.find(t => t.id === topicId)?.tasks.find(tk => tk.id === taskId);
    const xpGain = task?.type === 'solve' ? 15 : 10;
    addXP(xpGain);
    setXPToast({ amount: xpGain, visible: true, isDeduction: false });
    setTimeout(() => setXPToast({ amount: 0, visible: false }), 2000);
  };

  const skipTask = (topicId: number, taskId: number) => {
    // Penalty: -10 XP for missing/skipping a task
    deductXP(10);
    setXPToast({ amount: 10, visible: true, isDeduction: true });
    setTimeout(() => setXPToast({ amount: 0, visible: false, isDeduction: false }), 2500);
  };

  const handleToggleReminder = () => {
    if (!remindersEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        setRemindersEnabled(true);
        if (perm === 'granted') {
          new Notification('CogniFlow AI: Daily Reminder Activated 🎯', {
            body: 'Your AI learning co-pilot will nudge you daily at 09:00 AM to keep your streak alive!',
          });
        }
      });
    } else {
      setRemindersEnabled(!remindersEnabled);
    }
  };

  const handleDynamicReRoute = async () => {
    if (!roadmap) return;
    setReRouting(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: roadmap.track,
          level: completedTasks > 4 ? 'Intermediate' : roadmap.level,
          goal: roadmap.goal,
          hours: roadmap.dailyHours,
          mood: 'motivated',
          existingTopics: topics.map(t => `${t.name}: ${t.completed ? 'COMPLETED' : 'IN_PROGRESS'}`).join(', '),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const rm: Roadmap = json.data;
        rm.topics = rm.topics.map(t => ({
          ...t,
          expanded: false,
          completed: false,
          tasks: t.tasks.map(tk => ({ ...tk, completed: false })),
        }));
        setRoadmap(rm);
        setTopics(rm.topics);
        localStorage.setItem('cogniflow_roadmap', JSON.stringify(rm));
        setXPToast({ amount: 20, visible: true, isDeduction: false });
        setTimeout(() => setXPToast({ amount: 0, visible: false }), 2000);
      }
    } catch (err) {
      console.error('Dynamic re-route failed:', err);
    } finally {
      setReRouting(false);
    }
  };

  const resetRoadmap = () => {
    localStorage.removeItem('cogniflow_roadmap');
    setRoadmap(null);
    setTopics([]);
    setAnswers({});
    setStep(0);
  };

  // Stats
  const completedTopics = topics.filter(t => t.completed).length;
  const completedTasks = topics.flatMap(t => t.tasks).filter(tk => tk.completed).length;
  const totalTasks = topics.flatMap(t => t.tasks).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalXP = topics.filter(t => t.completed).reduce((a, t) => a + t.xpReward, 0);

  // ─── Onboarding Chat View ───
  if (step <= QUESTIONS.length && !roadmap) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-xs font-semibold text-indigo-300">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Roadmap Generator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Your Personal <span className="text-gradient">AI Learning Co-pilot</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Answer a few questions and AI will generate a custom roadmap adapted to your goal, level, and today's energy.
          </p>
        </div>

        {/* Chat Window */}
        <div ref={chatRef} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          
          {/* Progress bar */}
          <div className="h-1 bg-slate-800">
            <div
              className="h-1 bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Show previous answered questions */}
            {QUESTIONS.slice(0, step).map((q, qi) => (
              <div key={q.id} className="space-y-2">
                {/* AI message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-slate-900/80 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-200 border border-slate-800">
                    {q.question}
                  </div>
                </div>
                {/* User answer */}
                {answers[q.id] && (
                  <div className="flex justify-end">
                    <div className="bg-indigo-600/20 border border-indigo-500/40 rounded-2xl rounded-tr-none px-4 py-2.5 text-sm text-indigo-200 max-w-xs">
                      {q.options.find(o => o.value === answers[q.id])?.label || answers[q.id]}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading state */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                </div>
                <div className="bg-slate-900/80 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span>Groq AI is generating your personalized roadmap...</span>
                </div>
              </div>
            )}

            {/* Current question */}
            {!loading && step < QUESTIONS.length && (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-slate-900/80 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-200 border border-slate-800">
                    {QUESTIONS[step].question}
                  </div>
                </div>

                {/* Options */}
                <div className="pl-10 grid gap-2">
                  {QUESTIONS[step].options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectAnswer(QUESTIONS[step].id, opt.value)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-left transition-all group"
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-indigo-200">{opt.label}</div>
                        <div className="text-xs text-slate-500">{opt.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 ml-auto transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < step ? 'bg-indigo-500 w-6' : i === step ? 'bg-cyan-400 w-4' : 'bg-slate-700 w-3'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Roadmap View ───
  if (!roadmap || topics.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500">
        <div className="text-center space-y-2">
          <Brain className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
          <p className="text-sm">Generating your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* XP Toast */}
      {xpToast.visible && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-2 rounded-xl shadow-lg text-white text-sm font-bold flex items-center gap-2 ${
            xpToast.isDeduction
              ? 'bg-rose-600 shadow-rose-600/30'
              : 'bg-indigo-600 shadow-indigo-500/30'
          }`}>
            <Zap className="w-4 h-4" />
            {xpToast.isDeduction ? `-${xpToast.amount} XP (Accountability Penalty)` : `+${xpToast.amount} XP`}
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="glass-panel-glow p-5 rounded-2xl border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {TRACK_ICONS[roadmap.track]}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {roadmap.track} Roadmap — {roadmap.level}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white">
              Goal: <span className="text-gradient">{roadmap.goal}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {roadmap.totalDays} days total</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {roadmap.dailyHours}h/day</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Complete by {roadmap.projectedCompletion}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDynamicReRoute}
              disabled={reRouting}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{reRouting ? '⚡ AI Calibrating...' : '⚡ AI Dynamic Re-Route'}</span>
            </button>

            <button
              onClick={handleToggleReminder}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                remindersEnabled
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span>{remindersEnabled ? '🔔 Reminder ON (9 AM)' : '🔕 Set AI Reminder'}</span>
            </button>

            <button
              onClick={resetRoadmap}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-indigo-400">{progressPct}%</div>
            <div className="text-[10px] text-slate-500 uppercase">Progress</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-emerald-400">{completedTasks}/{totalTasks}</div>
            <div className="text-[10px] text-slate-500 uppercase">Tasks Done</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-cyan-400">{xp}</div>
            <div className="text-[10px] text-slate-500 uppercase">Total XP</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />{streak}
            </div>
            <div className="text-[10px] text-slate-500 uppercase">Day Streak</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Mood badge */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>Mood-adapted plan:</span>
          <span className={`px-2 py-0.5 rounded font-semibold border text-[10px] ${
            roadmap.mood === 'tired' ? 'bg-blue-950/60 text-blue-400 border-blue-800/60' :
            roadmap.mood === 'motivated' ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' :
            'bg-slate-900 text-slate-400 border-slate-700'
          }`}>
            {roadmap.mood === 'tired' ? '😴 Lighter Pace' : roadmap.mood === 'motivated' ? '🔥 Aggressive Pace' : '😐 Standard Pace'}
          </span>
          <span className="ml-auto text-[10px] text-slate-600">{roadmap.generatedBy}</span>
        </div>
      </div>

      {/* Topics Timeline */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Learning Timeline</h2>
          <span className="text-xs text-slate-500">({topics.length} topics)</span>
        </div>

        {topics.map((topic, topicIdx) => {
          const topicCompleted = topic.completed;
          const tasksCompleted = topic.tasks.filter(t => t.completed).length;
          const topicProgress = topic.tasks.length > 0 ? (tasksCompleted / topic.tasks.length) * 100 : 0;
          const isActive = !topicCompleted && (topicIdx === 0 || topics[topicIdx - 1].completed);

          return (
            <div
              key={topic.id}
              className={`glass-panel rounded-2xl border transition-all duration-300 ${
                topicCompleted
                  ? 'border-emerald-800/40 bg-emerald-950/10'
                  : isActive
                  ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 opacity-75'
              }`}
            >
              {/* Topic Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                {/* Status icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  topicCompleted
                    ? 'bg-emerald-600/20 border border-emerald-500'
                    : isActive
                    ? 'bg-indigo-600/20 border border-indigo-500 animate-pulse'
                    : 'bg-slate-900 border border-slate-700'
                }`}>
                  {topicCompleted
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : isActive
                    ? <Star className="w-4 h-4 text-indigo-400" />
                    : <Circle className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{topic.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                        ← Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>{topic.estimatedDays} days</span>
                    <span>{tasksCompleted}/{topic.tasks.length} tasks</span>
                    <span className="text-indigo-400 font-semibold">+{topic.xpReward} XP</span>
                  </div>
                </div>

                {/* Progress mini bar */}
                <div className="hidden sm:flex items-center gap-2 w-24">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${topicProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-7 text-right">{Math.round(topicProgress)}%</span>
                </div>

                {topic.expanded
                  ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>

              {/* Expanded Tasks */}
              {topic.expanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-slate-800/60 pt-3">
                  <p className="text-xs text-slate-400 mb-3">{topic.description}</p>
                  {topic.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{TYPE_ICONS[task.type] || '📌'}</span>
                      <div className="flex-1">
                        <span className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        <div className="text-slate-600 text-[10px] mt-0.5">
                          {task.type} • ~{task.estimatedMinutes} min
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {task.type === 'solve' && (
                          <a
                            href={roadmap.track === 'sql' ? '/tracks/sql' : roadmap.track === 'system-design' ? '/tracks/system-design' : '/tracks/dsa'}
                            className="px-2 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-[10px] font-mono transition-colors"
                          >
                            Visualizer ↗
                          </a>
                        )}
                        {!task.completed ? (
                          <>
                            <button
                              onClick={() => completeTask(topic.id, task.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Done +{task.type === 'solve' ? 15 : 10} XP
                            </button>
                            <button
                              onClick={() => skipTask(topic.id, task.id)}
                              title="Penalty: -10 XP for missing task"
                              className="px-2 py-1 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 text-rose-400 text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              Missed (-10 XP)
                            </button>
                          </>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {completedTopics === topics.length && topics.length > 0 && (
        <div className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/40 text-center space-y-3">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Roadmap Complete! 🎉</h2>
          <p className="text-sm text-slate-400">You've finished all {topics.length} topics. Total XP earned: <strong className="text-amber-400">{totalXP}</strong></p>
          <button onClick={resetRoadmap} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-bold">
            Start a New Track
          </button>
        </div>
      )}
    </div>
  );
}
