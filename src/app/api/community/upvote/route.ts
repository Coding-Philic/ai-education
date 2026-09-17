import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.postId) {
      return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });
    }

    const newCount = await DbService.upvotePost(body.postId);
    return NextResponse.json({ success: true, upvotesCount: newCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to upvote' }, { status: 500 });
  }
}
