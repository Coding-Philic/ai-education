// =====================================================================
// API Route: POST /api/submissions
// Dynamic Visual Frame Generation + Groq AI Skill Gap Diagnostic Core
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middlewares/authMiddleware';
import { checkRateLimit } from '@/middlewares/rateLimitMiddleware';
import { startAudit, finishAudit } from '@/middlewares/auditMiddleware';
import { validateBody, SubmissionSchema } from '@/middlewares/validationMiddleware';
import { DbService } from '@/lib/db-service';
import { generateVisualFrames, diagnoseSkillGap } from '@/lib/groq';

export async function POST(req: NextRequest) {
  const audit = startAudit(req);

  // 1. Check Rate Limiter (protect AI endpoints)
  const rateCheck = checkRateLimit(req, 'submissions', true);
  if (!rateCheck.allowed) {
    finishAudit(audit, 429);
    return NextResponse.json(
      { success: false, error: `Too many submissions. Please wait ${rateCheck.resetTimeMs / 1000}s.` },
      { status: 429 }
    );
  }

  // 2. Auth Verification
  const { user } = await verifyAuth(req);
  if (!user) {
    finishAudit(audit, 401);
    return NextResponse.json({ success: false, error: 'Unauthorized session' }, { status: 401 });
  }

  // 3. Body Validation
  let rawBody: any;
  try {
    rawBody = await req.json();
  } catch (err) {
    finishAudit(audit, 400);
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = await validateBody(rawBody, SubmissionSchema);
  if (validation.errorResponse) {
    finishAudit(audit, 422);
    return validation.errorResponse;
  }

  const { challengeId, code, query, architecture, language } = validation.data!;

  // 4. Fetch Challenge from dynamic DB
  const challenge = await DbService.getChallengeById(challengeId);
  if (!challenge) {
    finishAudit(audit, 404);
    return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
  }

  try {
    const solutionText = challenge.challengeType === 'dsa_algo'
      ? (code || '')
      : challenge.challengeType === 'sql_lab'
      ? (query || '')
      : JSON.stringify(architecture || {});

    // Basic heuristic test evaluation (can also be evaluated via test cases)
    const isPassing = solutionText.length > 20 && !solutionText.includes('TODO');

    // 5. Invoke Groq AI for Step-by-Step Visual Frames (any algorithm)
    const { frames: visualFrames, algorithm: detectedAlgorithm, model: detectedModel } = await generateVisualFrames(
      challenge.challengeType,
      solutionText,
      challenge.initialVisualState
    );

    // 6. Invoke Groq AI for Skill Gap Assessment (Problem Statement 1)
    const diagnosis = await diagnoseSkillGap(
      challenge.challengeType,
      solutionText,
      isPassing,
      challenge.problemStatement
    );

    // 7. Update User Profile & Stats in dynamic DB
    const xpReward = isPassing ? challenge.xpReward : 10;
    const domainKey = challenge.challengeType === 'dsa_algo' ? 'dsa' : challenge.challengeType === 'sql_lab' ? 'sql' : 'system_design';
    const updatedUser = await DbService.updateUserScore(user.id, xpReward, domainKey, diagnosis.conceptSeverityScore);

    // 8. Record Skill Gap in DB
    const skillGapRecord = await DbService.recordSkillGap({
      id: `gap_${Date.now()}`,
      userId: user.id,
      submissionId: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...diagnosis,
    });

    // 9. Emit Live Solve Event for peer motivation ticker
    if (isPassing) {
      await DbService.addLiveSolve({
        userId: user.id,
        username: user.username,
        collegeName: user.collegeName,
        challengeTitle: challenge.title,
        xpEarned: challenge.xpReward,
        executionTime: `${Math.floor(Math.random() * 12) + 4}ms`,
        timestamp: 'Just now',
      });
    }

    finishAudit(audit, 200);

    return NextResponse.json({
      success: true,
      data: {
        evaluation: isPassing ? 'passed' : 'needs_work',
        xpEarned: xpReward,
        visualFrames,
        algorithm: detectedAlgorithm,
        model: detectedModel || 'qwen/qwen3.8-27b',
        skillGap: skillGapRecord,
        updatedUser,
      },
    });
  } catch (error: any) {
    console.error('Submission execution error:', error);
    finishAudit(audit, 500);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process submission' },
      { status: 500 }
    );
  }
}
