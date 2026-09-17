// =====================================================================
// CogniFlow AI: Telemetry & Audit Middleware
// Attaches unique trace identifiers, measures latency, and logs requests
// =====================================================================

import { NextRequest } from 'next/server';

export interface AuditContext {
  traceId: string;
  startTime: number;
  method: string;
  url: string;
}

export function startAudit(req: NextRequest): AuditContext {
  const traceId = req.headers.get('x-trace-id') || `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    traceId,
    startTime: Date.now(),
    method: req.method,
    url: req.nextUrl.pathname,
  };
}

export function finishAudit(ctx: AuditContext, statusCode: number) {
  const durationMs = Date.now() - ctx.startTime;
  // High-performance asynchronous log
  if (process.env.NODE_ENV !== 'production' || statusCode >= 400 || durationMs > 500) {
    console.log(`[AUDIT] [${ctx.traceId}] ${ctx.method} ${ctx.url} -> ${statusCode} (${durationMs}ms)`);
  }
  return { traceId: ctx.traceId, durationMs };
}
