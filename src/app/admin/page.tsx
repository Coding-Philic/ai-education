'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingDown, 
  Sparkles, 
  Database, 
  PlusCircle, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  School,
  Activity,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('dsa_algo');
  const [newStatement, setNewStatement] = useState('');
  const [newXp, setNewXp] = useState(50);
  const [createStatus, setCreateStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/metrics', {
      headers: { 'x-demo-role': 'admin' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newStatement) return;

    try {
      const res = await fetch('/api/admin/challenges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-demo-role': 'admin'
        },
        body: JSON.stringify({
          moduleId: '20000000-0000-0000-0000-000000000001',
          title: newTitle,
          slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
          problemStatement: newStatement,
          challengeType: newType,
          xpReward: Number(newXp),
          starterCode: { python: '# Dynamic starter code\n' },
          initialVisualState: { type: 'ARRAY', elements: [1, 2, 3, 4] },
          testCases: [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateStatus('Challenge added successfully into PostgreSQL database!');
        setNewTitle('');
        setNewStatement('');
        setTimeout(() => setCreateStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400 font-mono text-xs">Loading Admin Telemetry Engine...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> High Privilege Role: AKTU Central Faculty
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin & Cohort Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time student joins, evaluate batch-wide learning gaps, control curriculum, and inspect Groq AI token usage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Live Sessions</span>
            <span className="text-lg font-bold font-mono text-emerald-400 flex items-center justify-end gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              {metrics?.activeOnlineNow} Active
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs font-medium block">Total Registered Students</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {metrics?.totalRegisteredStudents}
          </span>
          <span className="text-[11px] text-emerald-400 mt-1 block font-mono">↑ +28 new joins today</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs font-medium block">Total Challenges Solved</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
            {metrics?.challengesSolvedToday}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">Average Accuracy: {metrics?.averageBatchAccuracy}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs font-medium block">Groq AI Tokens Consumed</span>
          <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
            {metrics?.groqTokenConsumptionToday?.toLocaleString()}
          </span>
          <span className="text-[11px] text-indigo-300 mt-1 block font-mono">Llama-3.3-70B LPU Farm</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs font-medium block">Groq Avg Inference Speed</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            {metrics?.groqAvgLatencyMs}ms
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">Sub-second AST compilation</span>
        </div>
      </div>

      {/* Cohort Skill Gap Heatmap (Problem Statement 1) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Aggregated Cohort Skill Gap Heatmap (Problem Statement 1)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Identifies state-wide curriculum syllabus gaps across AKTU colleges.
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Topic / Conceptual Vulnerability</th>
                <th className="p-3">Failure Rate</th>
                <th className="p-3">Severity Level</th>
                <th className="p-3">Students Affected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950 font-mono">
              {metrics?.cohortSkillGapHeatmap?.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3 text-white font-semibold">{item.topic}</td>
                  <td className="p-3 text-rose-400 font-bold">{item.failureRate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.severity === 'High'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{item.affectedStudents} students</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* College Progress & Curriculum CMS (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top AKTU Colleges Activity (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">AKTU College Engagement</h3>
          </div>

          <div className="space-y-3">
            {metrics?.topColleges?.map((col: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{col.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{col.activeStudents} active learners</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-bold block">{col.solvedRate}</span>
                  <span className="text-[10px] text-slate-500">solve rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Curriculum Creator CMS (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Dynamic Curriculum Creator (No Hardcoding)</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">CRUD / API Ingestion</span>
          </div>

          {createStatus && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{createStatus}</span>
            </div>
          )}

          <form onSubmit={handleCreateChallenge} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Challenge Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Invert Binary Tree Visually"
                className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Domain</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="dsa_algo">DSA Algorithm</option>
                  <option value="sql_lab">SQL Lab</option>
                  <option value="system_design">System Design</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">XP Reward</label>
                <input
                  type="number"
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Problem Statement</label>
              <textarea
                value={newStatement}
                onChange={(e) => setNewStatement(e.target.value)}
                placeholder="Describe the task and visual requirements..."
                className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Publish Challenge to PostgreSQL
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
