'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  PlusCircle
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
    <div className="space-y-6 pb-14 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-[#0D684D] bg-[#EFF5F0] px-3 py-0.5 rounded-full border border-[#D5E2D8]">
              Live Peer Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#141A17] tracking-tight">Peer Community & Solution Playbacks</h1>
          <p className="text-xs text-[#5E6D66] mt-1">
            Share visual execution traces, discuss algorithmic proofs, and learn collaboratively with students across Uttar Pradesh.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#34D399]" />
          <span>Share Visual Solution</span>
        </button>
      </div>

      {/* Create Post Card */}
      {showCreate && (
        <form onSubmit={handleCreatePost} className="glass-panel p-6 rounded-2xl border border-[#D5E2D8] space-y-3.5 shadow-xs">
          <h3 className="text-sm font-bold text-[#141A17] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D684D]" /> Share Insight or Visual Replay
          </h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title (e.g. How I eliminated full table scan using composite index)"
            className="w-full bg-[#FAF8EE] px-3.5 py-2.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D]"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain your approach, time complexity proof, or system design trade-offs..."
            className="w-full bg-[#FAF8EE] p-3.5 rounded-xl border border-[#E5E1D3] text-xs text-[#141A17] focus:outline-none focus:border-[#0D684D] h-24 resize-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-full text-xs text-[#6F7E77] hover:text-[#141A17]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#0D382B] hover:bg-[#08261D] text-white text-xs font-semibold shadow-xs"
            >
              Post to Community
            </button>
          </div>
        </form>
      )}

      {/* Feed */}
      {loading ? (
        <div className="text-center py-20 text-xs text-[#6F7E77] font-mono">Loading Community Activity...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-6 rounded-2xl border border-[#E5E1D3] space-y-3 hover:border-[#D0CABA] transition-all shadow-xs">
              
              {/* Author bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8EE] overflow-hidden border border-[#E5E1D3]">
                    <img src={post.avatarUrl} alt={post.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#141A17]">{post.username}</span>
                      <span className="text-[10px] text-[#6F7E77] font-mono">• {post.collegeName}</span>
                    </div>
                    <span className="text-[10px] text-[#8E9E98] block">{post.createdAt}</span>
                  </div>
                </div>

                {post.challengeTitle && (
                  <span className="text-[10px] font-mono text-[#0D684D] bg-[#EFF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E2D8] hidden sm:inline-block font-semibold">
                    Challenge: {post.challengeTitle}
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div>
                <h2 className="text-base font-bold text-[#141A17] tracking-tight">{post.title}</h2>
                <p className="text-xs text-[#5E6D66] mt-1.5 leading-relaxed">{post.content}</p>
              </div>

              {/* Visual Snapshot Metadata Card */}
              {post.visualReplaySnapshot && (
                <div className="p-3.5 rounded-xl bg-[#FAF8EE] border border-[#E5E1D3] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0D684D] font-mono text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Visual Trace Snapshot Attached</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6F7E77]">
                    {post.visualReplaySnapshot.optimalTime ? `Time: ${post.visualReplaySnapshot.optimalTime} | Space: ${post.visualReplaySnapshot.space}` : 'Interactive Replay'}
                  </span>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="pt-2 border-t border-[#EAE6D8] flex items-center gap-4 text-xs">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1.5 text-[#5E6D66] hover:text-[#0D684D] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold text-[#141A17]">{post.upvotesCount}</span>
                  <span>Upvotes</span>
                </button>

                <div className="flex items-center gap-1.5 text-[#5E6D66]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.commentsCount || 0}</span>
                  <span>Comments</span>
                </div>

                <div className="flex items-center gap-1 text-[#8E9E98] text-[11px] ml-auto">
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
