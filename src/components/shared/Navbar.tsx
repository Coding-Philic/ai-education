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
    <header className="sticky top-0 z-50 bg-[#FAF8EE]/90 backdrop-blur-md border-b border-[#E5E1D3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Hackathon Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#0D382B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#08261D] transition-all">
              <Sparkles className="w-4 h-4 text-[#34D399] group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#141A17] flex items-center gap-1.5">
                CogniFlow <span className="text-[#0D684D] italic font-serif">AI</span>
              </span>
              <span className="text-[10px] text-[#5E6D66] font-medium tracking-wide">
                Lenovo LEAP AI Hackathon &apos;26
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Pill Navbar like WisprType */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#F4F0E3]/70 p-1 rounded-full border border-[#E5E1D3]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#0D382B] font-semibold shadow-xs border border-[#D5E2D8]'
                    : 'text-[#4E5C56] hover:text-[#141A17] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0D684D]' : 'text-[#6B7A74]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                    item.badge === 'AI' 
                      ? 'bg-[#EFF5F0] text-[#0D684D] border border-[#D5E2D8]'
                      : 'bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Real-time Presence, XP, and Role Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Live Online Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D] text-xs font-mono">
            <Radio className="w-3 h-3 animate-pulse text-[#059669]" />
            <span className="font-semibold">{onlineCount} live</span>
          </div>

          {/* XP & Streak Pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E1D3] text-xs text-[#141A17] font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]/20" />
              <span>{xp} XP</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E1D3] text-xs text-[#141A17] font-semibold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48]/20" />
              <span>{streak}d</span>
            </div>
          </div>

          {/* Fast Role Switcher (WisprType Pill Button) */}
          <button
            onClick={toggleRole}
            title="Click to toggle Student / Admin role"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0D382B] hover:bg-[#08261D] text-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>{userRole === 'admin' ? '🛡️ Admin Mode' : '🎓 Student Mode'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
