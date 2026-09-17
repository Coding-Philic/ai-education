import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';
import { generateRemediationAndSolution } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, challengeTitle, language = 'python' } = body;
    const submittedCode = body.code || body.query || body.submittedCode || (body.architecture ? JSON.stringify(body.architecture) : undefined);

    if (!submittedCode) {
      return NextResponse.json(
        { success: false, error: 'code, query, or submittedCode is required' },
        { status: 400 }
      );
    }

    const challenge = challengeId ? await DbService.getChallengeById(challengeId) : null;
    const title = challenge?.title || challengeTitle || 'Challenge';
    const problemStatement = challenge?.problemStatement || body.problemStatement || '';
    const benchmarkSolution = challenge?.benchmarkSolution || body.benchmarkSolution;
    const starterCode = challenge?.starterCode || body.starterCode;

    const remediation = await generateRemediationAndSolution(
      title,
      problemStatement,
      submittedCode,
      language,
      benchmarkSolution,
      starterCode
    );

    return NextResponse.json({
      success: true,
      data: remediation,
    });
  } catch (error: any) {
    console.error('Remediation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate remediation' },
      { status: 500 }
    );
  }
}
