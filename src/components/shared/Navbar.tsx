'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Binary, 
  Database, 
  Network, 
  Users, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Sparkles,
  Radio,
  Map
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [onlineCount, setOnlineCount] = useState(142);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [xp, setXp] = useState(1850);
  const [streak, setStreak] = useState(14);

  useEffect(() => {
    // Check saved role or default
    const saved = localStorage.getItem('cogniflow_role');
    if (saved === 'admin' || saved === 'student') {
      setUserRole(saved);
    }

    // Sync XP from localStorage (set by roadmap engine)
    const savedXP = localStorage.getItem('cogniflow_xp');
    if (savedXP) setXp(parseInt(savedXP));
    const savedStreak = localStorage.getItem('cogniflow_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));

    // Dynamic presence variation for realism
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const toggleRole = () => {
    const newRole = userRole === 'student' ? 'admin' : 'student';
    setUserRole(newRole);
    localStorage.setItem('cogniflow_role', newRole);
    window.location.reload();
  };

  const navItems = [
    { label: 'DSA Visualizer', href: '/tracks/dsa', icon: Binary },
    { label: 'SQL Lab', href: '/tracks/sql', icon: Database },
    { label: 'System Design', href: '/tracks/system-design', icon: Network },
    { label: 'My Roadmap', href: '/roadmap', icon: Map, badge: 'AI' },
    { label: 'Community', href: '/community', icon: Users },
    { label: 'Admin', href: '/admin', icon: ShieldCheck, badge: 'Faculty' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Hackathon Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                CogniFlow <span className="text-cyan-400 font-mono text-sm">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                Lenovo LEAP AI Hackathon &apos;26
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Real-time Presence, XP, and Role Toggle */}
        <div className="flex items-center gap-3">
          {/* Live Online Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>{onlineCount} live</span>
          </div>

          {/* XP & Streak Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{xp} XP</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-rose-400 font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>{streak}d</span>
            </div>
          </div>

          {/* Fast Role Switcher for Hackathon Jury Evaluation */}
          <button
            onClick={toggleRole}
            title="Click to toggle Student / Admin role"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>{userRole === 'admin' ? '🛡️ Admin Mode' : '🎓 Student Mode'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
