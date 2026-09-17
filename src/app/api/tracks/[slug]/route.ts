import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';
import { checkRateLimit } from '@/middlewares/rateLimitMiddleware';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const audit = startAudit(req);
  const rateLimit = checkRateLimit(req, `track-${params.slug}`);
  if (!rateLimit.allowed) {
    finishAudit(audit, 429);
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const track = await DbService.getTrackBySlug(params.slug);
    if (!track) {
      finishAudit(audit, 404);
      return NextResponse.json({ success: false, error: 'Track not found' }, { status: 404 });
    }

    finishAudit(audit, 200);
    return NextResponse.json({ success: true, data: track });
  } catch (error) {
    finishAudit(audit, 500);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
