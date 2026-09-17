import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';
import { checkRateLimit } from '@/middlewares/rateLimitMiddleware';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const audit = startAudit(req);
  const rateLimit = checkRateLimit(req, `challenge-${params.id}`);
  if (!rateLimit.allowed) {
    finishAudit(audit, 429);
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const challenge = await DbService.getChallengeById(params.id);
    if (!challenge) {
      finishAudit(audit, 404);
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }

    finishAudit(audit, 200);
    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    finishAudit(audit, 500);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
