-- =====================================================================
-- CogniFlow AI: Seed Data Script
-- Populates dynamic curriculum, users, and community data in Supabase
-- Zero Hardcoding: All client components consume this data.
-- =====================================================================

-- 1. Insert Initial Users
-- Password is 'Password@123' hashed with bcrypt
INSERT INTO users (id, email, password_hash, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin@cogniflow.edu', '$2a$10$wN3H0E1XzR4Xo12HhGzHMe8bJ0m9P1X0J4V8z7Y3.4X3p4Q7fE3Wy', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'priya.sharma@ietlucknow.ac.in', '$2a$10$wN3H0E1XzR4Xo12HhGzHMe8bJ0m9P1X0J4V8z7Y3.4X3p4Q7fE3Wy', 'student'),
    ('00000000-0000-0000-0000-000000000003', 'rahul.verma@bietjhansi.ac.in', '$2a$10$wN3H0E1XzR4Xo12HhGzHMe8bJ0m9P1X0J4V8z7Y3.4X3p4Q7fE3Wy', 'student'),
    ('00000000-0000-0000-0000-000000000004', 'ananya.singh@knitsultanpur.ac.in', '$2a$10$wN3H0E1XzR4Xo12HhGzHMe8bJ0m9P1X0J4V8z7Y3.4X3p4Q7fE3Wy', 'student')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert User Profiles
INSERT INTO user_profiles (user_id, full_name, username, college_name, avatar_url, total_xp, current_streak, skill_radar_metrics)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Prof. Arvind Kumar (Admin)', 'admin_arvind', 'AKTU Central Faculty', 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin1', 9990, 54, '{
        "dsaPointers": 98, "recursionAndTrees": 95, "dynamicProgramming": 90, "sqlQueryOptimization": 95, "distributedSystemDesign": 96
    }'::jsonb),
    ('00000000-0000-0000-0000-000000000002', 'Priya Sharma', 'priya_codes', 'Institute of Engineering & Tech (IET) Lucknow', 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya', 1850, 14, '{
        "dsaPointers": 85, "recursionAndTrees": 60, "dynamicProgramming": 42, "sqlQueryOptimization": 75, "distributedSystemDesign": 50
    }'::jsonb),
    ('00000000-0000-0000-0000-000000000003', 'Rahul Verma', 'rahul_v', 'Bundelkhand Institute of Engg (BIET) Jhansi', 'https://api.dicebear.com/7.x/bottts/svg?seed=Rahul', 1320, 8, '{
        "dsaPointers": 65, "recursionAndTrees": 78, "dynamicProgramming": 35, "sqlQueryOptimization": 82, "distributedSystemDesign": 60
    }'::jsonb),
    ('00000000-0000-0000-0000-000000000004', 'Ananya Singh', 'ananya_s', 'Kamla Nehru Institute (KNIT) Sultanpur', 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya', 2410, 21, '{
        "dsaPointers": 90, "recursionAndTrees": 88, "dynamicProgramming": 72, "sqlQueryOptimization": 90, "distributedSystemDesign": 80
    }'::jsonb)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Tracks (DSA, SQL, System Design)
INSERT INTO tracks (id, title, slug, domain, description, icon, order_index, is_published)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Data Structures & Visual Algorithms', 'dsa-track', 'dsa', 'Step inside memory: Watch pointers, arrays, recursive trees, and graphs animate in real time.', 'Binary', 1, true),
    ('10000000-0000-0000-0000-000000000002', 'Chai SQLab & Relational Engine', 'sql-track', 'sql', 'Master database execution: Visualize joins, table scans, index lookups, and EXPLAIN plans live.', 'Database', 2, true),
    ('10000000-0000-0000-0000-000000000003', 'Distributed System Design Simulator', 'system-design-track', 'system_design', 'Interactive architecture canvas: Route traffic, inject chaos failures, and observe cache hits.', 'Network', 3, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Modules
INSERT INTO modules (id, track_id, title, slug, summary, difficulty_level, order_index)
VALUES
    -- DSA Modules
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Two Pointers & Sliding Window', 'two-pointers', 'Master contiguous array shrinking and boundary expansion mechanics visually.', 1, 1),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Binary Trees & Traversals', 'binary-trees', 'Understand recursive stack frame buildup and tree level orders visually.', 2, 2),
    
    -- SQL Modules
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Visual Relational Joins', 'relational-joins', 'Observe Inner, Left, and Outer joins as animated table transformations and Venn intersections.', 1, 1),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Query Plans & Index Traversal', 'query-plans-indexes', 'Inspect B-Tree search depth, Hash Joins, and Sequential Scan bottlenecks.', 2, 2),

    -- System Design Modules
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Load Balancing & Reverse Proxies', 'load-balancing', 'Simulate Round-Robin and Least-Connections traffic distribution under heavy load.', 1, 1),
    ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Distributed Caching & DB Replicas', 'caching-and-sharding', 'Simulate cache hits, Redis invalidation, and Primary-Replica read replication lags.', 2, 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Challenges
INSERT INTO challenges (id, module_id, title, slug, problem_statement, challenge_type, starter_code, initial_visual_state, test_cases, benchmark_solution, xp_reward, order_index)
VALUES
    -- DSA Challenge 1
    (
        '30000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000001',
        'Two Sum II - Input Array Sorted',
        'two-sum-sorted',
        'Given a 1-indexed array of integers `numbers` sorted in non-decreasing order, find two numbers that add up to a specific `target`. Return their 1-indexed positions [index1, index2].',
        'dsa_algo',
        '{
            "python": "def twoSum(numbers: list[int], target: int) -> list[int]:\n    # Initialize left and right pointers\n    left = 0\n    right = len(numbers) - 1\n    while left < right:\n        current_sum = numbers[left] + numbers[right]\n        if current_sum == target:\n            return [left + 1, right + 1]\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []",
            "javascript": "function twoSum(numbers, target) {\n    let left = 0;\n    let right = numbers.length - 1;\n    while (left < right) {\n        const currentSum = numbers[left] + numbers[right];\n        if (currentSum === target) return [left + 1, right + 1];\n        if (currentSum < target) left++;\n        else right--;\n    }\n    return [];\n}"
        }'::jsonb,
        '{
            "type": "ARRAY",
            "elements": [2, 7, 11, 15],
            "pointers": [
                {"name": "left", "index": 0, "color": "#10B981"},
                {"name": "right", "index": 3, "color": "#6366F1"}
            ],
            "target": 9
        }'::jsonb,
        '[{"input": {"numbers": [2, 7, 11, 15], "target": 9}, "expected": [1, 2]}]'::jsonb,
        '{"timeComplexity": "O(n)", "spaceComplexity": "O(1)"}'::jsonb,
        50,
        1
    ),

    -- SQL Challenge 1
    (
        '30000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000003',
        'Inner Join: Students & Course Enrollments',
        'inner-join-students-courses',
        'Write a SQL query to retrieve the student name, course title, and enrollment date for all students who have registered for at least one active course.',
        'sql_lab',
        '{
            "sql": "SELECT s.name, c.title, e.enrolled_at\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id;"
        }'::jsonb,
        '{
            "type": "RELATIONAL_TABLES",
            "tables": [
                {"name": "students", "rows": [{"id": 1, "name": "Aman"}, {"id": 2, "name": "Priya"}, {"id": 3, "name": "Rohan"}]},
                {"name": "enrollments", "rows": [{"student_id": 1, "course_id": 101}, {"student_id": 2, "course_id": 102}]},
                {"name": "courses", "rows": [{"id": 101, "title": "System Design"}, {"id": 102, "title": "DSA Algorithms"}]}
            ]
        }'::jsonb,
        '[{"query": "SELECT count(*) FROM students INNER JOIN enrollments ON students.id = enrollments.student_id;", "expected": 2}]'::jsonb,
        '{"explanation": "Hash Join on students.id = enrollments.student_id"}'::jsonb,
        60,
        1
    ),

    -- System Design Challenge 1
    (
        '30000000-0000-0000-0000-000000000003',
        '20000000-0000-0000-0000-000000000005',
        'Design a Resilient High-Throughput Web App',
        'resilient-web-tier',
        'Construct an architecture handling 20,000 RPS. Introduce a Load Balancer, horizontal stateless backend instances, a Redis cache to prevent DB overload, and a Primary-Replica Postgres setup.',
        'system_design',
        '{
            "nodes": [
                {"id": "client_1", "type": "client", "label": "Web Client (10k RPS)"},
                {"id": "lb_1", "type": "load_balancer", "label": "Nginx Reverse Proxy"},
                {"id": "app_1", "type": "service", "label": "API Service Instance 1"},
                {"id": "app_2", "type": "service", "label": "API Service Instance 2"},
                {"id": "cache_1", "type": "cache", "label": "Redis Cluster (Cache)"},
                {"id": "db_primary", "type": "database", "label": "PostgreSQL Primary (Write)"},
                {"id": "db_replica", "type": "database", "label": "PostgreSQL Replica (Read)"}
            ],
            "edges": [
                {"from": "client_1", "to": "lb_1"},
                {"from": "lb_1", "to": "app_1"},
                {"from": "lb_1", "to": "app_2"},
                {"from": "app_1", "to": "cache_1"},
                {"from": "app_2", "to": "cache_1"},
                {"from": "app_1", "to": "db_primary"},
                {"from": "app_2", "to": "db_replica"}
            ]
        }'::jsonb,
        '{
            "type": "TOPOLOGY_GRAPH",
            "targetRPS": 20000,
            "maxLatencyMs": 50
        }'::jsonb,
        '[]'::jsonb,
        '{"status": "optimal"}'::jsonb,
        100,
        1
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Sample Skill Gap Assessments (Problem Statement 1 demonstration)
INSERT INTO skill_gap_assessments (id, user_id, submission_id, domain, gap_category, root_cause, remedy_explanation, adaptive_study_plan, severity_score)
VALUES
    (
        '40000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        'dsa',
        'Two Pointer Boundary Invariant',
        'Loop condition terminated early with `<` instead of `<=`, skipping the middle element.',
        'In strict sorted array matching with duplicates or boundary elements, pointer parity must be explicitly tested.',
        '[
            {"title": "Inspect Boundary Visualizer", "action": "Replay Two Sum with odd length array"},
            {"title": "Practice Module", "action": "Solve Sliding Window Maximum"}
        ]'::jsonb,
        45
    )
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Sample Community Posts (Social Peer Learning)
INSERT INTO community_posts (id, user_id, challenge_id, title, content, visual_replay_snapshot, upvotes_count)
VALUES
    (
        '50000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000001',
        'Intuitive Proof: Why Two Pointers works in O(n) without missing pairs',
        'When the array is sorted, numbers[left] + numbers[right] monotonicity guarantees that shrinking bounds eliminates impossible search spaces without backtracking! Here is my visual trace playback.',
        '{"stepsCount": 4, "optimalTime": "O(n)", "space": "O(1)"}'::jsonb,
        48
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000002',
        'Visualizing Hash Join vs Nested Loop in Postgres with 100k rows',
        'Shared my query plan trace from the SQL Lab! Notice how the hash table is built in memory for the smaller table first.',
        '{"tables": ["students", "enrollments"], "joinType": "Hash Join"}'::jsonb,
        32
    )
ON CONFLICT (id) DO NOTHING;
