'use client';

import React, { useState, useEffect } from 'react';
import SqlLabVisualizer from '@/components/visualizers/SqlLabVisualizer';
import { Challenge } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function SqlTrackPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tracks/sql-track')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.modules) {
          const all: Challenge[] = data.data.modules.flatMap((m: any) => m.challenges || []);
          setChallenges(all);
          if (all.length > 0) {
            setActiveChallenge(all[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load SQL challenges:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span className="text-xs font-mono">Loading Dynamic Chai SQLab Engine...</span>
      </div>
    );
  }

  if (!activeChallenge) {
    return <div className="text-center py-20 text-slate-400 text-sm">No SQL challenges found.</div>;
  }

  return (
    <SqlLabVisualizer
      challenge={activeChallenge}
      allChallenges={challenges}
      onSelectChallenge={(ch) => setActiveChallenge(ch)}
    />
  );
}
