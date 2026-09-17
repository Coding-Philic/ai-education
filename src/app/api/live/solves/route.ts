import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET(req: NextRequest) {
  const solves = await DbService.getLiveSolves();
  return NextResponse.json({
    success: true,
    data: solves,
  });
}
