'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Brain,
  Target,
  Clock,
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
  BookOpen,
  FileText,
  PlayCircle,
  Bell,
  BellOff
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
// Onboarding Questions (Clean Minimal — No Emojis)
// ─────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'track',
    question: "Which track do you want to master?",
    options: [
      { value: 'dsa', label: 'DSA (Data Structures & Algorithms)', desc: 'Arrays, Trees, Graphs, DP' },
      { value: 'sql', label: 'SQL & Databases', desc: 'Queries, Joins, Optimization' },
      { value: 'system-design', label: 'System Design', desc: 'Architecture, Scale, Resilience' },
    ],
  },
  {
    id: 'level',
    question: "What's your current experience level?",
    options: [
      { value: 'Beginner', label: 'Beginner', desc: 'Just starting out, learning basics' },
      { value: 'Intermediate', label: 'Intermediate', desc: 'Know fundamentals, want to go deeper' },
      { value: 'Advanced', label: 'Advanced', desc: 'Experienced, targeting FAANG-level' },
    ],
  },
  {
    id: 'goal',
    question: "What's your primary goal?",
    options: [
      { value: 'FAANG Interview', label: 'Crack FAANG/Big Tech Interview', desc: 'Google, Amazon, Meta, Microsoft' },
      { value: 'Startup Job', label: 'Land a Startup Job', desc: 'Practical skills for fast-paced env' },
      { value: 'Competitive Programming', label: 'Competitive Programming', desc: 'ACM-ICPC, Codeforces, LeetCode' },
      { value: 'General Upskilling', label: 'General Upskilling', desc: 'Improve skills at my own pace' },
    ],
  },
  {
    id: 'hours',
    question: "How many hours per day can you dedicate?",
    options: [
      { value: '1', label: '1 hour/day', desc: 'Light, steady progress' },
      { value: '2', label: '2 hours/day', desc: 'Balanced learning pace' },
      { value: '4', label: '4 hours/day', desc: 'Intense, faster completion' },
      { value: '6', label: '6+ hours/day', desc: 'Bootcamp mode, maximum speed' },
    ],
  },
  {
    id: 'mood',
    question: "How are you feeling today? Your plan adapts to your energy!",
    options: [
      { value: 'tired', label: 'Tired / Low Energy', desc: 'Lighter tasks, shorter sessions' },
      { value: 'neutral', label: 'Neutral / Focused', desc: 'Standard balanced roadmap' },
      { value: 'motivated', label: 'Motivated / High Energy', desc: 'Aggressive pace, more challenges' },
    ],
  },
];

const TRACK_ICONS: Record<string, React.ReactNode> = {
  dsa: <Code2 className="w-4 h-4 text-[#0D684D]" />,
  sql: <Database className="w-4 h-4 text-[#0284C7]" />,
  'system-design': <Network className="w-4 h-4 text-[#7C3AED]" />,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-[#EFF5F0] text-[#0D684D] border-[#D5E2D8]',
  Intermediate: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  Advanced: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
};

const renderTaskIcon = (type: string) => {
  switch (type) {
    case 'solve':
      return <Code2 className="w-4 h-4 text-[#0284C7]" />;
    case 'read':
      return <BookOpen className="w-4 h-4 text-[#0D684D]" />;
    case 'practice':
      return <FileText className="w-4 h-4 text-[#D97706]" />;
    case 'watch':
      return <PlayCircle className="w-4 h-4 text-[#7C3AED]" />;
    default:
      return <Target className="w-4 h-4 text-[#6F7E77]" />;
  }
};

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
          new Notification('CogniFlow AI: Daily Reminder Activated', {
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
      <div className="max-w-2xl mx-auto space-y-6 pb-14">
        {/* Header */}
        <div className="text-center space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-xs font-semibold text-[#0D684D] shadow-xs">
            <Brain className="w-3.5 h-3.5 text-[#0D684D]" />
            <span>AI Roadmap Generator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141A17] tracking-tight">
            Your Personal <span className="text-[#0D684D] italic font-serif">AI Learning Co-pilot</span>
          </h1>
          <p className="text-sm text-[#5E6D66] max-w-md mx-auto leading-relaxed">
            Answer a few quick questions and Groq Cloud AI will generate a custom curriculum adapted to your goal, level, and today&apos;s energy.
          </p>
        </div>

        {/* Chat Window */}
        <div ref={chatRef} className="glass-panel rounded-2xl border border-[#E5E1D3] overflow-hidden shadow-xs">
          
          {/* Progress bar */}
          <div className="h-1.5 bg-[#EAE6D8]">
            <div
              className="h-1.5 bg-[#0D382B] transition-all duration-500"
              style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Show previous answered questions */}
            {QUESTIONS.slice(0, step).map((q) => (
              <div key={q.id} className="space-y-2.5">
                {/* AI message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0D382B] flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <div className="bg-[#FAF8EE] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-[#141A17] border border-[#E5E1D3] font-medium shadow-xs">
                    {q.question}
                  </div>
                </div>
                {/* User answer */}
                {answers[q.id] && (
                  <div className="flex justify-end">
                    <div className="bg-[#0D382B] text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm font-semibold max-w-xs shadow-xs">
                      {q.options.find(o => o.value === answers[q.id])?.label || answers[q.id]}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading state */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0D382B] flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#34D399] animate-pulse" />
                </div>
                <div className="bg-[#FAF8EE] rounded-2xl rounded-tl-none px-4 py-3 border border-[#E5E1D3] flex items-center gap-2.5 text-xs text-[#5E6D66]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#0D382B] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#0D684D] animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span className="font-medium">Groq Cloud AI is generating your personalized roadmap...</span>
                </div>
              </div>
            )}

            {/* Current question */}
            {!loading && step < QUESTIONS.length && (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0D382B] flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <div className="bg-[#FAF8EE] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-[#141A17] border border-[#E5E1D3] font-medium shadow-xs">
                    {QUESTIONS[step].question}
                  </div>
                </div>

                {/* Options */}
                <div className="pl-10 grid gap-2.5">
                  {QUESTIONS[step].options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectAnswer(QUESTIONS[step].id, opt.value)}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white hover:bg-[#F5F2E5] border border-[#E5E1D3] hover:border-[#0D684D] text-left transition-all group shadow-xs cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#0D684D] opacity-60 group-hover:opacity-100 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#141A17] group-hover:text-[#0D382B]">{opt.label}</div>
                        <div className="text-xs text-[#6F7E77]">{opt.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8E9E98] group-hover:text-[#0D684D] ml-auto transition-colors" />
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
                i < step ? 'bg-[#0D382B] w-6' : i === step ? 'bg-[#10B981] w-4' : 'bg-[#D9D4C3] w-3'
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
      <div className="flex items-center justify-center py-32 text-[#6F7E77]">
        <div className="text-center space-y-2">
          <Brain className="w-8 h-8 mx-auto text-[#0D684D] animate-pulse" />
          <p className="text-sm font-medium">Generating your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14">
      
      {/* XP Toast */}
      {xpToast.visible && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-2 rounded-full shadow-lg text-white text-xs font-bold flex items-center gap-2 ${
            xpToast.isDeduction
              ? 'bg-[#E11D48]'
              : 'bg-[#0D382B]'
          }`}>
            <Zap className="w-3.5 h-3.5" />
            {xpToast.isDeduction ? `-${xpToast.amount} XP (Accountability Penalty)` : `+${xpToast.amount} XP`}
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {TRACK_ICONS[roadmap.track]}
              <span className="text-xs font-bold uppercase tracking-wider text-[#5E6D66]">
                {roadmap.track} Roadmap — {roadmap.level}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#141A17]">
              Goal: <span className="text-[#0D684D] italic font-serif">{roadmap.goal}</span>
            </h1>
            <p className="text-xs text-[#5E6D66] mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#0D684D]" /> {roadmap.totalDays} days total</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#0D684D]" /> {roadmap.dailyHours}h/day</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3 text-[#0D684D]" /> Complete by {roadmap.projectedCompletion}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDynamicReRoute}
              disabled={reRouting}
              className="px-4 py-2 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{reRouting ? 'Calibrating...' : 'AI Dynamic Re-Route'}</span>
            </button>

            <button
              onClick={handleToggleReminder}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                remindersEnabled
                  ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                  : 'bg-white border-[#E0DCCF] text-[#5E6D66] hover:text-[#141A17]'
              }`}
            >
              {remindersEnabled ? (
                <Bell className="w-3.5 h-3.5 text-[#B45309]" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-[#6F7E77]" />
              )}
              <span>{remindersEnabled ? 'Reminder ON (9 AM)' : 'Set AI Reminder'}</span>
            </button>

            <button
              onClick={resetRoadmap}
              className="flex items-center gap-1.5 text-xs text-[#8E9E98] hover:text-[#141A17] transition-colors cursor-pointer px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-center">
            <div className="text-2xl font-bold font-mono text-[#0D382B]">{progressPct}%</div>
            <div className="text-[10px] text-[#6F7E77] uppercase font-semibold">Progress</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-center">
            <div className="text-2xl font-bold font-mono text-[#0D684D]">{completedTasks}/{totalTasks}</div>
            <div className="text-[10px] text-[#6F7E77] uppercase font-semibold">Tasks Done</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-center">
            <div className="text-2xl font-bold font-mono text-[#B45309]">{xp}</div>
            <div className="text-[10px] text-[#6F7E77] uppercase font-semibold">Total XP</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-center">
            <div className="text-2xl font-bold font-mono text-[#E11D48] flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />{streak}
            </div>
            <div className="text-[10px] text-[#6F7E77] uppercase font-semibold">Day Streak</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full bg-[#EAE6D8]">
            <div
              className="h-2 rounded-full bg-[#0D382B] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Mood badge */}
        <div className="mt-3 flex items-center gap-2 text-xs text-[#5E6D66]">
          <span>Mood-adapted plan:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-semibold border text-[10px] ${
            roadmap.mood === 'tired' ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]' :
            roadmap.mood === 'motivated' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' :
            'bg-[#FAF8EE] text-[#4E5C56] border-[#E5E1D3]'
          }`}>
            {roadmap.mood === 'tired' ? 'Lighter Pace' : roadmap.mood === 'motivated' ? 'Aggressive Pace' : 'Standard Pace'}
          </span>
          <span className="ml-auto text-[10px] text-[#8E9E98]">{roadmap.generatedBy}</span>
        </div>
      </div>

      {/* Topics Timeline */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-[#141A17]">Learning Timeline</h2>
          <span className="text-xs text-[#6F7E77]">({topics.length} topics)</span>
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
                  ? 'border-[#D5E2D8] bg-[#F6FAF7]'
                  : isActive
                  ? 'border-[#0D684D] shadow-sm'
                  : 'border-[#E5E1D3]'
              }`}
            >
              {/* Topic Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full p-4 flex items-center gap-3 text-left cursor-pointer"
              >
                {/* Status icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  topicCompleted
                    ? 'bg-[#EFF5F0] border border-[#D5E2D8]'
                    : isActive
                    ? 'bg-[#0D382B] text-white'
                    : 'bg-[#FAF8EE] border border-[#E5E1D3]'
                }`}>
                  {topicCompleted
                    ? <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    : isActive
                    ? <Star className="w-4 h-4 text-[#34D399]" />
                    : <Circle className="w-4 h-4 text-[#8E9E98]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#141A17]">{topic.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0D382B] text-white">
                        ← Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#5E6D66]">
                    <span>{topic.estimatedDays} days</span>
                    <span>{tasksCompleted}/{topic.tasks.length} tasks</span>
                    <span className="text-[#0D684D] font-semibold">+{topic.xpReward} XP</span>
                  </div>
                </div>

                {/* Progress mini bar */}
                <div className="hidden sm:flex items-center gap-2 w-24">
                  <div className="flex-1 h-1.5 rounded-full bg-[#EAE6D8]">
                    <div
                      className="h-1.5 rounded-full bg-[#0D382B] transition-all duration-500"
                      style={{ width: `${topicProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6F7E77] w-7 text-right font-mono">{Math.round(topicProgress)}%</span>
                </div>

                {topic.expanded
                  ? <ChevronUp className="w-4 h-4 text-[#8E9E98] shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-[#8E9E98] shrink-0" />}
              </button>

              {/* Expanded Tasks */}
              {topic.expanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-[#EAE6D8] pt-3">
                  <p className="text-xs text-[#5E6D66] mb-3">{topic.description}</p>
                  {topic.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                        task.completed
                          ? 'bg-[#EFF5F0] border-[#D5E2D8] opacity-80'
                          : 'bg-[#FAF8EE] border-[#E5E1D3] hover:border-[#D0CABA]'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E1D3] flex items-center justify-center shrink-0">
                        {renderTaskIcon(task.type)}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${task.completed ? 'line-through text-[#8E9E98]' : 'text-[#141A17]'}`}>
                          {task.title}
                        </span>
                        <div className="text-[#8E9E98] text-[10px] mt-0.5">
                          {task.type} • ~{task.estimatedMinutes} min
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {task.type === 'solve' && (
                          <a
                            href={roadmap.track === 'sql' ? '/tracks/sql' : roadmap.track === 'system-design' ? '/tracks/system-design' : '/tracks/dsa'}
                            className="px-2.5 py-1 rounded-full bg-white border border-[#E0DCCF] text-[#0D684D] text-[10px] font-semibold hover:border-[#0D684D] transition-colors"
                          >
                            Visualizer ↗
                          </a>
                        )}
                        {!task.completed ? (
                          <>
                            <button
                              onClick={() => completeTask(topic.id, task.id)}
                              className="px-3 py-1 rounded-full bg-[#0D382B] text-white hover:bg-[#08261D] text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Done +{task.type === 'solve' ? 15 : 10} XP
                            </button>
                            <button
                              onClick={() => skipTask(topic.id, task.id)}
                              title="Penalty: -10 XP for missing task"
                              className="px-2.5 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-[10px] font-medium hover:bg-[#FFE4E6] transition-colors cursor-pointer"
                            >
                              Missed (-10 XP)
                            </button>
                          </>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
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
        <div className="glass-panel p-6 rounded-2xl border border-[#D5E2D8] text-center space-y-3 bg-[#EFF5F0]">
          <Trophy className="w-10 h-10 text-[#D97706] mx-auto" />
          <h2 className="text-xl font-bold text-[#141A17]">Roadmap Complete!</h2>
          <p className="text-sm text-[#5E6D66]">You&apos;ve finished all {topics.length} topics. Total XP earned: <strong className="text-[#0D382B]">{totalXP}</strong></p>
          <button onClick={resetRoadmap} className="px-6 py-2.5 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold cursor-pointer">
            Start a New Track
          </button>
        </div>
      )}
    </div>
  );
}
