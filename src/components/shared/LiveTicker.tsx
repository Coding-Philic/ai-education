'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
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
    <div className="w-full bg-[#F4F0E3]/80 border-b border-[#E5E1D3] px-4 py-2 flex items-center justify-between text-xs backdrop-blur-sm transition-all">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0D684D] uppercase tracking-wider bg-[#EFF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E2D8] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            Live Pulse
          </span>

          <div className="flex items-center gap-2 text-[#4E5C56] transition-all duration-500 ease-in-out text-xs">
            <span className="font-semibold text-[#141A17]">{current.username}</span>
            <span className="text-[#6B7A74]">({current.collegeName})</span>
            <span className="text-[#6B7A74]">just solved</span>
            <span className="text-[#0D684D] font-medium">{current.challengeTitle}</span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              <Trophy className="w-2.5 h-2.5 text-[#D97706]" /> +{current.xpEarned} XP
            </span>
            <span className="hidden md:inline text-[#8E9E98] text-[10px] font-mono">[{current.executionTime}]</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#5E6D66] shrink-0">
          <span>AKTU Hackathon Cohort: <strong className="text-[#0D684D] font-mono font-bold">1,420 Solves Today</strong></span>
        </div>

      </div>
    </div>
  );
}
