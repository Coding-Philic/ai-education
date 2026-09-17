// =====================================================================
// API Route: POST /api/roadmap/generate
// AI-Powered Personalized Roadmap Generator
// Uses Groq AI to create mood-adaptive, goal-specific learning roadmaps
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;
const isGroqConfigured =
  groqApiKey && groqApiKey !== 'mock_or_user_key' && !groqApiKey.includes('your_groq_api_key');
const groqClient = isGroqConfigured ? new Groq({ apiKey: groqApiKey }) : null;

// Fallback deterministic roadmaps when no API key
function generateFallbackRoadmap(track: string, level: string, goal: string, hours: number, mood: string) {
  const dsaTopics = [
    { name: 'Arrays & Two Pointers', days: 3, xp: 150, tasks: [
      { title: 'Study Two Pointer technique', type: 'read', mins: 30 },
      { title: 'Solve Two Sum II', type: 'solve', mins: 45 },
      { title: 'Solve Container With Most Water', type: 'solve', mins: 40 },
    ]},
    { name: 'Binary Search', days: 2, xp: 120, tasks: [
      { title: 'Binary search template & variants', type: 'read', mins: 25 },
      { title: 'Solve Search in Rotated Sorted Array', type: 'solve', mins: 50 },
    ]},
    { name: 'Sliding Window', days: 2, xp: 130, tasks: [
      { title: 'Fixed vs Variable window pattern', type: 'read', mins: 20 },
      { title: 'Solve Longest Substring Without Repeating', type: 'solve', mins: 45 },
    ]},
    { name: 'Linked Lists', days: 3, xp: 140, tasks: [
      { title: 'Fast & Slow pointers', type: 'read', mins: 30 },
      { title: 'Detect cycle & find middle', type: 'solve', mins: 40 },
      { title: 'Reverse linked list', type: 'solve', mins: 35 },
    ]},
    { name: 'Trees & BFS/DFS', days: 4, xp: 200, tasks: [
      { title: 'Tree traversal patterns', type: 'read', mins: 40 },
      { title: 'Level order traversal', type: 'solve', mins: 45 },
      { title: 'Max depth & diameter', type: 'solve', mins: 40 },
    ]},
    { name: 'Dynamic Programming', days: 5, xp: 250, tasks: [
      { title: 'Memoization vs tabulation', type: 'read', mins: 45 },
      { title: 'Climbing Stairs & Coin Change', type: 'solve', mins: 60 },
      { title: 'Longest Common Subsequence', type: 'solve', mins: 60 },
    ]},
  ];

  const sqlTopics = [
    { name: 'SELECT & Filtering', days: 1, xp: 80, tasks: [
      { title: 'Basic SELECT, WHERE, ORDER BY', type: 'read', mins: 20 },
      { title: 'Filter students by grade', type: 'solve', mins: 30 },
    ]},
    { name: 'JOINs', days: 2, xp: 130, tasks: [
      { title: 'INNER, LEFT, RIGHT, FULL OUTER JOIN', type: 'read', mins: 35 },
      { title: 'Join students with enrollments', type: 'solve', mins: 45 },
    ]},
    { name: 'Aggregations', days: 2, xp: 120, tasks: [
      { title: 'GROUP BY, HAVING, COUNT, SUM, AVG', type: 'read', mins: 30 },
      { title: 'Find top courses by enrollment', type: 'solve', mins: 40 },
    ]},
    { name: 'Subqueries & CTEs', days: 2, xp: 150, tasks: [
      { title: 'Correlated subqueries & WITH clause', type: 'read', mins: 35 },
      { title: 'Find students above average score', type: 'solve', mins: 45 },
    ]},
    { name: 'Window Functions', days: 2, xp: 180, tasks: [
      { title: 'ROW_NUMBER, RANK, LAG, LEAD', type: 'read', mins: 40 },
      { title: 'Running totals & ranking', type: 'solve', mins: 50 },
    ]},
  ];

  const sysTopics = [
    { name: 'Load Balancing', days: 2, xp: 120, tasks: [
      { title: 'Round robin vs consistent hashing', type: 'read', mins: 30 },
      { title: 'Design a load balancer', type: 'solve', mins: 45 },
    ]},
    { name: 'Caching Strategies', days: 2, xp: 130, tasks: [
      { title: 'Cache-aside, write-through, eviction', type: 'read', mins: 35 },
      { title: 'Design Redis caching layer', type: 'solve', mins: 50 },
    ]},
    { name: 'Database Sharding', days: 2, xp: 150, tasks: [
      { title: 'Horizontal vs vertical sharding', type: 'read', mins: 30 },
      { title: 'Shard a social network DB', type: 'solve', mins: 55 },
    ]},
    { name: 'Message Queues', days: 2, xp: 140, tasks: [
      { title: 'Kafka, RabbitMQ, async patterns', type: 'read', mins: 35 },
      { title: 'Design notification system', type: 'solve', mins: 50 },
    ]},
    { name: 'Design: URL Shortener', days: 2, xp: 200, tasks: [
      { title: 'Full system design walkthrough', type: 'read', mins: 40 },
      { title: 'Build on CogniFlow canvas', type: 'solve', mins: 60 },
    ]},
  ];

  const topicsMap: Record<string, any[]> = { dsa: dsaTopics, sql: sqlTopics, 'system-design': sysTopics };
  const topics = (topicsMap[track] || dsaTopics).map((t, i) => ({
    id: i + 1,
    name: t.name,
    description: `Master ${t.name} concepts and apply them to real problems.`,
    estimatedDays: mood === 'tired' ? t.days + 1 : mood === 'motivated' ? Math.max(1, t.days - 1) : t.days,
    difficulty: i < 2 ? 'Beginner' : i < 4 ? 'Intermediate' : 'Advanced',
    xpReward: t.xp,
    tasks: t.tasks.map((tk, j) => ({ id: j + 1, title: tk.title, type: tk.type, estimatedMinutes: tk.mins })),
  }));

  const totalDays = topics.reduce((a, t) => a + t.estimatedDays, 0);

  return {
    track,
    level,
    goal,
    mood,
    dailyHours: hours,
    totalDays,
    projectedCompletion: new Date(Date.now() + totalDays * 86400000).toISOString().split('T')[0],
    topics,
    generatedBy: 'CogniFlow AI (Offline Mode)',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { track, level, goal, hours, existingTopics, mood, targetDate } = body;

    if (!track || !level || !goal) {
      return NextResponse.json({ success: false, error: 'Missing required fields: track, level, goal' }, { status: 400 });
    }

    if (!groqClient) {
      // Return rich deterministic roadmap
      const roadmap = generateFallbackRoadmap(track, level, goal, hours || 2, mood || 'neutral');
      return NextResponse.json({ success: true, data: roadmap });
    }

    const prompt = `
You are an expert CS educator and career coach for CogniFlow AI.
Generate a personalized learning roadmap in JSON.

User Profile:
- Track: ${track} (dsa | sql | system-design)
- Experience Level: ${level} (Beginner | Intermediate | Advanced)
- Primary Goal: ${goal}
- Hours per day: ${hours || 2}
- Topics already known: ${existingTopics || 'none'}
- Current mood/energy: ${mood || 'neutral'} (tired = slower pace, motivated = aggressive pace, neutral = standard)
- Target date: ${targetDate || 'flexible'}

Rules:
- Adjust topic count and daily task load to mood (tired = fewer tasks, motivated = more tasks)
- Topics must be ordered by dependency (easier first)
- Each topic must have 2-4 specific tasks
- Return ONLY valid JSON, no extra text:

{
  "track": "${track}",
  "level": "${level}",
  "goal": "${goal}",
  "mood": "${mood}",
  "dailyHours": ${hours || 2},
  "totalDays": <number>,
  "projectedCompletion": "YYYY-MM-DD",
  "topics": [
    {
      "id": 1,
      "name": "<topic name>",
      "description": "<1 sentence>",
      "estimatedDays": <number>,
      "difficulty": "Beginner|Intermediate|Advanced",
      "xpReward": <number 50-300>,
      "tasks": [
        { "id": 1, "title": "<specific task>", "type": "read|solve|practice|watch", "estimatedMinutes": <number> }
      ]
    }
  ],
  "generatedBy": "CogniFlow AI (Groq LPU)"
}
`.trim();

    const response = await groqClient.chat.completions.create({
      model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 800,
    });

    console.log(`⚡ [Groq LPU LIVE INFERENCE] Roadmap generated! Model: ${response.model}, Tokens: ${JSON.stringify(response.usage)}`);

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');

    const roadmap = JSON.parse(content);
    return NextResponse.json({ success: true, data: roadmap });
  } catch (error: any) {
    console.error('[Roadmap API] Error:', error);
    // Fallback to deterministic
    const body = await req.json().catch(() => ({}));
    const roadmap = generateFallbackRoadmap(
      body.track || 'dsa',
      body.level || 'Beginner',
      body.goal || 'General Learning',
      body.hours || 2,
      body.mood || 'neutral'
    );
    return NextResponse.json({ success: true, data: roadmap });
  }
}
