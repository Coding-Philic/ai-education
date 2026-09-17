// =====================================================================
// CogniFlow AI: Zod Validation Middleware
// Runtime type and format enforcement for requests
// =====================================================================

import { z, ZodSchema } from 'zod';
import { NextResponse } from 'next/server';

export async function validateBody<T>(body: any, schema: ZodSchema<T>): Promise<{ data?: T; errorResponse?: NextResponse }> {
  const parseResult = schema.safeParse(body);
  if (!parseResult.success) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: 'Validation Failed',
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 422 }
      ),
    };
  }
  return { data: parseResult.data };
}

// Common Validation Schemas
export const SubmissionSchema = z.object({
  challengeId: z.string().min(1, 'challengeId is required'),
  code: z.string().optional(),
  query: z.string().optional(),
  architecture: z.any().optional(),
  language: z.string().default('python'),
});

export const ChallengeCreateSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(3),
  slug: z.string().min(3),
  problemStatement: z.string().min(10),
  challengeType: z.enum(['dsa_algo', 'sql_lab', 'system_design']),
  starterCode: z.record(z.string()).default({}),
  initialVisualState: z.any().default({}),
  testCases: z.array(z.any()).default([]),
  benchmarkSolution: z.record(z.any()).default({}),
  xpReward: z.number().int().positive().default(50),
});
