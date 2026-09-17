'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  PlusCircle, 
  Send,
  Code2,
  Database,
  Network
} from 'lucide-react';
import { CommunityPost } from '@/lib/types';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/community')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPosts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpvote = async (postId: string) => {
    try {
      const res = await fetch('/api/community/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, upvotesCount: data.upvotesCount } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          challengeTitle: 'Community Visual Insight',
          visualReplaySnapshot: { shared: true, timestamp: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.data, ...posts]);
        setTitle('');
        setContent('');
        setShowCreate(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Live Peer Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Peer Community & Solution Playbacks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Share visual execution traces, discuss algorithmic proofs, and learn collaboratively with students across Uttar Pradesh.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Visual Solution</span>
        </button>
      </div>

      {/* Create Post Card */}
      {showCreate && (
        <form onSubmit={handleCreatePost} className="glass-panel p-5 rounded-2xl border border-indigo-500/40 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Share Insight or Visual Replay
          </h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title (e.g. How I eliminated full table scan using composite index)"
            className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain your approach, time complexity proof, or system design trade-offs..."
            className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Post to Community
            </button>
          </div>
        </form>
      )}

      {/* Feed */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400 font-mono">Loading Community Activity...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              
              {/* Author bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    <img src={post.avatarUrl} alt={post.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{post.username}</span>
                      <span className="text-[10px] text-slate-500 font-mono">• {post.collegeName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{post.createdAt}</span>
                  </div>
                </div>

                {post.challengeTitle && (
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/60 hidden sm:inline-block">
                    Challenge: {post.challengeTitle}
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">{post.title}</h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{post.content}</p>
              </div>

              {/* Visual Snapshot Metadata Card */}
              {post.visualReplaySnapshot && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Visual Trace Snapshot Attached</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {post.visualReplaySnapshot.optimalTime ? `Time: ${post.visualReplaySnapshot.optimalTime} | Space: ${post.visualReplaySnapshot.space}` : 'Interactive Replay'}
                  </span>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-4 text-xs">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold text-white">{post.upvotesCount}</span>
                  <span>Upvotes</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.commentsCount || 0}</span>
                  <span>Comments</span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 text-[11px] ml-auto">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
