// =====================================================================
// CogniFlow AI: Comprehensive Real-World System Design Curriculum
// 16 Enterprise-Grade Architecture Scenarios with Dynamic Topologies
// =====================================================================

import { Challenge } from './types';

export const SYSTEM_DESIGN_CHALLENGES: Challenge[] = [
  // -------------------------------------------------------------------
  // MODULE 1: High-Scale Web & Microservice Architecture
  // -------------------------------------------------------------------
  {
    id: 'sys-ch-01',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design TinyURL (Distributed URL Shortener)',
    slug: 'tinyurl-distributed',
    problemStatement:
      'Architect a globally scalable URL shortening service capable of handling 30,000 requests/sec with a 10:1 read-to-write ratio. Ensure sub-20ms redirect latency, 99.99% availability, and eliminate single points of failure (SPOFs). Address cache stampedes, base62 hash collisions, and database write exhaustion.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          tier: 'Web Services',
          targetRps: 30000,
          readWriteRatio: '10:1',
          latencyBudgetMs: 20,
          nodes: ['client', 'lb_nginx', 'api_service', 'db_mysql'],
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 30000,
      maxLatencyMs: 20,
      readWriteRatio: '90% Reads, 10% Writes',
      category: 'Tier-1 Web Services',
      nodes: [
        { id: 'client_tier', type: 'client', label: 'Global Clients (Web & Mobile)', tier: 1, rps: 30000, status: 'healthy' },
        { id: 'lb_ingress', type: 'load_balancer', label: 'Nginx Load Balancer', sublabel: 'Single Ingress', tier: 3, rps: 30000, isSPOF: true, status: 'healthy' },
        { id: 'api_tinyurl', type: 'service', label: 'TinyURL Hash Service', sublabel: 'Single Instance', tier: 4, rps: 30000, isSPOF: true, status: 'healthy' },
        { id: 'db_primary', type: 'database', label: 'MySQL Primary DB', sublabel: 'Writes & Reads', tier: 7, rps: 30000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'client_tier', to: 'lb_ingress', protocol: 'HTTPS', label: '30,000 RPS' },
        { from: 'lb_ingress', to: 'api_tinyurl', protocol: 'HTTP', label: 'Round-Robin' },
        { from: 'api_tinyurl', to: 'db_primary', protocol: 'SQL', label: '100% Direct DB Queries' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'client_tier', type: 'client', label: 'Global Clients', tier: 1, rps: 30000, status: 'healthy' },
          { id: 'cdn_edge', type: 'cdn', label: 'Cloudflare CDN', sublabel: 'Edge 301 Redirect Cache', tier: 2, rps: 30000, status: 'healthy' },
          { id: 'lb_active', type: 'load_balancer', label: 'HAProxy Ingress (Active)', sublabel: 'Keepalived VIP', tier: 3, rps: 15000, status: 'healthy' },
          { id: 'lb_passive', type: 'load_balancer', label: 'HAProxy Ingress (Standby)', sublabel: 'Auto Failover', tier: 3, rps: 0, status: 'healthy' },
          { id: 'api_srv1', type: 'service', label: 'Shortener API #1', sublabel: 'Stateless Base62', tier: 4, rps: 7500, status: 'healthy' },
          { id: 'api_srv2', type: 'service', label: 'Shortener API #2', sublabel: 'Stateless Base62', tier: 4, rps: 7500, status: 'healthy' },
          { id: 'redis_cache', type: 'cache', label: 'Redis Cluster (LRU)', sublabel: '85% Hit Ratio', tier: 6, rps: 12000, hitRate: 85, status: 'healthy' },
          { id: 'db_cockroach', type: 'database', label: 'Distributed NoSQL Primary', sublabel: 'Partitioned by Hash', tier: 7, rps: 3000, status: 'healthy' },
          { id: 'db_replica', type: 'database', label: 'Read Replica Cluster', sublabel: 'Asynchronous WAL Sync', tier: 7, rps: 4500, status: 'healthy' },
        ],
        edges: [
          { from: 'client_tier', to: 'cdn_edge', protocol: 'HTTPS', label: 'Global Ingress' },
          { from: 'cdn_edge', to: 'lb_active', protocol: 'TCP', label: 'Cache Misses (15k RPS)' },
          { from: 'lb_active', to: 'api_srv1', protocol: 'gRPC', label: 'Layer 7 LB' },
          { from: 'lb_active', to: 'api_srv2', protocol: 'gRPC', label: 'Layer 7 LB' },
          { from: 'api_srv1', to: 'redis_cache', protocol: 'TCP', label: 'Sub-2ms Lookup' },
          { from: 'api_srv2', to: 'redis_cache', protocol: 'TCP', label: 'Sub-2ms Lookup' },
          { from: 'api_srv1', to: 'db_cockroach', protocol: 'SQL', label: 'New URL Writes' },
          { from: 'redis_cache', to: 'db_replica', protocol: 'SQL', label: 'Cache Miss Reads' },
        ],
        explanation: 'Benchmark architecture introduces Edge 301 Caching via CDN, eliminating 50% of traffic before reaching servers. A redundant HAProxy pair removes Ingress SPOF, Redis Cluster absorbs 85% of URL lookups, and horizontally sharded DB handles write spikes safely.',
      },
    },
    testCases: [
      { input: 'Ingress LB Failure', expected: 'Active-Standby failover preserves 100% uptime' },
      { input: 'Traffic Spike 30k RPS', expected: 'Redis Cache hit >= 80%, DB write load < 5k QPS' },
      { input: 'Latency Constraint', expected: 'P99 response time <= 20ms' },
    ],
    benchmarkSolution: {
      redundancy: 'Active-Passive Keepalived Ingress',
      caching: 'Distributed Redis Cluster LRU',
      storage: 'Key-Value NoSQL partitioned by 7-char hash prefix',
      timeComplexity: 'O(1) hash lookup',
      availability: '99.99%',
    },
    xpReward: 90,
    orderIndex: 1,
  },
  {
    id: 'sys-ch-02',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design a Distributed Rate Limiter',
    slug: 'distributed-rate-limiter',
    problemStatement:
      'Design an ultra-low latency (<5ms overhead) distributed rate limiter protecting downstream microservices against DoS bursts and noisy neighbors. Handle 50,000 RPS across multi-datacenter clusters. Support Sliding Window Counter, Token Bucket algorithms, and graceful degraded fallback when the rate cache is unreachable.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          algorithm: 'Token Bucket',
          targetRps: 50000,
          maxLatencyMs: 5,
          storage: 'Local In-Memory Map',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 50000,
      maxLatencyMs: 5,
      readWriteRatio: '50% Reads, 50% Updates',
      category: 'Tier-1 Web Services',
      nodes: [
        { id: 'client_tier', type: 'client', label: 'API Clients', tier: 1, rps: 50000, status: 'healthy' },
        { id: 'gateway', type: 'service', label: 'API Gateway', sublabel: 'In-Memory HashMap Limiter', tier: 4, rps: 50000, isSPOF: true, status: 'healthy' },
        { id: 'downstream', type: 'service', label: 'Downstream Core API', tier: 4, rps: 20000, status: 'healthy' },
      ],
      edges: [
        { from: 'client_tier', to: 'gateway', protocol: 'HTTPS', label: '50,000 RPS' },
        { from: 'gateway', to: 'downstream', protocol: 'gRPC', label: 'Unbounded Forwarding' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'client_tier', type: 'client', label: 'API Consumers', tier: 1, rps: 50000, status: 'healthy' },
          { id: 'envoy_lb', type: 'load_balancer', label: 'Envoy Edge Proxy', sublabel: 'Rate Limiter Filter', tier: 3, rps: 50000, status: 'healthy' },
          { id: 'limiter_svc1', type: 'service', label: 'Rate Limiter Service #1', sublabel: 'Sliding Window Lua', tier: 4, rps: 25000, status: 'healthy' },
          { id: 'limiter_svc2', type: 'service', label: 'Rate Limiter Service #2', sublabel: 'Sliding Window Lua', tier: 4, rps: 25000, status: 'healthy' },
          { id: 'redis_cluster', type: 'cache', label: 'Redis Cluster (Atomic Lua)', sublabel: 'Sub-millisecond Token Counters', tier: 6, rps: 50000, status: 'healthy' },
          { id: 'rules_db', type: 'database', label: 'DynamoDB (Rate Rules)', sublabel: 'Tier Quotas & Allowlist', tier: 7, rps: 500, status: 'healthy' },
          { id: 'downstream_svc', type: 'service', label: 'Protected Core API', sublabel: 'Guaranteed Safe Throughput', tier: 4, rps: 35000, status: 'healthy' },
        ],
        edges: [
          { from: 'client_tier', to: 'envoy_lb', protocol: 'HTTPS', label: 'Ingress API Calls' },
          { from: 'envoy_lb', to: 'limiter_svc1', protocol: 'gRPC', label: 'Ratification Check' },
          { from: 'envoy_lb', to: 'limiter_svc2', protocol: 'gRPC', label: 'Ratification Check' },
          { from: 'limiter_svc1', to: 'redis_cluster', protocol: 'TCP', label: 'Atomic EVALSHA Script' },
          { from: 'limiter_svc2', to: 'redis_cluster', protocol: 'TCP', label: 'Atomic EVALSHA Script' },
          { from: 'redis_cluster', to: 'rules_db', protocol: 'HTTPS', label: 'Rule Sync (Async)' },
          { from: 'envoy_lb', to: 'downstream_svc', protocol: 'gRPC', label: 'Authorized Traffic' },
        ],
        explanation: 'Decouples rate enforcement to an Envoy Proxy filter backed by a dedicated distributed Redis cluster running sliding window counter Lua scripts to eliminate race conditions, with DynamoDB storing tier definitions.',
      },
    },
    testCases: [
      { input: 'Burst Traffic 50k RPS', expected: 'Limits enforced within 2ms latency' },
      { input: 'Redis Node Crash', expected: 'Fail-open circuit breaker allows legitimate requests' },
    ],
    benchmarkSolution: {
      algorithm: 'Sliding Window Counter with Redis Atomic Lua Script',
      latency: '< 2.5ms P99',
      failover: 'Circuit Breaker fallback with local in-memory token bucket',
    },
    xpReward: 95,
    orderIndex: 2,
  },
  {
    id: 'sys-ch-03',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design a Global Notification Service',
    slug: 'global-notification-service',
    problemStatement:
      'Design a resilient multi-channel notification engine dispatching 40,000 alerts/sec across Push (APNS/FCM), SMS (Twilio), and Email (SendGrid). Prevent third-party provider timeouts from hanging client requests. Support priority queues, deduplication, retry with exponential backoff, and dead-letter queues (DLQ).',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          targetRps: 40000,
          channels: ['push', 'sms', 'email'],
          mode: 'Synchronous REST calls to 3rd party providers',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 40000,
      maxLatencyMs: 100,
      category: 'Tier-1 Web Services',
      nodes: [
        { id: 'client_tier', type: 'client', label: 'Triggering Services', tier: 1, rps: 40000, status: 'healthy' },
        { id: 'monolith_api', type: 'service', label: 'Notification Monolith API', sublabel: 'Sync HTTP Calls to Vendors', tier: 4, rps: 40000, isSPOF: true, status: 'healthy' },
        { id: 'vendor_push', type: 'service', label: 'APNS / FCM Vendor', tier: 4, rps: 20000, status: 'healthy' },
        { id: 'vendor_sms', type: 'service', label: 'Twilio SMS Vendor', tier: 4, rps: 10000, status: 'healthy' },
        { id: 'vendor_email', type: 'service', label: 'SendGrid Email Vendor', tier: 4, rps: 10000, status: 'healthy' },
      ],
      edges: [
        { from: 'client_tier', to: 'monolith_api', protocol: 'HTTPS', label: 'Blocking Sync Calls' },
        { from: 'monolith_api', to: 'vendor_push', protocol: 'HTTPS', label: 'Slow Remote Vendor (2s)' },
        { from: 'monolith_api', to: 'vendor_sms', protocol: 'HTTPS', label: 'Rate-Limited Vendor' },
        { from: 'monolith_api', to: 'vendor_email', protocol: 'SMTP', label: 'High-Latency API' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'client_tier', type: 'client', label: 'Client Apps & Services', tier: 1, rps: 40000, status: 'healthy' },
          { id: 'api_gateway', type: 'load_balancer', label: 'API Gateway & Ingress', sublabel: 'JWT & Rate Limit', tier: 3, rps: 40000, status: 'healthy' },
          { id: 'validator_svc', type: 'service', label: 'Ingestion Service', sublabel: 'Deduplication & Validation', tier: 4, rps: 40000, status: 'healthy' },
          { id: 'dedup_cache', type: 'cache', label: 'Redis Idempotency Store', sublabel: 'TTL 24hr Dedup Keys', tier: 6, rps: 40000, status: 'healthy' },
          { id: 'kafka_bus', type: 'queue', label: 'Kafka Event Bus', sublabel: 'Partitioned: push/sms/email', tier: 5, rps: 40000, status: 'healthy' },
          { id: 'worker_push', type: 'worker', label: 'Push Worker Pool (x10)', sublabel: 'Async APNS/FCM Pipe', tier: 4, rps: 20000, status: 'healthy' },
          { id: 'worker_sms', type: 'worker', label: 'SMS Worker Pool (x6)', sublabel: 'Twilio Rate Limiter', tier: 4, rps: 10000, status: 'healthy' },
          { id: 'worker_email', type: 'worker', label: 'Email Worker Pool (x4)', sublabel: 'SendGrid Batch Dispatch', tier: 4, rps: 10000, status: 'healthy' },
          { id: 'dlq_queue', type: 'queue', label: 'Dead Letter Queue (DLQ)', sublabel: 'Failed Delivery Fallback', tier: 5, rps: 120, status: 'healthy' },
          { id: 'db_audit', type: 'database', label: 'PostgreSQL Audit Store', sublabel: 'Delivery Status Tracking', tier: 7, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'client_tier', to: 'api_gateway', protocol: 'HTTPS', label: 'Immediate 202 Accepted' },
          { from: 'api_gateway', to: 'validator_svc', protocol: 'gRPC', label: 'Ingest' },
          { from: 'validator_svc', to: 'dedup_cache', protocol: 'TCP', label: 'Check Dedup Key' },
          { from: 'validator_svc', to: 'kafka_bus', protocol: 'TCP', label: 'Publish to Topics' },
          { from: 'kafka_bus', to: 'worker_push', protocol: 'PubSub', label: 'Topic: notifications.push' },
          { from: 'kafka_bus', to: 'worker_sms', protocol: 'PubSub', label: 'Topic: notifications.sms' },
          { from: 'kafka_bus', to: 'worker_email', protocol: 'PubSub', label: 'Topic: notifications.email' },
          { from: 'worker_push', to: 'dlq_queue', protocol: 'TCP', label: 'On 3x Max Retry Fail' },
          { from: 'worker_push', to: 'db_audit', protocol: 'SQL', label: 'Persist Log' },
        ],
        explanation: 'Decouples client dispatch from slow third-party networks using Apache Kafka. Ingestion service returns HTTP 202 in <10ms, while dedicated async worker pools consume channel-specific partitions, rate-limit outgoing vendor calls, and route poison pills to a Dead Letter Queue.',
      },
    },
    testCases: [
      { input: 'Twilio Outage 100% Drops', expected: 'Kafka buffers messages; DLQ captures persistent failures' },
      { input: 'Duplicate Request Send', expected: 'Redis deduplication filter drops redundant dispatch' },
    ],
    benchmarkSolution: {
      messaging: 'Apache Kafka with topic per channel',
      idempotency: 'Redis SHA-256 fingerprint deduplication',
      resilience: 'Exponential backoff with jitter + DLQ retry cron',
    },
    xpReward: 100,
    orderIndex: 3,
  },
  {
    id: 'sys-ch-04',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design Pastebin (Ephemeral Text Storage)',
    slug: 'pastebin-distributed-storage',
    problemStatement:
      'Design a distributed text snippet storage service (Pastebin) handling 15,000 RPS. Support custom expiry (1 hour to 1 year) and snippet sizes up to 10MB. Separate metadata from payload storage, implement hot-paste caching, and automate asynchronous TTL expiration cleanup without database thrashing.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          targetRps: 15000,
          storageStrategy: 'Store 10MB text payloads directly into SQL TEXT column',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 15000,
      maxLatencyMs: 35,
      category: 'Tier-1 Web Services',
      nodes: [
        { id: 'client_tier', type: 'client', label: 'Users (Browsers & CLI)', tier: 1, rps: 15000, status: 'healthy' },
        { id: 'web_server', type: 'service', label: 'Pastebin Web Server', tier: 4, rps: 15000, isSPOF: true, status: 'healthy' },
        { id: 'sql_database', type: 'database', label: 'Postgres DB (Heavy BLOBs)', sublabel: 'Payloads in DB row', tier: 7, rps: 15000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'client_tier', to: 'web_server', protocol: 'HTTPS', label: '15,000 RPS' },
        { from: 'web_server', to: 'sql_database', protocol: 'SQL', label: 'Heavy I/O Bloat' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'client_tier', type: 'client', label: 'Users & API Clients', tier: 1, rps: 15000, status: 'healthy' },
          { id: 'cdn_edge', type: 'cdn', label: 'Cloudflare CDN', sublabel: 'Public Paste Cache', tier: 2, rps: 15000, status: 'healthy' },
          { id: 'lb_cluster', type: 'load_balancer', label: 'Dual Load Balancers', sublabel: 'Weighted Round-Robin', tier: 3, rps: 12000, status: 'healthy' },
          { id: 'api_read', type: 'service', label: 'Paste Read Nodes (x3)', sublabel: 'Stateless Fetchers', tier: 4, rps: 9000, status: 'healthy' },
          { id: 'api_write', type: 'service', label: 'Paste Write Nodes (x2)', sublabel: 'Direct S3 Presigned URL', tier: 4, rps: 3000, status: 'healthy' },
          { id: 'redis_hot', type: 'cache', label: 'Redis Hot Paste Cache', sublabel: 'Top 15% Trending Pastes', tier: 6, rps: 8000, status: 'healthy' },
          { id: 's3_storage', type: 'storage', label: 'Amazon S3 / MinIO', sublabel: 'Compressed Text Payloads', tier: 7, rps: 4000, status: 'healthy' },
          { id: 'metadata_db', type: 'database', label: 'DynamoDB / Cassandra', sublabel: 'Paste ID, TTL, Hash, Owner', tier: 7, rps: 3000, status: 'healthy' },
          { id: 'expiry_worker', type: 'worker', label: 'TTL Expiration Sweeper', sublabel: 'S3 Lifecycle Rule + Worker', tier: 4, rps: 200, status: 'healthy' },
        ],
        edges: [
          { from: 'client_tier', to: 'cdn_edge', protocol: 'HTTPS', label: 'Snippet Request' },
          { from: 'cdn_edge', to: 'lb_cluster', protocol: 'HTTPS', label: 'Cache Misses' },
          { from: 'lb_cluster', to: 'api_read', protocol: 'gRPC', label: 'Read Routing' },
          { from: 'lb_cluster', to: 'api_write', protocol: 'gRPC', label: 'Write Routing' },
          { from: 'api_read', to: 'redis_hot', protocol: 'TCP', label: 'Fast Memory Cache' },
          { from: 'api_read', to: 's3_storage', protocol: 'HTTPS', label: 'Blob Download' },
          { from: 'api_write', to: 's3_storage', protocol: 'HTTPS', label: 'Stream Payload' },
          { from: 'api_write', to: 'metadata_db', protocol: 'TCP', label: 'Record Metadata' },
          { from: 'expiry_worker', to: 'metadata_db', protocol: 'TCP', label: 'Purge Expired Rows' },
        ],
        explanation: 'Separates snippet metadata (DynamoDB/Cassandra) from heavy text payloads stored in Object Storage (S3), avoiding database disk bloat. Hot pastes reside in Redis, and S3 Lifecycle rules automatically purge expired pastes without CPU overhead.',
      },
    },
    testCases: [
      { input: '10MB Paste Upload', expected: 'Direct stream to S3 bypasses database memory buffers' },
      { input: 'Expired Paste Request', expected: 'Instant 404 via TTL index without scanning S3' },
    ],
    benchmarkSolution: {
      storage: 'Hybrid: S3 for Text Payloads + Cassandra for Metadata',
      caching: 'Redis LRU for viral snippets',
      purging: 'S3 Lifecycle policies + DynamoDB TTL auto-eviction',
    },
    xpReward: 85,
    orderIndex: 4,
  },

  // -------------------------------------------------------------------
  // MODULE 2: High-Concurrency, E-Commerce & Flash Sales
  // -------------------------------------------------------------------
  {
    id: 'sys-ch-05',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design High-Concurrency Flash Sale / Ticketmaster',
    slug: 'flash-sale-ticketmaster',
    problemStatement:
      'Architect a high-concurrency ticket reservation engine handling an explosive 80,000 RPS burst when tickets drop. Zero overselling is strictly required under high contention. Prevent SQL row lock deadlocks, provide fair queuing / virtual waiting rooms, and automatically release expired reservations after 10 minutes.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          concurrency: 80000,
          inventoryStrategy: 'Direct SQL UPDATE stock = stock - 1 WHERE id = 1',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 80000,
      maxLatencyMs: 50,
      category: 'High-Concurrency & E-Commerce',
      nodes: [
        { id: 'fans_tier', type: 'client', label: '80,000 Eager Fans', tier: 1, rps: 80000, status: 'healthy' },
        { id: 'booking_monolith', type: 'service', label: 'Booking Monolith Web App', tier: 4, rps: 80000, isSPOF: true, status: 'healthy' },
        { id: 'relational_db', type: 'database', label: 'Single MySQL Master', sublabel: 'Row Lock Contention (Deadlocks)', tier: 7, rps: 80000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'fans_tier', to: 'booking_monolith', protocol: 'HTTPS', label: '80,000 Burst RPS' },
        { from: 'booking_monolith', to: 'relational_db', protocol: 'SQL', label: 'Concurrent Row Lock Freeze' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'fans_tier', type: 'client', label: '80k Eager Users', tier: 1, rps: 80000, status: 'healthy' },
          { id: 'bot_protection', type: 'cdn', label: 'Cloudflare Waiting Room', sublabel: 'Virtual Queue & Captcha', tier: 2, rps: 80000, status: 'healthy' },
          { id: 'ingress_lb', type: 'load_balancer', label: 'Ingress Load Balancer Cluster', sublabel: 'Traffic Throttling', tier: 3, rps: 20000, status: 'healthy' },
          { id: 'sale_gatekeeper', type: 'service', label: 'Gatekeeper Pods (x6)', sublabel: 'Token Verification', tier: 4, rps: 20000, status: 'healthy' },
          { id: 'redis_lock', type: 'cache', label: 'Redis Cluster (Atomic DECR)', sublabel: 'In-Memory Stock with Lua Script', tier: 6, rps: 20000, hitRate: 98, status: 'healthy' },
          { id: 'order_kafka', type: 'queue', label: 'Kafka Order Creation Topic', sublabel: 'Ordered FIFO Partitioning', tier: 5, rps: 5000, status: 'healthy' },
          { id: 'settle_worker', type: 'worker', label: 'Order Settlement Workers (x8)', sublabel: 'Async Payment & DB Writer', tier: 4, rps: 5000, status: 'healthy' },
          { id: 'acid_db', type: 'database', label: 'PostgreSQL ACID Ledger', sublabel: 'Serializable Isolation', tier: 7, rps: 2500, status: 'healthy' },
          { id: 'timeout_worker', type: 'worker', label: '10-Min Release Watcher', sublabel: 'Re-increments Redis on Timeout', tier: 4, rps: 200, status: 'healthy' },
        ],
        edges: [
          { from: 'fans_tier', to: 'bot_protection', protocol: 'HTTPS', label: '80k Traffic Burst' },
          { from: 'bot_protection', to: 'ingress_lb', protocol: 'HTTPS', label: 'Admitted Batches (20k RPS)' },
          { from: 'ingress_lb', to: 'sale_gatekeeper', protocol: 'gRPC', label: 'Forward' },
          { from: 'sale_gatekeeper', to: 'redis_lock', protocol: 'TCP', label: 'Atomic DECR inventory:101' },
          { from: 'sale_gatekeeper', to: 'order_kafka', protocol: 'TCP', label: 'On Success -> Queue Order' },
          { from: 'order_kafka', to: 'settle_worker', protocol: 'PubSub', label: 'Process Payment' },
          { from: 'settle_worker', to: 'acid_db', protocol: 'SQL', label: 'Commit Reservation' },
          { from: 'timeout_worker', to: 'redis_lock', protocol: 'TCP', label: 'INCR on Unpaid Expiry' },
        ],
        explanation: 'Guarantees zero overselling by decrementing stock atomically in Redis via Lua scripts before any SQL mutation. An upfront Virtual Waiting Room smoothens the 80k burst, while Kafka buffers confirmed reservations to write cleanly to PostgreSQL without row locks.',
      },
    },
    testCases: [
      { input: '80k Concurrent Click on 1,000 Tickets', expected: 'Exactly 1,000 orders created, 0 oversold, 0 DB deadlocks' },
      { input: 'User abandons payment after 10m', expected: 'Worker releases inventory back to Redis pool' },
    ],
    benchmarkSolution: {
      concurrencyControl: 'Redis atomic DECR + Lua script barrier',
      buffering: 'Apache Kafka event log with consumer group concurrency',
      storage: 'PostgreSQL with optimistic locking and ledger transaction audit',
    },
    xpReward: 120,
    orderIndex: 5,
  },
  {
    id: 'sys-ch-06',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design an Idempotent Payment Gateway (Stripe-like)',
    slug: 'idempotent-payment-gateway',
    problemStatement:
      'Design a financial-grade payment gateway processing 10,000 transactions/second with 99.999% consistency and strict zero-double-charge guarantees. Implement Idempotency Keys with Redis locks, the Transactional Outbox pattern, Saga distributed transactions, and banking reconciliation ledgers.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          tps: 10000,
          idempotency: 'None (Repeated clicks cause double bank charges)',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 10000,
      maxLatencyMs: 150,
      category: 'High-Concurrency & E-Commerce',
      nodes: [
        { id: 'checkout_tier', type: 'client', label: 'Shoppers Submitting Payment', tier: 1, rps: 10000, status: 'healthy' },
        { id: 'payment_app', type: 'service', label: 'Payment Handler', sublabel: 'No Idempotency Key Check', tier: 4, rps: 10000, isSPOF: true, status: 'healthy' },
        { id: 'bank_partner', type: 'service', label: 'Visa / Mastercard Gateway', sublabel: 'Direct Sync API Call', tier: 4, rps: 10000, status: 'healthy' },
      ],
      edges: [
        { from: 'checkout_tier', to: 'payment_app', protocol: 'HTTPS', label: '10,000 TPS (Network Retries)' },
        { from: 'payment_app', to: 'bank_partner', protocol: 'HTTPS', label: 'Double Charges on Retries' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'checkout_tier', type: 'client', label: 'Shoppers & Merchant Apps', tier: 1, rps: 10000, status: 'healthy' },
          { id: 'api_gw', type: 'load_balancer', label: 'PCI-DSS Compliant Gateway', sublabel: 'TLS 1.3 Termination', tier: 3, rps: 10000, status: 'healthy' },
          { id: 'orchestrator', type: 'service', label: 'Payment Orchestrator (x4)', sublabel: 'Saga State Machine', tier: 4, rps: 10000, status: 'healthy' },
          { id: 'idemp_redis', type: 'cache', label: 'Redis Idempotency Lock', sublabel: 'SETNX key:uuid EX 120', tier: 6, rps: 10000, status: 'healthy' },
          { id: 'outbox_bus', type: 'queue', label: 'Transactional Outbox Bus (Kafka)', sublabel: 'Guaranteed At-Least-Once', tier: 5, rps: 10000, status: 'healthy' },
          { id: 'bank_adapter', type: 'worker', label: 'Bank Adapter Workers (x8)', sublabel: 'Circuit Breaker & Fallback', tier: 4, rps: 8000, status: 'healthy' },
          { id: 'double_entry_db', type: 'database', label: 'Postgres Double-Entry Ledger', sublabel: 'Immutable Debit/Credit rows', tier: 7, rps: 4000, status: 'healthy' },
        ],
        edges: [
          { from: 'checkout_tier', to: 'api_gw', protocol: 'HTTPS', label: 'Submit with Idempotency-Key' },
          { from: 'api_gw', to: 'orchestrator', protocol: 'gRPC', label: 'Route' },
          { from: 'orchestrator', to: 'idemp_redis', protocol: 'TCP', label: 'Acquire Lease (SETNX)' },
          { from: 'orchestrator', to: 'double_entry_db', protocol: 'SQL', label: 'Write Outbox Event' },
          { from: 'orchestrator', to: 'outbox_bus', protocol: 'TCP', label: 'Publish Payment Intent' },
          { from: 'outbox_bus', to: 'bank_adapter', protocol: 'PubSub', label: 'Consume Intent' },
          { from: 'bank_adapter', to: 'double_entry_db', protocol: 'SQL', label: 'Commit Final Ledger State' },
        ],
        explanation: 'Enforces idempotency via Redis distributed locks with unique request tokens. The Transactional Outbox pattern guarantees that ledger records and banking messages commit atomically, preventing double charges during connection drops.',
      },
    },
    testCases: [
      { input: 'Customer double-clicks "Pay" button within 50ms', expected: 'Second request rejected with cached 200 result' },
      { input: 'Bank API timeout during capture', expected: 'Saga orchestrator executes compensating transaction' },
    ],
    benchmarkSolution: {
      consistency: 'Strict serializable double-entry bookkeeping',
      coordination: 'Saga Orchestration Pattern with Compensating Actions',
      idempotency: 'Redis SETNX with cryptographic token hash',
    },
    xpReward: 110,
    orderIndex: 6,
  },
  {
    id: 'sys-ch-07',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design Real-Time Ad Click Aggregator & Analytics',
    slug: 'realtime-ad-click-aggregator',
    problemStatement:
      'Design a real-time ad attribution and click stream analytics pipeline ingesting 100,000 events/sec. Provide sub-minute query aggregations for advertiser dashboards, detect click fraud (IP spam, bots), and persist raw immutable event streams to cold storage for billing audits.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          ingestionRps: 100000,
          analyticsQueryEngine: 'Direct SQL COUNT(*) GROUP BY advertiser_id on raw click table',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 100000,
      maxLatencyMs: 10,
      category: 'High-Concurrency & E-Commerce',
      nodes: [
        { id: 'ad_viewers', type: 'client', label: '100k Ad Clicks / sec', tier: 1, rps: 100000, status: 'healthy' },
        { id: 'click_receiver', type: 'service', label: 'HTTP Click Logger', tier: 4, rps: 100000, isSPOF: true, status: 'healthy' },
        { id: 'sql_oltp', type: 'database', label: 'MySQL Single DB', sublabel: 'Massive Disk I/O Lockup', tier: 7, rps: 100000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'ad_viewers', to: 'click_receiver', protocol: 'HTTPS', label: '100,000 Clicks/sec' },
        { from: 'click_receiver', to: 'sql_oltp', protocol: 'SQL', label: 'Raw Row Insert Thrashing' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'ad_viewers', type: 'client', label: '100k Clicks / sec', tier: 1, rps: 100000, status: 'healthy' },
          { id: 'edge_cdn', type: 'cdn', label: 'Global Edge Ingestion (Anycast)', sublabel: 'Bot Filter & Pixel 204', tier: 2, rps: 100000, status: 'healthy' },
          { id: 'kafka_stream', type: 'queue', label: 'Apache Kafka Click Topic', sublabel: '64 Partitions (Key: ad_id)', tier: 5, rps: 100000, status: 'healthy' },
          { id: 'flink_stream', type: 'worker', label: 'Apache Flink Stream Engine', sublabel: '10s Tumbling Windows + Dedup', tier: 4, rps: 100000, status: 'healthy' },
          { id: 'clickhouse_olap', type: 'database', label: 'ClickHouse Columnar OLAP', sublabel: 'Aggregated Metrics Engine', tier: 7, rps: 1500, status: 'healthy' },
          { id: 's3_data_lake', type: 'storage', label: 'S3 Raw Data Lake (Parquet)', sublabel: 'Long-term Billing Audit', tier: 7, rps: 500, status: 'healthy' },
          { id: 'redis_dashboard', type: 'cache', label: 'Redis Dashboard Cache', sublabel: 'Sub-second Ad Analytics', tier: 6, rps: 3000, status: 'healthy' },
        ],
        edges: [
          { from: 'ad_viewers', to: 'edge_cdn', protocol: 'HTTPS', label: 'Instant Pixel 204 Response' },
          { from: 'edge_cdn', to: 'kafka_stream', protocol: 'TCP', label: 'Batch Push to Kafka' },
          { from: 'kafka_stream', to: 'flink_stream', protocol: 'PubSub', label: 'Continuous Stream Processing' },
          { from: 'flink_stream', to: 'clickhouse_olap', protocol: 'TCP', label: 'Aggregated Window Output' },
          { from: 'flink_stream', to: 's3_data_lake', protocol: 'HTTPS', label: 'Parquet Micro-batches' },
          { from: 'clickhouse_olap', to: 'redis_dashboard', protocol: 'TCP', label: 'Query Cache Sync' },
        ],
        explanation: 'Employs an event-driven lambda architecture: Ingestion returns HTTP 204 instantly, Kafka buffers 100k events/sec, Apache Flink calculates 10-second tumbling window aggregations, and ClickHouse enables sub-second advertiser queries.',
      },
    },
    testCases: [
      { input: '100k Clicks/sec sustained', expected: 'P99 ingestion latency < 15ms, zero dropped clicks' },
      { input: 'Dashboard query for top 50 campaigns', expected: 'Returns in < 150ms via ClickHouse columnar index' },
    ],
    benchmarkSolution: {
      ingestion: 'Apache Kafka with partition keying on ad_id',
      streamProcessing: 'Apache Flink Stateful Stream processing',
      olap: 'ClickHouse Columnar Database with MergeTree engine',
    },
    xpReward: 115,
    orderIndex: 7,
  },
  {
    id: 'sys-ch-08',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design E-Commerce Cart & Inventory Reservation',
    slug: 'ecommerce-cart-inventory',
    problemStatement:
      'Design an e-commerce shopping cart and inventory reservation system for 25,000 RPS. Support temporary 15-minute item reservations during checkout, handle shopping cart persistence across mobile and web sessions, and guarantee zero inventory drift across distributed regional warehouses.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          cartModel: 'Client browser localStorage (lost on app re-install)',
          reservationStrategy: 'No temporary lock; inventory deducted only after payment',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 25000,
      maxLatencyMs: 40,
      category: 'High-Concurrency & E-Commerce',
      nodes: [
        { id: 'shoppers', type: 'client', label: 'Shoppers (Cart Actions)', tier: 1, rps: 25000, status: 'healthy' },
        { id: 'cart_monolith', type: 'service', label: 'Cart API Service', tier: 4, rps: 25000, isSPOF: true, status: 'healthy' },
        { id: 'relational_db', type: 'database', label: 'Postgres DB', sublabel: 'Cart rows in single table', tier: 7, rps: 25000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'shoppers', to: 'cart_monolith', protocol: 'HTTPS', label: '25,000 RPS' },
        { from: 'cart_monolith', to: 'relational_db', protocol: 'SQL', label: 'Direct SQL query per item click' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'shoppers', type: 'client', label: 'Cross-Platform Shoppers', tier: 1, rps: 25000, status: 'healthy' },
          { id: 'ingress_lb', type: 'load_balancer', label: 'AWS ALB Cluster', sublabel: 'SSL & Path Routing', tier: 3, rps: 25000, status: 'healthy' },
          { id: 'cart_svc', type: 'service', label: 'Cart Microservice (x4)', sublabel: 'Stateless Session Sync', tier: 4, rps: 18000, status: 'healthy' },
          { id: 'inventory_svc', type: 'service', label: 'Inventory Reservation Pods', sublabel: 'Two-Phase Reservation', tier: 4, rps: 7000, status: 'healthy' },
          { id: 'redis_cart', type: 'cache', label: 'Redis Hash Store (Cart)', sublabel: 'HSET cart:user_id item qty', tier: 6, rps: 18000, status: 'healthy' },
          { id: 'redis_reservation', type: 'cache', label: 'Redis TTL Hold Store', sublabel: '15-Minute Expiry Lock', tier: 6, rps: 7000, status: 'healthy' },
          { id: 'dynamo_cart', type: 'database', label: 'DynamoDB (Persistent Cart)', sublabel: 'Long-term cross-device recovery', tier: 7, rps: 2000, status: 'healthy' },
          { id: 'postgres_inv', type: 'database', label: 'PostgreSQL Inventory Master', sublabel: 'Warehouse Stock Ledger', tier: 7, rps: 1500, status: 'healthy' },
        ],
        edges: [
          { from: 'shoppers', to: 'ingress_lb', protocol: 'HTTPS', label: 'Add to Cart / Reserve' },
          { from: 'ingress_lb', to: 'cart_svc', protocol: 'gRPC', label: 'Path: /cart/*' },
          { from: 'ingress_lb', to: 'inventory_svc', protocol: 'gRPC', label: 'Path: /checkout/hold' },
          { from: 'cart_svc', to: 'redis_cart', protocol: 'TCP', label: 'Sub-millisecond Cart Mutation' },
          { from: 'cart_svc', to: 'dynamo_cart', protocol: 'HTTPS', label: 'Async Snapshot Persist' },
          { from: 'inventory_svc', to: 'redis_reservation', protocol: 'TCP', label: 'Set 15-min Reservation Lock' },
          { from: 'inventory_svc', to: 'postgres_inv', protocol: 'SQL', label: 'Commit on Final Payment' },
        ],
        explanation: 'Stores dynamic active shopping carts in Redis Hashes with asynchronous persistence to DynamoDB for cross-device synchronization. Holds 15-minute temporary inventory reservations in Redis with auto-expiry to ensure fair customer checkout without locking SQL tables.',
      },
    },
    testCases: [
      { input: 'User adds 5 items to cart on mobile, opens web app', expected: 'Instant cart sync via Redis Hash + DynamoDB' },
      { input: 'Hold expires without checkout', expected: 'TTL clears Redis lock; inventory instantly freed' },
    ],
    benchmarkSolution: {
      cartStorage: 'Redis Hashes with asynchronous DynamoDB write-behind',
      inventoryLock: 'Redis distributed reservation with 900s TTL',
      database: 'PostgreSQL Primary-Replica with WAL replication',
    },
    xpReward: 90,
    orderIndex: 8,
  },

  // -------------------------------------------------------------------
  // MODULE 3: Real-Time Streaming, Social & Collab
  // -------------------------------------------------------------------
  {
    id: 'sys-ch-09',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design WhatsApp / Real-Time Chat Messenger',
    slug: 'whatsapp-realtime-chat',
    problemStatement:
      'Design a distributed real-time messaging platform supporting 50,000 persistent concurrent WebSocket connections. Deliver messages with sub-100ms latency, guarantee message ordering, handle online/offline status presence, and efficiently store billions of historical messages optimized for sequential time-series reads.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          connections: 50000,
          protocol: 'HTTP Short Polling every 1 second',
          storage: 'Single MySQL database table with 100M rows',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 50000,
      maxLatencyMs: 100,
      category: 'Real-Time Streaming & Social',
      nodes: [
        { id: 'mobile_clients', type: 'client', label: '50k Mobile Clients', tier: 1, rps: 50000, status: 'healthy' },
        { id: 'polling_srv', type: 'service', label: 'HTTP Polling Server', sublabel: 'Empty Poll Storms (50k/sec)', tier: 4, rps: 50000, isSPOF: true, status: 'healthy' },
        { id: 'mysql_chat', type: 'database', label: 'MySQL Chat Table', sublabel: 'O(N) Table Scans on Polling', tier: 7, rps: 50000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'mobile_clients', to: 'polling_srv', protocol: 'HTTPS', label: '1s HTTP Poll Interval' },
        { from: 'polling_srv', to: 'mysql_chat', protocol: 'SQL', label: 'Continuous DB Thrashing' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'mobile_clients', type: 'client', label: 'Active Chat Users (50k)', tier: 1, rps: 50000, status: 'healthy' },
          { id: 'ws_lb', type: 'load_balancer', label: 'Layer 4 TCP Load Balancer', sublabel: 'Consistent Hashing IP Hash', tier: 3, rps: 50000, status: 'healthy' },
          { id: 'ws_gw1', type: 'service', label: 'WebSocket Gateway #1', sublabel: '25k Persistent WSS Conns', tier: 4, rps: 25000, status: 'healthy' },
          { id: 'ws_gw2', type: 'service', label: 'WebSocket Gateway #2', sublabel: '25k Persistent WSS Conns', tier: 4, rps: 25000, status: 'healthy' },
          { id: 'presence_redis', type: 'cache', label: 'Redis Pub/Sub & Presence', sublabel: 'Session Registry & Heartbeats', tier: 6, rps: 50000, status: 'healthy' },
          { id: 'msg_kafka', type: 'queue', label: 'Kafka Message Bus', sublabel: 'Partitioned by conversation_id', tier: 5, rps: 30000, status: 'healthy' },
          { id: 'cassandra_db', type: 'database', label: 'Apache Cassandra Cluster', sublabel: 'Wide-Column Sequential Writes', tier: 7, rps: 15000, status: 'healthy' },
          { id: 'push_service', type: 'service', label: 'FCM / APNS Push Worker', sublabel: 'Alerts for Offline Users', tier: 4, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'mobile_clients', to: 'ws_lb', protocol: 'WSS', label: 'Bi-directional TCP Stream' },
          { from: 'ws_lb', to: 'ws_gw1', protocol: 'TCP', label: 'Keep-Alive Socket' },
          { from: 'ws_lb', to: 'ws_gw2', protocol: 'TCP', label: 'Keep-Alive Socket' },
          { from: 'ws_gw1', to: 'presence_redis', protocol: 'TCP', label: 'Lookup User Socket ID' },
          { from: 'ws_gw1', to: 'msg_kafka', protocol: 'TCP', label: 'Publish Outgoing Message' },
          { from: 'msg_kafka', to: 'cassandra_db', protocol: 'TCP', label: 'Async Write-Heavy Persist' },
          { from: 'msg_kafka', to: 'push_service', protocol: 'PubSub', label: 'If Recipient Offline' },
        ],
        explanation: 'Replaces HTTP polling with stateful WebSocket connections managed by dedicated gateways. Redis Pub/Sub maps active sockets for instant routing (<50ms), Apache Kafka guarantees FIFO ordering per chat room, and Cassandra provides sequential log storage.',
      },
    },
    testCases: [
      { input: 'User sends message to offline friend', expected: 'Saved to Cassandra + FCM Push triggered' },
      { input: 'Reconnecting after tunnel disconnect', expected: 'Fetches unread messages using conversation timestamp cursor' },
    ],
    benchmarkSolution: {
      transport: 'WebSocket (WSS) over TCP Layer-4 load balancing',
      sessionState: 'Redis Pub/Sub + distributed ephemeral session map',
      historyStore: 'Apache Cassandra with clustering key (conversation_id, message_id)',
    },
    xpReward: 125,
    orderIndex: 9,
  },
  {
    id: 'sys-ch-10',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design Twitter / X Newsfeed (Fan-out Engine)',
    slug: 'twitter-newsfeed-system',
    problemStatement:
      'Design a scalable social newsfeed system handling 60,000 feed generation requests/sec. Solve the classic Fan-out on Write vs Fan-out on Read trade-off. Prevent celebrity accounts with 100M+ followers from overwhelming worker message queues during new tweet postings.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          feedRps: 60000,
          generationStrategy: 'On-demand SQL JOIN tweets ON follows on every page refresh',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 60000,
      maxLatencyMs: 80,
      category: 'Real-Time Streaming & Social',
      nodes: [
        { id: 'tweeters', type: 'client', label: 'Active Tweeters & Readers', tier: 1, rps: 60000, status: 'healthy' },
        { id: 'feed_monolith', type: 'service', label: 'Feed Web App', tier: 4, rps: 60000, isSPOF: true, status: 'healthy' },
        { id: 'relational_sql', type: 'database', label: 'Relational DB', sublabel: 'O(N*M) Join on Every Refresh', tier: 7, rps: 60000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'tweeters', to: 'feed_monolith', protocol: 'HTTPS', label: '60,000 RPS' },
        { from: 'feed_monolith', to: 'relational_sql', protocol: 'SQL', label: 'SELECT * FROM tweets JOIN follows' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'tweeters', type: 'client', label: 'Feed Readers & Authors', tier: 1, rps: 60000, status: 'healthy' },
          { id: 'ingress_lb', type: 'load_balancer', label: 'Nginx Anycast Gateway', tier: 3, rps: 60000, status: 'healthy' },
          { id: 'tweet_ingest', type: 'service', label: 'Tweet Ingestion API', sublabel: 'Write Path', tier: 4, rps: 8000, status: 'healthy' },
          { id: 'feed_reader', type: 'service', label: 'Timeline Reader API', sublabel: 'Read Path (Sub-20ms)', tier: 4, rps: 52000, status: 'healthy' },
          { id: 'fanout_queue', type: 'queue', label: 'Kafka Fan-out Topic', sublabel: 'Async Follower Distribution', tier: 5, rps: 8000, status: 'healthy' },
          { id: 'fanout_workers', type: 'worker', label: 'Fan-out Workers (Hybrid)', sublabel: 'Push for normal, Pull for VIPs', tier: 4, rps: 8000, status: 'healthy' },
          { id: 'redis_timeline', type: 'cache', label: 'Redis Timeline Cache (ZSET)', sublabel: 'Top 800 Tweet IDs per user', tier: 6, rps: 52000, hitRate: 94, status: 'healthy' },
          { id: 'tweet_store', type: 'database', label: 'Distributed Cassandra DB', sublabel: 'Raw Tweet Payloads', tier: 7, rps: 10000, status: 'healthy' },
          { id: 'graph_service', type: 'service', label: 'Social Graph Service', sublabel: 'Follower Relationships', tier: 4, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'tweeters', to: 'ingress_lb', protocol: 'HTTPS', label: 'Read/Write Ingress' },
          { from: 'ingress_lb', to: 'tweet_ingest', protocol: 'gRPC', label: 'POST /tweet' },
          { from: 'ingress_lb', to: 'feed_reader', protocol: 'gRPC', label: 'GET /timeline' },
          { from: 'tweet_ingest', to: 'fanout_queue', protocol: 'TCP', label: 'Queue New Tweet' },
          { from: 'fanout_queue', to: 'fanout_workers', protocol: 'PubSub', label: 'Distribute' },
          { from: 'fanout_workers', to: 'redis_timeline', protocol: 'TCP', label: 'LPUSH to Follower ZSETs' },
          { from: 'feed_reader', to: 'redis_timeline', protocol: 'TCP', label: 'Instant ZRANGEBYSCORE' },
          { from: 'feed_reader', to: 'tweet_store', protocol: 'TCP', label: 'Hydrate Tweet Cards' },
        ],
        explanation: 'Implements a hybrid fan-out model: standard users push tweets into followers Redis Sorted Sets (pre-computed feeds), while celebrity tweets (>50k followers) are pulled dynamically on read. This prevents queue explosions while guaranteeing sub-20ms timeline loads.',
      },
    },
    testCases: [
      { input: 'Normal user posts tweet', expected: 'Pushed to followers Redis timelines in < 1s' },
      { input: 'Celebrity with 100M followers tweets', expected: 'Hybrid pull bypasses queue; merged at read time' },
    ],
    benchmarkSolution: {
      cache: 'Redis Sorted Sets storing (tweet_id, timestamp_score)',
      fanoutModel: 'Hybrid Push-Pull architecture',
      storage: 'Cassandra cluster partitioned by user_id and tweet_id',
    },
    xpReward: 130,
    orderIndex: 10,
  },
  {
    id: 'sys-ch-11',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design Netflix / YouTube Video Streaming Platform',
    slug: 'netflix-video-streaming',
    problemStatement:
      'Design a video on demand (VOD) streaming infrastructure streaming 100,000 concurrent video sessions. Support multi-bitrate adaptive streaming (HLS/DASH), asynchronous distributed transcoding pipelines for 4K/1080p/720p chunks, and multi-tier Edge CDN caching with 98% offload.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          concurrentStreams: 100000,
          videoDelivery: 'Single origin web server serving 10GB raw MP4 video files',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 100000,
      maxLatencyMs: 30,
      category: 'Real-Time Streaming & Social',
      nodes: [
        { id: 'viewers', type: 'client', label: '100,000 TV & Mobile Streamers', tier: 1, rps: 100000, status: 'healthy' },
        { id: 'origin_web', type: 'service', label: 'Origin Streaming Server', sublabel: 'Bandwidth Saturation (100Gbps Cap)', tier: 4, rps: 100000, isSPOF: true, status: 'down' },
        { id: 'local_disk', type: 'storage', label: 'Local Server SSD Array', tier: 7, rps: 100000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'viewers', to: 'origin_web', protocol: 'HTTPS', label: '100,000 Raw MP4 Streams' },
        { from: 'origin_web', to: 'local_disk', protocol: 'POSIX', label: 'Disk IOPS Bottleneck' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'viewers', type: 'client', label: 'Global Video Streamers (100k)', tier: 1, rps: 100000, status: 'healthy' },
          { id: 'open_connect_cdn', type: 'cdn', label: 'Open Connect CDN Appliance', sublabel: 'Edge ISP Caching (98% Hit)', tier: 2, rps: 100000, hitRate: 98, status: 'healthy' },
          { id: 'api_gateway', type: 'load_balancer', label: 'Netflix API Gateway', sublabel: 'Auth, Profile, License DRM', tier: 3, rps: 5000, status: 'healthy' },
          { id: 'meta_service', type: 'service', label: 'Playback Metadata Service', sublabel: 'HLS Manifest (.m3u8) Generator', tier: 4, rps: 5000, status: 'healthy' },
          { id: 'transcode_queue', type: 'queue', label: 'Kafka Transcoding Stream', sublabel: 'Video Chunks Priority Queue', tier: 5, rps: 1000, status: 'healthy' },
          { id: 'gpu_workers', type: 'worker', label: 'GPU Transcoder Fleet (AWS EC2)', sublabel: 'HLS / DASH (4K, 1080p, 720p)', tier: 4, rps: 1000, status: 'healthy' },
          { id: 's3_master_bucket', type: 'storage', label: 'AWS S3 Master Video Lake', sublabel: 'Raw & Encoded TS Chunks', tier: 7, rps: 2000, status: 'healthy' },
          { id: 'dynamo_catalog', type: 'database', label: 'DynamoDB Video Catalog', sublabel: 'Media Metadata & User History', tier: 7, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'viewers', to: 'open_connect_cdn', protocol: 'HTTPS', label: 'Stream .ts Video Chunks (Edge)' },
          { from: 'viewers', to: 'api_gateway', protocol: 'HTTPS', label: 'Fetch .m3u8 Manifest' },
          { from: 'api_gateway', to: 'meta_service', protocol: 'gRPC', label: 'Get Bitrate Profile' },
          { from: 'meta_service', to: 'dynamo_catalog', protocol: 'HTTPS', label: 'User Progress Sync' },
          { from: 'open_connect_cdn', to: 's3_master_bucket', protocol: 'HTTPS', label: '2% Edge Miss Refetch' },
          { from: 'transcode_queue', to: 'gpu_workers', protocol: 'PubSub', label: 'Encoding Task' },
          { from: 'gpu_workers', to: 's3_master_bucket', protocol: 'HTTPS', label: 'Upload 6-second Chunks' },
        ],
        explanation: 'Offloads 98% of video bandwidth directly to ISP Edge CDN appliances. Videos are split into 6-second chunked files encoded into multiple resolutions via asynchronous GPU worker fleets, allowing clients to adapt bitrate smoothly based on fluctuating WiFi signal.',
      },
    },
    testCases: [
      { input: 'User enters bad network connection', expected: 'Adaptive bitrate steps down from 4K to 720p seamlessly' },
      { input: 'Popular release launch', expected: 'Edge CDN caches 98%+ bandwidth, preserving Origin S3' },
    ],
    benchmarkSolution: {
      delivery: 'Multi-CDN (Open Connect + Akamai) with HLS / MPEG-DASH chunking',
      transcoding: 'Asynchronous GPU micro-chunking pipeline via Kafka + S3',
      metadata: 'DynamoDB multi-region replication for fast catalog lookups',
    },
    xpReward: 120,
    orderIndex: 11,
  },
  {
    id: 'sys-ch-12',
    moduleId: '20000000-0000-0000-0000-000000000005',
    title: 'Design Google Docs (Collaborative Real-Time Editor)',
    slug: 'collaborative-doc-editor',
    problemStatement:
      'Design a collaborative real-time document editing service enabling concurrent multi-user typing within the same document without overwriting text. Resolve edit conflicts using Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDT), stream cursor presence, and take background snapshots.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          conflictResolution: 'Last Write Wins (Overwrites user typing concurrently!)',
          transport: 'HTTP POST document text every 200ms',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 20000,
      maxLatencyMs: 25,
      category: 'Real-Time Streaming & Social',
      nodes: [
        { id: 'editors', type: 'client', label: 'Concurrent Document Authors', tier: 1, rps: 20000, status: 'healthy' },
        { id: 'doc_server', type: 'service', label: 'Standard REST Server', sublabel: 'Last-Write-Wins Race Condition', tier: 4, rps: 20000, isSPOF: true, status: 'healthy' },
        { id: 'doc_db', type: 'database', label: 'MySQL Document Table', sublabel: 'Whole Text Overwrites', tier: 7, rps: 20000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'editors', to: 'doc_server', protocol: 'HTTPS', label: 'HTTP POST entire doc body' },
        { from: 'doc_server', to: 'doc_db', protocol: 'SQL', label: 'Data Corruption & Lost Edits' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'editors', type: 'client', label: 'Active Editors & Collaborators', tier: 1, rps: 20000, status: 'healthy' },
          { id: 'wss_lb', type: 'load_balancer', label: 'WSS Load Balancer', sublabel: 'Consistent Document Affinity', tier: 3, rps: 20000, status: 'healthy' },
          { id: 'ot_engine1', type: 'service', label: 'OT / CRDT Room Coordinator #1', sublabel: 'In-Memory State Machine', tier: 4, rps: 10000, status: 'healthy' },
          { id: 'ot_engine2', type: 'service', label: 'OT / CRDT Room Coordinator #2', sublabel: 'In-Memory State Machine', tier: 4, rps: 10000, status: 'healthy' },
          { id: 'redis_room', type: 'cache', label: 'Redis Room State & Cursor Sync', sublabel: 'Ephemeral Pointer Locations', tier: 6, rps: 20000, status: 'healthy' },
          { id: 'change_queue', type: 'queue', label: 'Kafka Mutation Log', sublabel: 'Append-Only Operation Stream', tier: 5, rps: 10000, status: 'healthy' },
          { id: 'snapshot_worker', type: 'worker', label: 'Doc Snapshotting Worker Fleet', sublabel: 'Compacts Ops into Snapshots', tier: 4, rps: 1000, status: 'healthy' },
          { id: 's3_doc_history', type: 'storage', label: 'S3 Document Version History', sublabel: 'Compressed Immutable Snapshots', tier: 7, rps: 500, status: 'healthy' },
          { id: 'auth_postgres', type: 'database', label: 'Postgres Permissions DB', sublabel: 'ACLs & Workspace Metadata', tier: 7, rps: 2000, status: 'healthy' },
        ],
        edges: [
          { from: 'editors', to: 'wss_lb', protocol: 'WSS', label: 'Real-Time Keystroke Deltas' },
          { from: 'wss_lb', to: 'ot_engine1', protocol: 'TCP', label: 'Affinity to Doc Channel' },
          { from: 'ot_engine1', to: 'redis_room', protocol: 'TCP', label: 'Broadcast Cursor & Transform' },
          { from: 'ot_engine1', to: 'change_queue', protocol: 'TCP', label: 'Log Ordered Operation' },
          { from: 'change_queue', to: 'snapshot_worker', protocol: 'PubSub', label: 'Every 100 Ops' },
          { from: 'snapshot_worker', to: 's3_doc_history', protocol: 'HTTPS', label: 'Persist Checkpoint' },
          { from: 'ot_engine1', to: 'auth_postgres', protocol: 'SQL', label: 'Validate Access Token' },
        ],
        explanation: 'Transmits atomic operational deltas (insert/delete char at index) over persistent WebSockets to an in-memory Operational Transformation (OT) engine. Operations are sequenced cleanly, while background workers periodically compact the log into S3 snapshots.',
      },
    },
    testCases: [
      { input: 'Two users type at exact same index simultaneously', expected: 'OT transforms operation without dropping characters' },
      { input: 'Network lag causes 3-second offline edit', expected: 'Reconnection reconciles delta against server version vector' },
    ],
    benchmarkSolution: {
      concurrency: 'Operational Transformation (OT) / CRDT (Yjs/Automerge)',
      synchronization: 'WebSocket with session affinity and Redis cursor pub/sub',
      persistence: 'Append-only operation log with periodic S3 compaction snapshots',
    },
    xpReward: 135,
    orderIndex: 12,
  },

  // -------------------------------------------------------------------
  // MODULE 4: Distributed Storage, Infra & Geospatial
  // -------------------------------------------------------------------
  {
    id: 'sys-ch-13',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design Distributed In-Memory Cache (Consistent Hash Ring)',
    slug: 'distributed-in-memory-cache',
    problemStatement:
      'Design an enterprise distributed in-memory caching system handling 100,000 QPS with sub-millisecond lookups. Implement Consistent Hashing with virtual nodes to balance keys uniformly, handle node additions/removals with minimal re-sharding, support LRU eviction, and implement Cache-Aside with stampede protection.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          qps: 100000,
          sharding: 'Modulo hashing: key.hashCode() % N (Cascading cache wipes on node crash!)',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 100000,
      maxLatencyMs: 2,
      category: 'Distributed Infra & Geospatial',
      nodes: [
        { id: 'app_servers', type: 'client', label: 'App Servers (100k Queries)', tier: 1, rps: 100000, status: 'healthy' },
        { id: 'single_cache', type: 'cache', label: 'Single Redis Node', sublabel: 'Single Point of Failure (SPOF)', tier: 6, rps: 100000, isSPOF: true, status: 'healthy' },
        { id: 'db_backend', type: 'database', label: 'Postgres DB Master', sublabel: 'Will melt if cache dies', tier: 7, rps: 10000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'app_servers', to: 'single_cache', protocol: 'TCP', label: '100k Lookups / sec' },
        { from: 'single_cache', to: 'db_backend', protocol: 'SQL', label: 'Stampede Vulnerability' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'app_servers', type: 'client', label: 'Stateless Application Tier', tier: 1, rps: 100000, status: 'healthy' },
          { id: 'hash_ring_client', type: 'service', label: 'Consistent Hash Router', sublabel: '256 Virtual Nodes per shard', tier: 4, rps: 100000, status: 'healthy' },
          { id: 'shard_1', type: 'cache', label: 'Redis Shard #1 (Master)', sublabel: 'Keys [0 - 2^32/3]', tier: 6, rps: 33000, status: 'healthy' },
          { id: 'shard_2', type: 'cache', label: 'Redis Shard #2 (Master)', sublabel: 'Keys [2^32/3 - 2*2^32/3]', tier: 6, rps: 34000, status: 'healthy' },
          { id: 'shard_3', type: 'cache', label: 'Redis Shard #3 (Master)', sublabel: 'Keys [2*2^32/3 - 2^32]', tier: 6, rps: 33000, status: 'healthy' },
          { id: 'replica_1', type: 'cache', label: 'Replica #1 (Async Sync)', sublabel: 'Auto Failover via Sentinel', tier: 6, rps: 0, status: 'healthy' },
          { id: 'replica_2', type: 'cache', label: 'Replica #2 (Async Sync)', sublabel: 'Auto Failover via Sentinel', tier: 6, rps: 0, status: 'healthy' },
          { id: 'replica_3', type: 'cache', label: 'Replica #3 (Async Sync)', sublabel: 'Auto Failover via Sentinel', tier: 6, rps: 0, status: 'healthy' },
          { id: 'db_backend', type: 'database', label: 'Persistent Database Cluster', sublabel: 'Protected from stampedes', tier: 7, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'app_servers', to: 'hash_ring_client', protocol: 'gRPC', label: 'Key Lookup' },
          { from: 'hash_ring_client', to: 'shard_1', protocol: 'TCP', label: 'Virtual Node Routing' },
          { from: 'hash_ring_client', to: 'shard_2', protocol: 'TCP', label: 'Virtual Node Routing' },
          { from: 'hash_ring_client', to: 'shard_3', protocol: 'TCP', label: 'Virtual Node Routing' },
          { from: 'shard_1', to: 'replica_1', protocol: 'TCP', label: 'Replication Stream' },
          { from: 'shard_2', to: 'replica_2', protocol: 'TCP', label: 'Replication Stream' },
          { from: 'shard_3', to: 'replica_3', protocol: 'TCP', label: 'Replication Stream' },
          { from: 'hash_ring_client', to: 'db_backend', protocol: 'SQL', label: 'Mutex Lock on Miss (Anti-Stampede)' },
        ],
        explanation: 'Distributes cache keys across shards using Consistent Hashing with 256 virtual nodes to guarantee uniform memory allocation. Adding or removing a shard only moves K/N keys rather than invalidating the entire cache, and Mutex locking eliminates cache stampedes.',
      },
    },
    testCases: [
      { input: 'Add new cache node into cluster', expected: 'Only 1/N keys re-mapped; zero cache stampede' },
      { input: 'Shard 1 hardware crash', expected: 'Redis Sentinel promotes Replica #1 in < 3 seconds' },
    ],
    benchmarkSolution: {
      partitioning: 'Consistent Hash Ring with MurmurHash3 and 256 Virtual Nodes',
      eviction: 'Volatile-LRU with Probabilistic Early Expiration (XFetch)',
      redundancy: 'Redis Sentinel Active-Standby automated failover',
    },
    xpReward: 110,
    orderIndex: 13,
  },
  {
    id: 'sys-ch-14',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design Key-Value Store with Dynamo Partitioning & Quorum',
    slug: 'dynamo-key-value-store',
    problemStatement:
      'Design a highly available distributed Key-Value store modeled after Amazon Dynamo. Support tunable consistency via Quorum consensus (N, W, R), resolve concurrent update conflicts using Vector Clocks, and ensure data durability across network partitions with Sloppy Quorum, Hinted Handoff, and Anti-Entropy Merkle trees.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          consensus: 'Single Leader with synchronous write wait',
          partitionTolerance: 'Zero (System stops all writes during network partition)',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 45000,
      maxLatencyMs: 15,
      category: 'Distributed Infra & Geospatial',
      nodes: [
        { id: 'clients', type: 'client', label: 'Global API Clients', tier: 1, rps: 45000, status: 'healthy' },
        { id: 'single_leader', type: 'service', label: 'Single Master Coordinator', sublabel: 'Single Point of Failure', tier: 4, rps: 45000, isSPOF: true, status: 'healthy' },
        { id: 'disk_store', type: 'storage', label: 'Local Disk DB', tier: 7, rps: 45000, isSPOF: true, status: 'healthy' },
      ],
      edges: [
        { from: 'clients', to: 'single_leader', protocol: 'HTTPS', label: '45,000 Write/Read RPS' },
        { from: 'single_leader', to: 'disk_store', protocol: 'POSIX', label: 'Single Master I/O Cap' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'clients', type: 'client', label: 'Distributed Clients', tier: 1, rps: 45000, status: 'healthy' },
          { id: 'coordinator', type: 'service', label: 'Anycast Coordinator Node', sublabel: 'Decentralized Gossip Ring', tier: 4, rps: 45000, status: 'healthy' },
          { id: 'node_a', type: 'database', label: 'Storage Node A (Replica 1)', sublabel: 'LSM-Tree + SSTable Engine', tier: 7, rps: 15000, status: 'healthy' },
          { id: 'node_b', type: 'database', label: 'Storage Node B (Replica 2)', sublabel: 'LSM-Tree + SSTable Engine', tier: 7, rps: 15000, status: 'healthy' },
          { id: 'node_c', type: 'database', label: 'Storage Node C (Replica 3)', sublabel: 'LSM-Tree + SSTable Engine', tier: 7, rps: 15000, status: 'healthy' },
          { id: 'hinted_handoff', type: 'worker', label: 'Hinted Handoff Buffer', sublabel: 'Holds writes for offline nodes', tier: 4, rps: 500, status: 'healthy' },
          { id: 'merkle_sync', type: 'worker', label: 'Anti-Entropy Merkle Sweeper', sublabel: 'Gossip Sync & Tree Hash Diff', tier: 4, rps: 200, status: 'healthy' },
        ],
        edges: [
          { from: 'clients', to: 'coordinator', protocol: 'gRPC', label: 'Put(k,v) / Get(k)' },
          { from: 'coordinator', to: 'node_a', protocol: 'TCP', label: 'Quorum Write (W=2)' },
          { from: 'coordinator', to: 'node_b', protocol: 'TCP', label: 'Quorum Write (W=2)' },
          { from: 'coordinator', to: 'node_c', protocol: 'TCP', label: 'Quorum Write (W=2)' },
          { from: 'coordinator', to: 'hinted_handoff', protocol: 'TCP', label: 'If Node C Unreachable' },
          { from: 'merkle_sync', to: 'node_a', protocol: 'TCP', label: 'Background Sync' },
          { from: 'merkle_sync', to: 'node_b', protocol: 'TCP', label: 'Background Sync' },
        ],
        explanation: 'Implements an AP decentralized architecture (Amazon Dynamo paper): writes succeed whenever Quorum W=2 nodes acknowledge out of N=3 replicas (R+W > N). If a replica disconnects, Hinted Handoff stores updates locally until recovery, and Merkle Trees reconcile partitions in the background.',
      },
    },
    testCases: [
      { input: 'Network partition cuts Node C off', expected: 'Writes continue without loss via W=2 quorum & Hinted Handoff' },
      { input: 'Concurrent writes to same key on two nodes', expected: 'Vector Clocks detect conflict; resolved via LWW or client merge' },
    ],
    benchmarkSolution: {
      consensus: 'Tunable Quorum (N=3, W=2, R=2 ensures strong consistency)',
      conflictResolution: 'Vector Clocks + Merkle Anti-Entropy synchronization',
      storageEngine: 'Log-Structured Merge-tree (LSM) with SSTables and MemTable',
    },
    xpReward: 130,
    orderIndex: 14,
  },
  {
    id: 'sys-ch-15',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design Uber / Grab Geospatial Ride Dispatcher',
    slug: 'uber-geospatial-dispatcher',
    problemStatement:
      'Design a real-time ride matching and location tracking system processing 40,000 driver GPS pings per second. Find the top 10 nearest available drivers to a rider in under 50ms. Scale geospatial queries efficiently without full database table scans using Uber H3 hexagonal spatial indexes or Redis Geohashing.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          gpsIngestionRps: 40000,
          driverQuery: 'SELECT * FROM drivers WHERE sqrt((lat-x)^2 + (lon-y)^2) < 5km',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 40000,
      maxLatencyMs: 50,
      category: 'Distributed Infra & Geospatial',
      nodes: [
        { id: 'drivers', type: 'client', label: '40,000 Drivers (GPS Updates)', tier: 1, rps: 40000, status: 'healthy' },
        { id: 'dispatch_api', type: 'service', label: 'Dispatch Backend API', tier: 4, rps: 40000, isSPOF: true, status: 'healthy' },
        { id: 'sql_db', type: 'database', label: 'MySQL Database', sublabel: 'Full Table Scan Distance Math', tier: 7, rps: 40000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'drivers', to: 'dispatch_api', protocol: 'HTTPS', label: '40,000 GPS Pings/sec' },
        { from: 'dispatch_api', to: 'sql_db', protocol: 'SQL', label: 'Unindexed Geo Calculations' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'drivers', type: 'client', label: 'Driver GPS Devices (40k)', tier: 1, rps: 40000, status: 'healthy' },
          { id: 'ingress_gw', type: 'load_balancer', label: 'Netty WebSocket Ingress Gateway', sublabel: 'Compact Protocol Buffer Stream', tier: 3, rps: 40000, status: 'healthy' },
          { id: 'kafka_location', type: 'queue', label: 'Kafka Driver Location Stream', sublabel: 'Partitioned by Uber H3 Hex Cell', tier: 5, rps: 40000, status: 'healthy' },
          { id: 'spatial_redis', type: 'cache', label: 'Redis Geospatial Index (H3 Cells)', sublabel: 'GEOADD & GEORADIUS < 5ms', tier: 6, rps: 40000, status: 'healthy' },
          { id: 'matching_engine', type: 'service', label: 'Ride Dispatch Matcher (x6)', sublabel: 'ETA Calculation & Dispatch Offer', tier: 4, rps: 5000, status: 'healthy' },
          { id: 'trip_postgres', type: 'database', label: 'PostgreSQL Trip Ledger', sublabel: 'PostGIS Spatial Engine & Audits', tier: 7, rps: 2000, status: 'healthy' },
          { id: 'rider_client', type: 'client', label: 'Riders Requesting Pickup', tier: 1, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'drivers', to: 'ingress_gw', protocol: 'WSS', label: 'GPS Pings Every 4s' },
          { from: 'ingress_gw', to: 'kafka_location', protocol: 'TCP', label: 'Publish Stream' },
          { from: 'kafka_location', to: 'spatial_redis', protocol: 'TCP', label: 'Update Driver Coordinates' },
          { from: 'rider_client', to: 'matching_engine', protocol: 'HTTPS', label: 'Request Ride (lat, lon)' },
          { from: 'matching_engine', to: 'spatial_redis', protocol: 'TCP', label: 'Query Ring-1 H3 Hexagons' },
          { from: 'matching_engine', to: 'trip_postgres', protocol: 'SQL', label: 'Commit Accepted Trip' },
        ],
        explanation: 'Divides the globe into discrete hexagonal spatial cells using Uber H3 or Redis Geohashing. Rather than computing distance formulas over millions of database rows, the matcher queries only neighboring H3 cells in Redis memory in <5ms.',
      },
    },
    testCases: [
      { input: '40,000 GPS pings/sec', expected: 'Redis memory coordinates updated with < 10ms latency' },
      { input: 'Rider searches for nearby cars', expected: 'GEORADIUS returns 10 closest drivers in < 15ms' },
    ],
    benchmarkSolution: {
      spatialIndexing: 'Uber H3 Hexagonal Grid / Redis GEOADD & GEORADIUSBYMEMBER',
      streaming: 'Kafka partitioned by Geospatial cell id',
      persistence: 'PostgreSQL with PostGIS for historical trip routes and analytics',
    },
    xpReward: 125,
    orderIndex: 15,
  },
  {
    id: 'sys-ch-16',
    moduleId: '20000000-0000-0000-0000-000000000006',
    title: 'Design Distributed Web Crawler (Googlebot-style)',
    slug: 'distributed-web-crawler',
    problemStatement:
      'Design a web-scale distributed crawler indexing 5,000 web pages per second. Ensure strict politeness (delay between crawls to the same domain), prevent duplicate URL crawling using Bloom Filters, handle circular redirection traps, and store billions of raw HTML pages in distributed Bigtable storage.',
    challengeType: 'system_design',
    starterCode: {
      system_design: JSON.stringify(
        {
          crawlingRps: 5000,
          frontier: 'Single python in-memory list (Queue overflow & memory crash)',
        },
        null,
        2
      ),
    },
    initialVisualState: {
      type: 'TOPOLOGY_GRAPH',
      targetRPS: 5000,
      maxLatencyMs: 200,
      category: 'Distributed Infra & Geospatial',
      nodes: [
        { id: 'web_sites', type: 'client', label: 'External Internet Websites', tier: 1, rps: 5000, status: 'healthy' },
        { id: 'crawler_script', type: 'service', label: 'Single Crawler Script', sublabel: 'No Politeness & Memory Leaks', tier: 4, rps: 5000, isSPOF: true, status: 'healthy' },
        { id: 'local_sqlite', type: 'database', label: 'Local SQLite DB', sublabel: 'Database Locked Error', tier: 7, rps: 5000, isSPOF: true, status: 'down' },
      ],
      edges: [
        { from: 'crawler_script', to: 'web_sites', protocol: 'HTTPS', label: 'Aggressive Unbounded Fetching' },
        { from: 'crawler_script', to: 'local_sqlite', protocol: 'SQL', label: 'Disk Bottleneck' },
      ],
      benchmarkTopology: {
        nodes: [
          { id: 'web_sites', type: 'client', label: 'Public Internet Web Servers', tier: 1, rps: 5000, status: 'healthy' },
          { id: 'url_frontier', type: 'queue', label: 'URL Frontier (Priority Queues)', sublabel: 'Politeness & Host Delay Manager', tier: 5, rps: 5000, status: 'healthy' },
          { id: 'bloom_filter', type: 'cache', label: 'Redis Distributed Bloom Filter', sublabel: 'Visited URLs (0.01% False Pos)', tier: 6, rps: 10000, status: 'healthy' },
          { id: 'dns_cache', type: 'cache', label: 'Local DNS Resolver Cache', sublabel: 'Avoids external DNS stalls', tier: 6, rps: 5000, status: 'healthy' },
          { id: 'fetcher_fleet', type: 'worker', label: 'Fetcher Worker Pods (x20)', sublabel: 'Async HTTP/2 with Robots.txt', tier: 4, rps: 5000, status: 'healthy' },
          { id: 'parser_dedup', type: 'worker', label: 'HTML Parser & SimHash Dedup', sublabel: 'Extracts links & finger-prints', tier: 4, rps: 5000, status: 'healthy' },
          { id: 'bigtable_store', type: 'storage', label: 'Google Cloud Bigtable / HBase', sublabel: 'Document Web Repository', tier: 7, rps: 5000, status: 'healthy' },
        ],
        edges: [
          { from: 'url_frontier', to: 'fetcher_fleet', protocol: 'TCP', label: 'Dispatch Polite URL' },
          { from: 'fetcher_fleet', to: 'dns_cache', protocol: 'UDP', label: 'Fast IP Resolution' },
          { from: 'fetcher_fleet', to: 'web_sites', protocol: 'HTTPS', label: 'Fetch HTML with Respect to robots.txt' },
          { from: 'fetcher_fleet', to: 'parser_dedup', protocol: 'TCP', label: 'Stream Raw HTML Body' },
          { from: 'parser_dedup', to: 'bloom_filter', protocol: 'TCP', label: 'Has URL Been Crawled?' },
          { from: 'parser_dedup', to: 'url_frontier', protocol: 'TCP', label: 'Enqueue New Links' },
          { from: 'parser_dedup', to: 'bigtable_store', protocol: 'TCP', label: 'Persist Document Record' },
        ],
        explanation: 'Employs a URL Frontier separating priority queues from politeness queues per domain. Distributed Bloom Filters in Redis filter out already-crawled URLs in O(1) time without querying database disks, and Bigtable stores raw crawled pages reliably.',
      },
    },
    testCases: [
      { input: 'Spider trap / infinite link cycle', expected: 'Bloom filter + URL depth cutoff prevents infinite loops' },
      { input: '1,000 links on same target domain', expected: 'Politeness queue limits requests to 1 req / 500ms per host' },
    ],
    benchmarkSolution: {
      deduplication: 'Redis Bloom Filters + SimHash for near-duplicate content detection',
      frontier: 'Mercator URL Frontier with Host Politeness Queues',
      storage: 'Google Cloud Bigtable with compression',
    },
    xpReward: 120,
    orderIndex: 16,
  },
];
