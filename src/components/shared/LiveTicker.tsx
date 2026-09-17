'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ArrowUpRight } from 'lucide-react';
import { LiveSolveEvent } from '@/lib/types';

export default function LiveTicker() {
  const [solves, setSolves] = useState<LiveSolveEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch initial live solves from dynamic server
    fetch('/api/live/solves')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSolves(data.data);
        }
      })
      .catch(() => {});

    // Periodic rotate ticker
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (solves.length > 0 ? (prev + 1) % solves.length : 0));
    }, 4500);

    return () => clearInterval(timer);
  }, [solves.length]);

  if (!solves.length) return null;

  const current = solves[currentIndex] || solves[0];

  return (
    <div className="w-full bg-indigo-950/40 border-b border-indigo-900/40 px-4 py-2 flex items-center justify-between text-xs backdrop-blur-sm">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 shrink-0">
            <Sparkles className="w-3 h-3 animate-spin" /> Live Pulse
          </span>

          <div className="flex items-center gap-2 text-slate-300 transition-all duration-500 ease-in-out">
            <span className="font-semibold text-white">{current.username}</span>
            <span className="text-slate-500">({current.collegeName})</span>
            <span className="text-slate-400">just solved</span>
            <span className="text-indigo-300 font-medium">{current.challengeTitle}</span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
              <Trophy className="w-2.5 h-2.5" /> +{current.xpEarned} XP
            </span>
            <span className="hidden md:inline text-slate-500 text-[10px]">[{current.executionTime}]</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
          <span>AKTU Hackathon Cohort: <strong className="text-emerald-400 font-mono">1,420 Solves Today</strong></span>
        </div>

      </div>
    </div>
  );
}
