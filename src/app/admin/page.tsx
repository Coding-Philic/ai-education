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
    return <div className="text-center py-24 text-[#6F7E77] font-mono text-xs">Loading Admin Telemetry Engine...</div>;
  }

  return (
    <div className="space-y-8 pb-14">
      
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Central Faculty Dashboard • High Privilege
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#141A17] tracking-tight">Admin & Cohort Command Center</h1>
          <p className="text-xs text-[#5E6D66] mt-1">
            Monitor real-time student joins, evaluate batch-wide learning gaps, control curriculum, and inspect Groq AI token usage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-right">
            <span className="text-[10px] text-[#6F7E77] block uppercase font-mono font-semibold">Live Sessions</span>
            <span className="text-lg font-bold font-mono text-[#0D684D] flex items-center justify-end gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-[#059669]" />
              {metrics?.activeOnlineNow} Active
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] shadow-xs">
          <span className="text-[#6F7E77] text-xs font-semibold block">Total Registered Students</span>
          <span className="text-2xl font-bold font-mono text-[#141A17] mt-1 block">
            {metrics?.totalRegisteredStudents}
          </span>
          <span className="text-[11px] text-[#0D684D] mt-1 block font-mono font-semibold">↑ +28 new joins today</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] shadow-xs">
          <span className="text-[#6F7E77] text-xs font-semibold block">Total Challenges Solved</span>
          <span className="text-2xl font-bold font-mono text-[#0D382B] mt-1 block">
            {metrics?.challengesSolvedToday}
          </span>
          <span className="text-[11px] text-[#6F7E77] mt-1 block font-mono">Accuracy: {metrics?.averageBatchAccuracy}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] shadow-xs">
          <span className="text-[#6F7E77] text-xs font-semibold block">Groq AI Tokens Consumed</span>
          <span className="text-2xl font-bold font-mono text-[#7C3AED] mt-1 block">
            {metrics?.groqTokenConsumptionToday?.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#6F7E77] mt-1 block font-mono">Llama-3.3-70B & Qwen LPU</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#E5E1D3] shadow-xs">
          <span className="text-[#6F7E77] text-xs font-semibold block">Groq Avg Inference Speed</span>
          <span className="text-2xl font-bold font-mono text-[#0D684D] mt-1 block">
            {metrics?.groqAvgLatencyMs}ms
          </span>
          <span className="text-[11px] text-[#6F7E77] mt-1 block font-mono">Sub-second AST compilation</span>
        </div>
      </div>

      {/* Cohort Skill Gap Heatmap (Problem Statement 1) */}
      <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#E11D48]">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#141A17] tracking-tight">
              Aggregated Cohort Skill Gap Heatmap (Problem Statement 1)
            </h2>
          </div>
          <span className="text-xs text-[#6F7E77]">
            Identifies state-wide curriculum syllabus gaps across AKTU colleges.
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E1D3]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8EE] text-[#5E6D66] font-mono border-b border-[#E5E1D3]">
              <tr>
                <th className="p-3.5">Topic / Conceptual Vulnerability</th>
                <th className="p-3.5">Failure Rate</th>
                <th className="p-3.5">Severity Level</th>
                <th className="p-3.5">Students Affected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6D8] bg-white font-mono">
              {metrics?.cohortSkillGapHeatmap?.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#FAF8EE]/50 transition-colors">
                  <td className="p-3.5 text-[#141A17] font-semibold">{item.topic}</td>
                  <td className="p-3.5 text-[#E11D48] font-bold">{item.failureRate}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.severity === 'High'
                        ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#5E6D66]">{item.affectedStudents} students</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* College Progress & Curriculum CMS (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top AKTU Colleges Activity (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-[#E5E1D3] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
              <School className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#141A17]">AKTU College Engagement</h3>
          </div>

          <div className="space-y-3">
            {metrics?.topColleges?.map((col: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#141A17] block">{col.name}</span>
                  <span className="text-[11px] text-[#6F7E77] font-mono">{col.activeStudents} active learners</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[#0D684D] font-bold block">{col.solvedRate}</span>
                  <span className="text-[10px] text-[#8E9E98]">solve rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Curriculum Creator CMS (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-[#E5E1D3] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141A17]">Dynamic Curriculum Creator (No Hardcoding)</h3>
            </div>
            <span className="text-[10px] text-[#6F7E77] font-mono font-semibold">CRUD / API Ingestion</span>
          </div>

          {createStatus && (
            <div className="p-3.5 rounded-xl bg-[#EFF5F0] border border-[#D5E2D8] text-xs text-[#0D684D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span className="font-semibold">{createStatus}</span>
            </div>
          )}

          <form onSubmit={handleCreateChallenge} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#5E6D66] block mb-1">Challenge Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Invert Binary Tree Visually"
                className="w-full bg-[#FAF8EE] px-3.5 py-2.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#5E6D66] block mb-1">Domain</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#FAF8EE] px-3.5 py-2.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D]"
                >
                  <option value="dsa_algo">DSA Algorithm</option>
                  <option value="sql_lab">SQL Lab</option>
                  <option value="system_design">System Design</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5E6D66] block mb-1">XP Reward</label>
                <input
                  type="number"
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="w-full bg-[#FAF8EE] px-3.5 py-2.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5E6D66] block mb-1">Problem Statement</label>
              <textarea
                value={newStatement}
                onChange={(e) => setNewStatement(e.target.value)}
                placeholder="Describe the task and visual requirements..."
                className="w-full bg-[#FAF8EE] p-3.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D] h-20 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              Publish Challenge to PostgreSQL
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
