// =====================================================================
// CogniFlow AI: Token-Bucket Rate Limiter Middleware
// Protects Groq AI inference and database resources from abuse
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

// In-memory sliding token bucket cache
const rateLimitMap = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  capacity: number;      // Max tokens allowed
  refillRate: number;    // Tokens added per millisecond
  costPerRequest: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  capacity: 30,
  refillRate: 30 / (60 * 1000), // 30 tokens per minute
  costPerRequest: 1,
};

const AI_DIAGNOSTIC_CONFIG: RateLimitConfig = {
  capacity: 10,
  refillRate: 10 / (60 * 1000), // 10 AI runs per minute
  costPerRequest: 1,
};

export function checkRateLimit(
  req: NextRequest,
  keyPrefix: string = 'global',
  isAiEndpoint: boolean = false
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const key = `${keyPrefix}:${ip}`;
  const config = isAiEndpoint ? AI_DIAGNOSTIC_CONFIG : DEFAULT_CONFIG;
  const now = Date.now();

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { tokens: config.capacity, lastRefill: now };
    rateLimitMap.set(key, record);
  } else {
    // Refill tokens based on elapsed time
    const elapsed = now - record.lastRefill;
    const tokensToAdd = elapsed * config.refillRate;
    record.tokens = Math.min(config.capacity, record.tokens + tokensToAdd);
    record.lastRefill = now;
  }

  if (record.tokens >= config.costPerRequest) {
    record.tokens -= config.costPerRequest;
    return {
      allowed: true,
      remaining: Math.floor(record.tokens),
      resetTimeMs: Math.ceil((config.capacity - record.tokens) / config.refillRate),
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetTimeMs: Math.ceil((config.costPerRequest - record.tokens) / config.refillRate),
  };
}
