-- =====================================================================
-- CogniFlow AI: PostgreSQL Schema (Supabase DDL)
-- Hackathon Theme: Lenovo LEAP AI Hackathon 2026 - Problem Statement 1
-- Zero Hardcoding: All curriculum, states, and telemetry are dynamic.
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE track_domain AS ENUM ('dsa', 'sql', 'system_design');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_type AS ENUM ('dsa_algo', 'sql_lab', 'system_design');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('passed', 'failed', 'syntax_error', 'processing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'student' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL,
    college_name VARCHAR(255) DEFAULT 'AKTU Affiliated Engineering Institute',
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=cogniflow',
    total_xp INTEGER DEFAULT 0 NOT NULL,
    current_streak INTEGER DEFAULT 1 NOT NULL,
    skill_radar_metrics JSONB DEFAULT '{
        "dsaPointers": 50,
        "recursionAndTrees": 50,
        "dynamicProgramming": 30,
        "sqlQueryOptimization": 45,
        "distributedSystemDesign": 40
    }'::jsonb NOT NULL,
    preferences JSONB DEFAULT '{"theme": "dark", "language": "en"}'::jsonb NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Curriculum Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain track_domain NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'code',
    order_index INTEGER DEFAULT 0 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1 NOT NULL, -- 1: Beginner, 2: Intermediate, 3: Advanced
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(track_id, slug)
);

-- 5. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    problem_statement TEXT NOT NULL,
    challenge_type challenge_type NOT NULL,
    starter_code JSONB DEFAULT '{}'::jsonb NOT NULL,
    initial_visual_state JSONB DEFAULT '{}'::jsonb NOT NULL,
    test_cases JSONB DEFAULT '[]'::jsonb NOT NULL,
    benchmark_solution JSONB DEFAULT '{}'::jsonb NOT NULL,
    xp_reward INTEGER DEFAULT 50 NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(module_id, slug)
);

-- 6. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    submitted_code TEXT,
    submitted_architecture JSONB,
    status submission_status DEFAULT 'processing' NOT NULL,
    runtime_ms INTEGER DEFAULT 0,
    visual_frames JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Skill Gap Assessments (Problem Statement 1 Core)
CREATE TABLE IF NOT EXISTS skill_gap_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    domain VARCHAR(50) NOT NULL,
    gap_category VARCHAR(150) NOT NULL,
    root_cause TEXT NOT NULL,
    remedy_explanation TEXT NOT NULL,
    adaptive_study_plan JSONB DEFAULT '[]'::jsonb NOT NULL,
    severity_score INTEGER DEFAULT 50 NOT NULL, -- 1 to 100
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    visual_replay_snapshot JSONB,
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    comment_body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Real-time Live Sessions & Presence Table
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    current_track VARCHAR(100),
    current_challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_online BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indexes for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tracks_domain ON tracks(domain);
CREATE INDEX IF NOT EXISTS idx_modules_track_id ON modules(track_id);
CREATE INDEX IF NOT EXISTS idx_challenges_module_id ON challenges(module_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_user_id ON skill_gap_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_sessions_is_online ON live_sessions(is_online);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Public can read tracks, modules, and challenges
CREATE POLICY "Public Read Tracks" ON tracks FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Public Read Challenges" ON challenges FOR SELECT USING (true);

-- User Profiles are readable by all authenticated users
CREATE POLICY "Read Profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Update Own Profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Submissions readable by owner or admin
CREATE POLICY "Owner Read Submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner Insert Submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community is openly viewable
CREATE POLICY "Public Read Community Posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Auth Insert Community Posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
