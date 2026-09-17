import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middlewares/authMiddleware';
import { enforceRole } from '@/middlewares/rbacMiddleware';
import { DbService } from '@/lib/db-service';
import { validateBody, ChallengeCreateSchema } from '@/middlewares/validationMiddleware';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';

export async function POST(req: NextRequest) {
  const audit = startAudit(req);
  const { user } = await verifyAuth(req);

  const roleCheck = enforceRole(user, ['admin']);
  if (roleCheck) {
    finishAudit(audit, 403);
    return roleCheck;
  }

  let rawBody: any;
  try {
    rawBody = await req.json();
  } catch (err) {
    finishAudit(audit, 400);
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = await validateBody(rawBody, ChallengeCreateSchema);
  if (validation.errorResponse) {
    finishAudit(audit, 422);
    return validation.errorResponse;
  }

  try {
    const d = validation.data as any;
    const newChallenge = await DbService.createChallenge({
      moduleId: d.moduleId,
      title: d.title,
      slug: d.slug,
      problemStatement: d.problemStatement,
      challengeType: d.challengeType,
      starterCode: d.starterCode || {},
      initialVisualState: d.initialVisualState || {},
      testCases: d.testCases || [],
      benchmarkSolution: d.benchmarkSolution || {},
      xpReward: d.xpReward || 50,
      orderIndex: 99,
    });
    finishAudit(audit, 201);
    return NextResponse.json({ success: true, data: newChallenge }, { status: 201 });
  } catch (error) {
    finishAudit(audit, 500);
    return NextResponse.json({ success: false, error: 'Failed to create challenge' }, { status: 500 });
  }
}
