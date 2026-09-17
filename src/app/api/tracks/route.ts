// =====================================================================
// API Route: GET /api/tracks
// Dynamic Curriculum Track retrieval with middleware security
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';
import { checkRateLimit } from '@/middlewares/rateLimitMiddleware';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';

export async function GET(req: NextRequest) {
  const audit = startAudit(req);
  const rateLimit = checkRateLimit(req, 'tracks-get');
  if (!rateLimit.allowed) {
    finishAudit(audit, 429);
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const tracks = await DbService.getTracks();
    finishAudit(audit, 200);
    return NextResponse.json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    finishAudit(audit, 500);
    return NextResponse.json({ success: false, error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
