import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackSlug = searchParams.get('track');

  try {
    if (trackSlug) {
      const challenges = await DbService.getChallengesByTrackSlug(trackSlug);
      return NextResponse.json({ success: true, data: challenges });
    }
    const challenges = await DbService.getAllChallenges();
    return NextResponse.json({ success: true, data: challenges });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
