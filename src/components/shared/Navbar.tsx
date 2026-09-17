'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Binary, 
  Database, 
  Network, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Map,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check saved role or default
    const saved = localStorage.getItem('cogniflow_role');
    if (saved === 'admin' || saved === 'student') {
      setUserRole(saved);
    }

    // Close menu on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Close menu on Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
    <header className="sticky top-0 z-50 bg-[#FAF8EE]/90 backdrop-blur-md border-b border-[#E5E1D3] transition-all" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Hackathon Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsMenuOpen(false)}>
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

        {/* Minimal Right Controls: Mode Switcher & Hamburger Button */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher Pill */}
          <button
            onClick={toggleRole}
            title="Click to toggle Student / Admin role"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0D382B] hover:bg-[#08261D] text-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>{userRole === 'admin' ? 'Admin Mode' : 'Student Mode'}</span>
          </button>

          {/* Clean Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            className="w-9 h-9 rounded-full bg-[#F4F0E3] hover:bg-[#ECE6D5] border border-[#E5E1D3] flex items-center justify-center text-[#141A17] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isMenuOpen ? (
              <X className="w-4 h-4 text-[#0D382B]" />
            ) : (
              <Menu className="w-4 h-4 text-[#0D382B]" />
            )}
          </button>
        </div>

      </div>

      {/* Hamburger Menu Overlay / Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 sm:right-6 lg:right-8 w-72 sm:w-80 bg-[#FAF8EE] border border-[#E5E1D3] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#7C8E86] px-3 py-1.5 font-semibold flex items-center justify-between">
            <span>Navigation</span>
            <span className="text-[10px] text-[#0D684D] bg-[#EFF5F0] px-2 py-0.5 rounded-full border border-[#D5E2D8]">
              {userRole === 'admin' ? 'Admin' : 'Student'}
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0D382B] text-white font-semibold shadow-xs'
                      : 'text-[#3A4742] hover:text-[#141A17] hover:bg-[#F4F0E3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#6B7A74]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-[#A7F3D0]'
                        : item.badge === 'AI'
                        ? 'bg-[#EFF5F0] text-[#0D684D] border border-[#D5E2D8]'
                        : 'bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#E5E1D3] flex items-center justify-between px-2 text-[11px] text-[#7C8E86]">
            <span>Active: {userRole === 'student' ? 'Student Mode' : 'Admin Mode'}</span>
            <button
              onClick={() => {
                toggleRole();
                setIsMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#0D684D] hover:underline cursor-pointer"
            >
              Switch to {userRole === 'student' ? 'Admin' : 'Student'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
