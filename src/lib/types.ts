// =====================================================================
// CogniFlow AI: Core TypeScript Definitions & Domain Types
// =====================================================================

export type UserRole = 'student' | 'mentor' | 'admin';
export type TrackDomain = 'dsa' | 'sql' | 'system_design';
export type ChallengeType = 'dsa_algo' | 'sql_lab' | 'system_design';
export type SubmissionStatus = 'passed' | 'failed' | 'syntax_error' | 'processing';

export interface UserProfile {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  collegeName: string;
  avatarUrl: string;
  totalXp: number;
  currentStreak: number;
  skillRadarMetrics: {
    dsaPointers: number;
    recursionAndTrees: number;
    dynamicProgramming: number;
    sqlQueryOptimization: number;
    distributedSystemDesign: number;
  };
  preferences: {
    theme: 'dark' | 'light';
    language: string;
  };
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  domain: TrackDomain;
  description: string;
  icon: string;
  orderIndex: number;
  isPublished: boolean;
  modules?: Module[];
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  slug: string;
  summary: string;
  difficultyLevel: 1 | 2 | 3; // 1: Beginner, 2: Intermediate, 3: Advanced
  orderIndex: number;
  challenges?: Challenge[];
}

export interface VisualPointer {
  name: string;
  index: number;
  color: string;
}

export interface DSAInitialState {
  type: 'ARRAY' | 'TREE' | 'GRAPH' | 'LINKED_LIST' | 'STACK' | 'DP_TABLE';
  elements?: any[];
  pointers?: VisualPointer[];
  target?: any;
  root?: any;
  k?: any;
  [key: string]: any;
}

export interface SQLInitialState {
  type: 'RELATIONAL_TABLES';
  tables: Array<{
    name: string;
    rows: Array<Record<string, any>>;
  }>;
}

export type SystemNodeType = 
  | 'client' 
  | 'cdn' 
  | 'load_balancer' 
  | 'service' 
  | 'worker' 
  | 'queue' 
  | 'cache' 
  | 'database' 
  | 'storage';

export interface SystemDesignNode {
  id: string;
  type: SystemNodeType;
  label: string;
  sublabel?: string;
  tier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  status?: 'healthy' | 'degraded' | 'down';
  rps?: number;
  capacityRps?: number;
  latencyMs?: number;
  hitRate?: number;
  isSPOF?: boolean;
}

export interface SystemDesignEdge {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
  animated?: boolean;
}

export interface SystemDesignInitialState {
  type: 'TOPOLOGY_GRAPH';
  targetRPS: number;
  maxLatencyMs: number;
  readWriteRatio?: string;
  category?: string;
  nodes: SystemDesignNode[];
  edges: SystemDesignEdge[];
  benchmarkTopology?: {
    nodes: SystemDesignNode[];
    edges: SystemDesignEdge[];
    explanation?: string;
  };
}

export interface Challenge {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  problemStatement: string;
  challengeType: ChallengeType;
  starterCode: Record<string, string>; // e.g. { python: "...", javascript: "...", sql: "..." }
  initialVisualState: DSAInitialState | SQLInitialState | SystemDesignInitialState;
  testCases: Array<{
    input: any;
    expected: any;
  }>;
  benchmarkSolution: Record<string, any>;
  xpReward: number;
  orderIndex: number;
}

export interface VisualFrame {
  step: number;
  lineNumber?: number;
  action: string;
  dataStructureState?: any;
  pointers?: Record<string, number>;
  highlightedElements?: number[];
  memoryScope?: Record<string, any>;
  variables?: Record<string, any>;
  animationHint?: string;
  callStack?: string[];
  explanation: string;
  [key: string]: any;
}

export interface StudyPlanItem {
  stepOrder: number;
  action: string;
  recommendation: string;
}

export interface SkillGapAssessment {
  id: string;
  userId: string;
  submissionId: string;
  domain: string;
  hasLearningGap: boolean;
  gapCategory: string;
  rootCauseAnalysis: string;
  remedyExplanation: string;
  adaptiveStudyPlan: StudyPlanItem[];
  conceptSeverityScore: number; // 1 to 100
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  collegeName: string;
  challengeId?: string;
  challengeTitle?: string;
  title: string;
  content: string;
  visualReplaySnapshot?: any;
  upvotesCount: number;
  createdAt: string;
  commentsCount: number;
}

export interface LiveSolveEvent {
  userId: string;
  username: string;
  collegeName: string;
  challengeTitle: string;
  xpEarned: number;
  executionTime: string;
  timestamp: string;
}

export interface AiRemediationAdvice {
  isBuggy: boolean;
  bugExplanation: string;
  hints: Array<{
    level: 1 | 2 | 3;
    title: string;
    hint: string;
  }>;
  solution: {
    language: string;
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
}

