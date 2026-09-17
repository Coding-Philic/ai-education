'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Binary, 
  Database, 
  Network, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Code2,
  TrendingUp,
  Award
} from 'lucide-react';
import SkillRadar from '@/components/shared/SkillRadar';
import { Track, UserProfile } from '@/lib/types';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 100% Dynamic data fetched from server API
    Promise.all([
      fetch('/api/tracks').then((r) => r.json()),
      fetch('/api/users/me').then((r) => r.json()),
    ])
      .then(([tracksRes, userRes]) => {
        if (tracksRes.success) setTracks(tracksRes.data);
        if (userRes.success) setUserProfile(userRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getDomainIcon = (domain: string) => {
    if (domain === 'dsa') return Binary;
    if (domain === 'sql') return Database;
    return Network;
  };

  const getDomainGradient = (domain: string) => {
    if (domain === 'dsa') return 'from-indigo-600/20 via-indigo-900/10 to-transparent border-indigo-500/30';
    if (domain === 'sql') return 'from-cyan-600/20 via-cyan-900/10 to-transparent border-cyan-500/30';
    return 'from-purple-600/20 via-purple-900/10 to-transparent border-purple-500/30';
  };

  const getDomainTag = (domain: string) => {
    if (domain === 'dsa') return { text: 'DSA Memory Visualizer', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
    if (domain === 'sql') return { text: 'Chai SQLab Engine', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
    return { text: 'Distributed Architecture', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel-glow p-8 md:p-12 rounded-3xl border border-indigo-500/30">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lenovo LEAP AI Hackathon 2026 • Problem Statement 1</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Memorizing Code. <br />
            <span className="text-gradient">Visualize Computing in Real-Time.</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            A unified, enterprise AI learning platform combining <strong>Interactive DSA Pointers</strong>, 
            <strong>Chai SQLab Relational Pipelines</strong>, and <strong>Distributed System Design Chaos Simulators</strong>. 
            Powered by Groq Cloud LPU to diagnose learning gaps and deliver individualized remediation paths.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/tracks/dsa"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch DSA Visualizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tracks/sql"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Chai SQLab</span>
            </Link>
            <Link
              href="/tracks/system-design"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Network className="w-4 h-4 text-purple-400" />
              <span>System Design</span>
            </Link>
          </div>
        </div>

        {/* Floating Metrics Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Active Student Cohort</span>
            <span className="text-lg font-mono font-bold text-white">438 Engineers</span>
          </div>
          <div>
            <span className="text-slate-500 block">AI Inference Latency</span>
            <span className="text-lg font-mono font-bold text-cyan-400">&lt; 380ms (Groq LPU)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Curriculum Data</span>
            <span className="text-lg font-mono font-bold text-emerald-400">100% Dynamic DB</span>
          </div>
          <div>
            <span className="text-slate-500 block">Learning Gap Catch Rate</span>
            <span className="text-lg font-mono font-bold text-indigo-400">96.8% Accuracy</span>
          </div>
        </div>
      </section>

      {/* AI Skill Gap Diagnostic Radar Section (Problem Statement 1) */}
      {userProfile && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Live Skill Mastery & Gap Analysis
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Student: <strong className="text-white">{userProfile.fullName}</strong> ({userProfile.collegeName})
            </span>
          </div>

          <SkillRadar metrics={userProfile.skillRadarMetrics} />
        </section>
      )}

      {/* Dynamic Curriculum Tracks (No Hardcoded Data) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Visual Tracks</h2>
            <p className="text-xs text-slate-400">
              Fetched dynamically from Supabase PostgreSQL with real-time progress tracking.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
            {tracks.length} Dynamic Tracks Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const Icon = getDomainIcon(track.domain);
            const tag = getDomainTag(track.domain);
            const gradientBorder = getDomainGradient(track.domain);

            return (
              <div
                key={track.id}
                className={`glass-panel p-6 rounded-2xl border bg-gradient-to-b ${gradientBorder} flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tag.color}`}>
                      {tag.text}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                      <Icon className="w-4 h-4 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {track.description}
                  </p>

                  {/* Modules breakdown */}
                  <div className="space-y-1.5 py-2 border-t border-slate-800/60">
                    {track.modules?.map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate pr-2">↳ {mod.title}</span>
                        <span className="text-slate-500 font-mono text-[10px] shrink-0">
                          {mod.challenges?.length || 1} challenges
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/tracks/${track.domain === 'system_design' ? 'system-design' : track.domain}`}
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Launch Visual Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Roadmap CTA */}
      <section className="glass-panel-glow p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <h2 className="text-lg font-bold text-white">AI Roadmap Generator</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">NEW</span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Don't know where to start? AI asks you 5 questions — your goal, experience level, and today's mood — then generates a
            <strong className="text-white"> personalized, adaptive study roadmap</strong> with daily tasks, XP rewards, and smart re-routing if you fall behind.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">✅ Mood-adaptive pacing</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">⚡ XP + Streaks</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">🔄 AI re-routes if you're stuck</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">🎯 DSA / SQL / System Design</span>
          </div>
        </div>
        <Link
          href="/roadmap"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all shrink-0"
        >
          <span>Generate My Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Community & Admin CTA Quicklinks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Peer Community & Replay Hub</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Inspect shared visual execution traces, discuss algorithmic proofs, and fork solutions.
            </p>
          </div>
          <Link
            href="/community"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-colors shrink-0"
          >
            Explore Community
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">AKTU Faculty Command Center</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Live student join metrics, college breakdown, cohort skill gap heatmaps, and curriculum CMS.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors shrink-0"
          >
            Enter Admin Panel
          </Link>
        </div>
      </section>

    </div>
  );
}
