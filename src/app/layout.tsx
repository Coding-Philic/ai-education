import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/shared/Navbar';

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
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8EE] text-[#141A17] antialiased flex flex-col font-sans selection:bg-[#0D382B] selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-[#E5E1D3] bg-[#F4F0E3] py-8 text-center text-xs text-[#5E6D66]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span className="font-semibold text-[#141A17]">CogniFlow AI © 2026</span>
              <span>• Powered by Groq Cloud & Supabase</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-[#EFF5F0] border border-[#D5E2D8] text-[#0D684D] font-medium text-[11px]">
                Lenovo LEAP AI Hackathon &apos;26 • Theme 1
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
