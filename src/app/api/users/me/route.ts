import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middlewares/authMiddleware';
import { DbService } from '@/lib/db-service';

export async function GET(req: NextRequest) {
  const { user } = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await DbService.getUserProfile(user.id);
  return NextResponse.json({
    success: true,
    data: profile,
  });
}
