import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middlewares/authMiddleware';
import { DbService } from '@/lib/db-service';
import { checkRateLimit } from '@/middlewares/rateLimitMiddleware';

export async function GET(req: NextRequest) {
  try {
    const posts = await DbService.getCommunityPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch community posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, 'community-post');
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { user } = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const post = await DbService.createCommunityPost({
      userId: user.id,
      username: user.username,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
      collegeName: user.collegeName,
      title: body.title,
      content: body.content,
      challengeId: body.challengeId,
      challengeTitle: body.challengeTitle,
      visualReplaySnapshot: body.visualReplaySnapshot,
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
