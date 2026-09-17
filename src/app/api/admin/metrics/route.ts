import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middlewares/authMiddleware';
import { enforceRole } from '@/middlewares/rbacMiddleware';
import { DbService } from '@/lib/db-service';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';

export async function GET(req: NextRequest) {
  const audit = startAudit(req);
  const { user } = await verifyAuth(req);

  // Enforce admin role check
  const roleCheck = enforceRole(user, ['admin']);
  if (roleCheck) {
    finishAudit(audit, 403);
    return roleCheck;
  }

  try {
    const metrics = await DbService.getAdminMetrics();
    finishAudit(audit, 200);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    finishAudit(audit, 500);
    return NextResponse.json({ success: false, error: 'Failed to load metrics' }, { status: 500 });
  }
}
