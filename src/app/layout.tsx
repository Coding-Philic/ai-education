import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import LiveTicker from '@/components/shared/LiveTicker';

export const metadata: Metadata = {
  title: 'CogniFlow AI | Unified Visual CS Education & Diagnostic Engine',
  description: 'Enterprise AI-powered real-time interactive visual education platform for Data Structures, SQL, and Distributed System Design with automated skill gap detection. Built for Lenovo LEAP AI Hackathon 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased flex flex-col font-sans">
        <Navbar />
        <LiveTicker />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CogniFlow AI © 2026 • Powered by Groq Cloud & Supabase</span>
            <span>Lenovo LEAP AI Hackathon — Theme 1: AI in Education & Skilling</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
