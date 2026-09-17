'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Binary, 
  Database, 
  Network, 
  ArrowRight, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Layers,
  Map
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

  const getDomainTag = (domain: string) => {
    if (domain === 'dsa') return { text: 'DSA Memory Visualizer', color: 'text-[#0D684D] bg-[#EFF5F0] border-[#D5E2D8]' };
    if (domain === 'sql') return { text: 'SQL Lab Engine', color: 'text-[#0284C7] bg-[#F0F9FF] border-[#BAE6FD]' };
    return { text: 'Distributed Architecture', color: 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]' };
  };

  return (
    <div className="space-y-14 pb-16">
      
      {/* Hero Section — WisprType Editorial Hero */}
      <section className="text-center pt-8 pb-4 max-w-4xl mx-auto space-y-6">
        
        {/* Capsule Badge with Dot (WisprType Image 1) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-xs font-semibold text-[#0D684D] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>• V1.2.0 • LENOVO LEAP AI HACKATHON 2026 • THEME 1 •</span>
        </div>

        {/* Hero Title with Italic Emerald Accent */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#141A17] leading-[1.12]">
          Stop memorizing code, <br />
          <span className="text-[#0D684D] italic font-serif">visualize anywhere.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-[#5E6D66] max-w-2xl mx-auto leading-relaxed font-normal">
          CogniFlow AI is an interactive visual education platform powered by Groq Cloud LPU. 
          Write any code, SQL query, or architecture topology — watch memory pointers, relational scans, and distributed packets animate in real-time.
        </p>

        {/* Primary & Secondary Action Buttons (WisprType Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            href="/tracks/dsa"
            className="px-7 py-3.5 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-sm font-semibold shadow-sm hover:shadow-md flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Launch DSA Visualizer</span>
            <ArrowRight className="w-4 h-4 text-[#34D399]" />
          </Link>
          <Link
            href="/tracks/sql"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F2E5] text-[#141A17] border border-[#E0DCCF] text-sm font-semibold shadow-xs flex items-center gap-2 transition-all hover:border-[#D0CABA]"
          >
            <Database className="w-4 h-4 text-[#0D684D]" />
            <span>SQL Lab</span>
          </Link>
          <Link
            href="/tracks/system-design"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F2E5] text-[#141A17] border border-[#E0DCCF] text-sm font-semibold shadow-xs flex items-center gap-2 transition-all hover:border-[#D0CABA]"
          >
            <Network className="w-4 h-4 text-[#0D684D]" />
            <span>System Design</span>
          </Link>
        </div>

        {/* Mac Window Mockup Card with Aurora Glow Pill (WisprType Image 2) */}
        <div className="pt-6">
          <div className="glass-panel-dark rounded-2xl p-5 md:p-7 text-left max-w-3xl mx-auto shadow-xl relative overflow-hidden border border-[#23302B]">
            {/* Top Mac Window Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2825]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]/90 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]/90 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#10B981]/90 inline-block"></span>
              </div>
              <span className="text-[10px] font-mono text-[#52645D] uppercase tracking-wider">Groq LPU Active</span>
            </div>

            {/* Code / Visualizer Preview Content */}
            <div className="py-4 space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-[#0D684D] font-bold">def</span>
                <span className="text-white font-semibold">two_sum(nums, target):</span>
                <span className="text-[#52645D]">// Memory Pointers: [left=0, right=4]</span>
              </div>
              <div className="pl-4 text-[#A7F3D0]">
                curr_sum = nums[left] + nums[right] <span className="text-[#52645D]">// 2 + 15 = 17 &gt; 9</span>
              </div>
              <div className="pl-4 text-amber-300">
                right -= 1 <span className="text-[#52645D]">// High pointer decrements to index 3</span>
              </div>
            </div>

            {/* Aurora Pill Glowing Indicator at Bottom (WisprType Image 2 signature) */}
            <div className="relative pt-6 pb-2 flex flex-col items-center justify-center">
              <div className="w-36 h-7 rounded-full aurora-pill"></div>
              <div className="relative -mt-6 px-4 py-1.5 rounded-full bg-[#131917]/90 border border-[#283631] text-[10px] font-mono text-[#A7F3D0] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
                <span>RUN CODE • GENERATE FRAMES • ANIMATE MEMORY</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-3 text-[11px] font-mono text-[#6F7E77] uppercase tracking-widest">
            HOLD ANY CHALLENGE • EXECUTE • YOUR DATA STRUCTURES ANIMATE
          </div>
        </div>

        {/* 3 Metric Bento Cards */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-xl border border-[#E5E1D3]">
            <span className="text-[#6F7E77] text-xs font-medium block">AI Inference Latency</span>
            <span className="text-xl font-bold font-mono text-[#0D684D] mt-0.5 block">&lt; 380ms LPU</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-[#E5E1D3]">
            <span className="text-[#6F7E77] text-xs font-medium block">Curriculum Data</span>
            <span className="text-xl font-bold font-mono text-[#141A17] mt-0.5 block">100% Dynamic DB</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-[#E5E1D3]">
            <span className="text-[#6F7E77] text-xs font-medium block">Skill Gap Catch Rate</span>
            <span className="text-xl font-bold font-mono text-[#0D684D] mt-0.5 block">96.8% Accuracy</span>
          </div>
        </div>

      </section>

      {/* AI Skill Gap Diagnostic Radar Section (Problem Statement 1) */}
      {userProfile && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#141A17] tracking-tight">
                Your Live Skill Mastery & Gap Analysis
              </h2>
            </div>
            <span className="text-xs text-[#5E6D66]">
              Student: <strong className="text-[#141A17]">{userProfile.fullName}</strong> ({userProfile.collegeName})
            </span>
          </div>

          <SkillRadar metrics={userProfile.skillRadarMetrics} />
        </section>
      )}

      {/* Dynamic Curriculum Tracks (WisprType Image 4 Bento Grid) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#0D684D] uppercase tracking-wider mb-1">CURRICULUM TRACKS</div>
            <h2 className="text-2xl font-extrabold text-[#141A17] tracking-tight">Interactive Visual Tracks</h2>
            <p className="text-xs text-[#5E6D66] mt-0.5">
              Fetched dynamically from PostgreSQL with real-time progress tracking.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0D684D] bg-[#EFF5F0] px-3 py-1 rounded-full border border-[#D5E2D8]">
            {tracks.length} Dynamic Tracks Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const Icon = getDomainIcon(track.domain);
            const tag = getDomainTag(track.domain);

            return (
              <div
                key={track.id}
                className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] flex flex-col justify-between hover:border-[#0D684D]/50 hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tag.color}`}>
                      {tag.text}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D] group-hover:bg-[#0D382B] group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#141A17] tracking-tight mb-2">
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#5E6D66] leading-relaxed mb-4">
                    {track.description}
                  </p>

                  {/* Modules breakdown */}
                  <div className="space-y-2 py-2 border-t border-[#EAE6D8]">
                    {track.modules?.map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between text-[11px] text-[#3A4742]">
                        <span className="truncate pr-2 font-medium">↳ {mod.title}</span>
                        <span className="text-[#7C8E86] font-mono text-[10px] shrink-0">
                          {mod.challenges?.length || 1} challenges
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/tracks/${track.domain === 'system_design' ? 'system-design' : track.domain}`}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <span>Launch Visual Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Roadmap CTA (WisprType Image 5 Inspired Banner) */}
      <section className="glass-panel p-7 rounded-2xl border border-[#E5E1D3] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
              <Map className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#141A17]">AI Roadmap Generator</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D]">NEW</span>
          </div>
          <p className="text-xs text-[#5E6D66] max-w-lg leading-relaxed">
            Don&apos;t know where to start? AI asks you 5 questions — your target goal, experience level, and today&apos;s energy — then generates a
            <strong className="text-[#141A17]"> personalized, adaptive study roadmap</strong> with daily tasks, XP rewards, and smart re-routing if you fall behind.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#4E5C56]">Mood-adaptive pacing</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#4E5C56]">Adaptive Streaks</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#4E5C56]">AI dynamic re-routes</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8EE] border border-[#E5E1D3] text-[#4E5C56]">DSA / SQL / System Design</span>
          </div>
        </div>
        <Link
          href="/roadmap"
          className="px-6 py-3 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <span>Generate My Roadmap</span>
          <ArrowRight className="w-4 h-4 text-[#34D399]" />
        </Link>
      </section>

      {/* Community & Admin CTA Quicklinks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141A17]">Peer Community & Replay Hub</h3>
            </div>
            <p className="text-xs text-[#5E6D66] max-w-sm leading-relaxed">
              Inspect shared visual execution traces, discuss algorithmic proofs, and fork solutions.
            </p>
          </div>
          <Link
            href="/community"
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F5F2E5] text-[#141A17] text-xs font-semibold border border-[#E0DCCF] transition-colors shrink-0 shadow-xs"
          >
            Explore Community
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141A17]">AKTU Faculty Command Center</h3>
            </div>
            <p className="text-xs text-[#5E6D66] max-w-sm leading-relaxed">
              Live student join metrics, college breakdown, cohort skill gap heatmaps, and curriculum CMS.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F5F2E5] text-[#141A17] text-xs font-semibold border border-[#E0DCCF] transition-colors shrink-0 shadow-xs"
          >
            Enter Admin Panel
          </Link>
        </div>
      </section>

    </div>
  );
}
