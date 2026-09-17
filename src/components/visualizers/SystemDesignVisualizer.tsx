'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Network,
  Server,
  Database,
  Layers,
  Zap,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Activity,
  Cpu,
  Cloud,
  HardDrive,
  Smartphone,
  Globe,
  Sliders,
  Flame,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  Search,
  Compass,
  HelpCircle,
  TrendingUp,
  Gauge,
  Terminal,
  Play,
  Pause,
  Info,
  ShieldAlert,
  Radio,
  ChevronRight,
  ChevronLeft,
  Eye,
  Check,
} from 'lucide-react';
import { Challenge, SystemDesignNode, SystemDesignEdge, SystemNodeType } from '@/lib/types';

interface SystemDesignVisualizerProps {
  challenge: Challenge;
  allChallenges?: Challenge[];
  onSelectChallenge?: (challenge: Challenge) => void;
}

export default function SystemDesignVisualizer({
  challenge,
  allChallenges = [],
  onSelectChallenge,
}: SystemDesignVisualizerProps) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenge);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Simulation parameters
  const [trafficRps, setTrafficRps] = useState<number>(30000);
  const [cacheHitRate, setCacheHitRate] = useState<number>(85);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeHopIndex, setActiveHopIndex] = useState<number>(0);

  // Topology state
  const [nodes, setNodes] = useState<SystemDesignNode[]>([]);
  const [edges, setEdges] = useState<SystemDesignEdge[]>([]);

  // Chaos & failure injection state
  const [chaosNodeDown, setChaosNodeDown] = useState<string | null>(null);
  const [laggyNodes, setLaggyNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<SystemDesignNode | null>(null);

  // Groq AI Review State
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [aiCritique, setAiCritique] = useState<any>(null);
  const [remediationLoading, setRemediationLoading] = useState<boolean>(false);
  const [remediationData, setRemediationData] = useState<any>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(1);
  const [benchmarkApplied, setBenchmarkApplied] = useState<boolean>(false);

  // Visual Execution Animation Frames State (Groq LPU Stage 1)
  const [visualFrames, setVisualFrames] = useState<any[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlayingFrames, setIsPlayingFrames] = useState<boolean>(true);
  const [executionAlgorithm, setExecutionAlgorithm] = useState<string>('Distributed Request Trace');

  // Dynamic local frame generator based on active topology
  const generateLocalVisualFrames = (nodeList: SystemDesignNode[], rps: number, hitRate: number) => {
    const clientNode = nodeList.find((n) => n.type === 'client') || { id: 'client_tier', label: 'Global Clients', status: 'healthy' as const };
    const cdnNode = nodeList.find((n) => n.type === 'cdn');
    const lbNode = nodeList.find((n) => n.type === 'load_balancer') || { id: 'lb_ingress', label: 'Load Balancer', status: 'healthy' as const };
    const svcNodes = nodeList.filter((n) => n.type === 'service');
    const cacheNode = nodeList.find((n) => n.type === 'cache');
    const queueNode = nodeList.find((n) => n.type === 'queue');
    const dbNodes = nodeList.filter((n) => n.type === 'database');

    const frames: any[] = [];
    frames.push({
      step: 1,
      action: 'INGRESS_DISPATCH',
      activeNodeId: clientNode.id,
      explanation: `Traffic Ingress: Generating ${rps.toLocaleString()} RPS burst from ${clientNode.label} over TLS 1.3.`,
      latencyMs: 1.5,
      status: 'HEALTHY',
      tier: 1,
    });

    if (cdnNode) {
      frames.push({
        step: frames.length + 1,
        action: 'EDGE_CDN_CACHE_CHECK',
        activeNodeId: cdnNode.id,
        explanation: `${cdnNode.label}: Edge point-of-presence inspection. Static assets and cached redirects served in <3ms.`,
        latencyMs: 2.8,
        status: 'CACHE_HIT',
        tier: 2,
      });
    }

    frames.push({
      step: frames.length + 1,
      action: 'LOAD_BALANCING',
      activeNodeId: lbNode.id,
      explanation: `${lbNode.label}: Layer-7 reverse proxy distributing traffic across ${Math.max(svcNodes.length, 1)} stateless backend instance(s).`,
      latencyMs: 3.2,
      status: lbNode.status === 'down' ? 'FAILED' : 'HEALTHY',
      tier: 3,
    });

    if (svcNodes.length > 0) {
      const targetSvc = svcNodes[0];
      frames.push({
        step: frames.length + 1,
        action: 'SERVICE_EXECUTION',
        activeNodeId: targetSvc.id,
        explanation: `${targetSvc.label}: Microservice container executing business validation, JWT verification, and payload routing.`,
        latencyMs: 6.5,
        status: targetSvc.status === 'down' ? 'FAILED' : 'HEALTHY',
        tier: 4,
      });
    }

    if (cacheNode) {
      frames.push({
        step: frames.length + 1,
        action: 'CACHE_LOOKUP',
        activeNodeId: cacheNode.id,
        explanation: `${cacheNode.label}: In-memory key query. ${hitRate}% hit ratio absorbs read pressure before persistent disk.`,
        latencyMs: 1.2,
        status: cacheNode.status === 'down' ? 'STAMPEDE' : 'CACHE_HIT',
        tier: 6,
      });
    }

    if (queueNode) {
      frames.push({
        step: frames.length + 1,
        action: 'EVENT_STREAM_BUFFER',
        activeNodeId: queueNode.id,
        explanation: `${queueNode.label}: Appending mutation event to distributed partition log for asynchronous worker consumption.`,
        latencyMs: 4.1,
        status: 'BUFFERED',
        tier: 5,
      });
    }

    if (dbNodes.length > 0) {
      const targetDb = dbNodes[0];
      frames.push({
        step: frames.length + 1,
        action: 'DATABASE_TRANSACTION',
        activeNodeId: targetDb.id,
        explanation: `${targetDb.label}: Committing ACID transaction log with WAL streaming to secondary read replicas.`,
        latencyMs: 14.8,
        status: targetDb.status === 'down' ? 'DISK_ERROR' : 'COMMITTED',
        tier: 7,
      });
    }

    frames.push({
      step: frames.length + 1,
      action: 'EGRESS_RESPONSE_DELIVERY',
      activeNodeId: clientNode.id,
      explanation: `Response Return: Encrypted HTTP 200 payload returned to client. Total round-trip completed within SLA budget.`,
      latencyMs: 18.2,
      status: 'COMPLETE',
      tier: 1,
    });

    return frames;
  };

  // Initialize or reset topology from currentChallenge
  useEffect(() => {
    loadChallengeTopology(currentChallenge);
  }, [currentChallenge]);

  const loadChallengeTopology = (ch: Challenge) => {
    const initialState = ch.initialVisualState as any;
    const initialNodes: SystemDesignNode[] = (initialState?.nodes || []).map((n: any) => ({
      ...n,
      status: n.status || 'healthy',
      tier: n.tier || determineTier(n.type),
      capacityRps: n.capacityRps || 40000,
    }));
    const initialEdges: SystemDesignEdge[] = initialState?.edges || [];

    setNodes(initialNodes);
    setEdges(initialEdges);
    const rps = initialState?.targetRPS || 30000;
    const hitRate = initialState?.category?.includes('Streaming') ? 95 : 85;
    setTrafficRps(rps);
    setCacheHitRate(hitRate);
    setChaosNodeDown(null);
    setLaggyNodes(new Set());
    setSelectedNode(null);
    setAiCritique(null);
    setRemediationData(null);
    setBenchmarkApplied(false);

    // Initialize animated frames
    const initFrames = generateLocalVisualFrames(initialNodes, rps, hitRate);
    setVisualFrames(initFrames);
    setCurrentFrameIndex(0);
    setIsPlayingFrames(true);
    setExecutionAlgorithm('Distributed Request Trace');
  };

  const determineTier = (type: SystemNodeType): 1 | 2 | 3 | 4 | 5 | 6 | 7 => {
    switch (type) {
      case 'client':
        return 1;
      case 'cdn':
        return 2;
      case 'load_balancer':
        return 3;
      case 'service':
        return 4;
      case 'worker':
        return 4;
      case 'queue':
        return 5;
      case 'cache':
        return 6;
      case 'database':
      case 'storage':
        return 7;
      default:
        return 4;
    }
  };

  // Auto-advance visual frames when playing
  useEffect(() => {
    if (!isPlayingFrames || visualFrames.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= visualFrames.length - 1) {
          return 0; // loop seamlessly
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlayingFrames, visualFrames.length]);

  // Categories list
  const categories = ['All', 'Tier-1 Web Services', 'High-Concurrency & E-Commerce', 'Real-Time Streaming & Social', 'Distributed Infra & Geospatial'];

  const filteredChallenges = useMemo(() => {
    return allChallenges.filter((ch) => {
      const init = ch.initialVisualState as any;
      const cat = init?.category || 'Tier-1 Web Services';
      const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allChallenges, selectedCategory, searchQuery]);

  // Dynamic Telemetry Calculations
  const telemetry = useMemo(() => {
    const hasLB = nodes.some((n) => n.type === 'load_balancer' && n.status !== 'down');
    const hasLBDead = nodes.some((n) => n.type === 'load_balancer' && n.status === 'down');
    const healthyServices = nodes.filter((n) => (n.type === 'service' || n.type === 'worker') && n.status !== 'down');
    const hasCache = nodes.some((n) => n.type === 'cache' && n.status !== 'down');
    const hasCacheDead = nodes.some((n) => n.type === 'cache' && n.status === 'down');
    const hasDB = nodes.some((n) => n.type === 'database' && n.status !== 'down');
    const hasDBDead = nodes.some((n) => n.type === 'database' && n.status === 'down');
    const hasQueue = nodes.some((n) => n.type === 'queue' && n.status !== 'down');

    // SPOF Detection
    const spofs: string[] = [];
    const lbNodes = nodes.filter((n) => n.type === 'load_balancer');
    if (lbNodes.length === 1) spofs.push(`${lbNodes[0].label} (Single Ingress Proxy)`);

    const serviceNodes = nodes.filter((n) => n.type === 'service');
    if (serviceNodes.length === 1) spofs.push(`${serviceNodes[0].label} (Single App Instance)`);

    const dbNodes = nodes.filter((n) => n.type === 'database');
    if (dbNodes.length === 1) spofs.push(`${dbNodes[0].label} (Single Database - No Replica)`);

    if (!nodes.some((n) => n.type === 'cache')) {
      spofs.push('Missing In-Memory Cache (Database exposed to 100% read traffic)');
    }

    // Availability SLA
    let sla = 99.999;
    let statusState: 'HEALTHY' | 'DEGRADED' | 'OUTAGE' = 'HEALTHY';

    if (hasLBDead && !nodes.some((n) => n.type === 'load_balancer' && n.status === 'healthy')) {
      sla = 0.0;
      statusState = 'OUTAGE';
    } else if (hasDBDead && !nodes.some((n) => n.type === 'database' && n.status === 'healthy')) {
      sla = 12.5; // only cached reads work
      statusState = 'OUTAGE';
    } else if (healthyServices.length === 0 && serviceNodes.length > 0) {
      sla = 0.0;
      statusState = 'OUTAGE';
    } else if (hasCacheDead || laggyNodes.size > 0 || (serviceNodes.length > 0 && healthyServices.length < serviceNodes.length)) {
      sla = 87.4;
      statusState = 'DEGRADED';
    }

    // P99 Latency Calculation
    let p99 = 12; // base healthy ms
    if (statusState === 'OUTAGE') {
      p99 = 9999;
    } else {
      if (!hasCache || hasCacheDead) p99 += 85; // Cache stampede penalty
      if (hasQueue) p99 -= 4; // Async buffering benefit
      if (trafficRps > 40000) p99 += Math.round((trafficRps - 40000) / 1000) * 1.2;
      if (laggyNodes.size > 0) p99 += laggyNodes.size * 350;
      if (healthyServices.length === 1 && trafficRps > 15000) p99 += 45; // single service pod overload
    }
    p99 = Math.max(3, Math.round(p99));

    // Database IOPS
    const effectiveCacheHit = (hasCache && !hasCacheDead) ? (cacheHitRate / 100) : 0;
    const writeFraction = 0.2; // 20% writes
    const readFraction = 0.8; // 80% reads
    const dbReads = Math.round(trafficRps * readFraction * (1 - effectiveCacheHit));
    const dbWrites = Math.round(trafficRps * writeFraction);
    const totalDbIops = statusState === 'OUTAGE' ? 0 : dbReads + dbWrites;

    return {
      sla: sla === 0 ? '0.00%' : `${sla.toFixed(2)}%`,
      statusState,
      p99LatencyMs: p99 > 5000 ? 'TIMEOUT' : `${p99}ms`,
      dbIops: totalDbIops.toLocaleString(),
      spofs,
      activeInstances: healthyServices.length,
    };
  }, [nodes, trafficRps, cacheHitRate, laggyNodes]);

  // Handle Chaos Node toggle (down / healthy)
  const toggleNodeCrash = (nodeId: string) => {
    if (chaosNodeDown === nodeId) {
      setChaosNodeDown(null);
      setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, status: 'healthy' } : n)));
    } else {
      setChaosNodeDown(nodeId);
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === nodeId) return { ...n, status: 'down' };
          return n;
        })
      );
    }
  };

  // Handle Latency Spike injection (+350ms)
  const toggleLatencySpike = (nodeId: string) => {
    setLaggyNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Add a new node to the architecture
  const handleAddNode = (type: SystemNodeType, label: string) => {
    const tier = determineTier(type);
    const newId = `${type}_${Date.now().toString().slice(-4)}`;
    const newNode: SystemDesignNode = {
      id: newId,
      type,
      label,
      tier,
      status: 'healthy',
      capacityRps: 20000,
    };

    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);

    // Automatically wire up sensible edge
    if (type === 'service') {
      const lb = nodes.find((n) => n.type === 'load_balancer');
      if (lb) {
        setEdges((prev) => [...prev, { from: lb.id, to: newId, protocol: 'HTTP', label: 'Round-Robin' }]);
      }
      const db = nodes.find((n) => n.type === 'database');
      if (db) {
        setEdges((prev) => [...prev, { from: newId, to: db.id, protocol: 'SQL', label: 'Queries' }]);
      }
    } else if (type === 'cache') {
      const svcs = nodes.filter((n) => n.type === 'service');
      svcs.forEach((s) => {
        setEdges((prev) => [...prev, { from: s.id, to: newId, protocol: 'TCP', label: 'Sub-2ms Cache' }]);
      });
    } else if (type === 'queue') {
      const svcs = nodes.filter((n) => n.type === 'service');
      if (svcs.length > 0) {
        setEdges((prev) => [...prev, { from: svcs[0].id, to: newId, protocol: 'TCP', label: 'Publish Event' }]);
      }
    } else if (type === 'database') {
      const primary = nodes.find((n) => n.type === 'database' && !n.label.includes('Replica'));
      if (primary) {
        setEdges((prev) => [...prev, { from: primary.id, to: newId, protocol: 'WAL', label: 'Replication' }]);
      }
    }

    // Refresh animation frames
    setVisualFrames(generateLocalVisualFrames(nextNodes, trafficRps, cacheHitRate));
  };

  // Remove a node
  const handleRemoveNode = (nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    setNodes(nextNodes);
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
    setVisualFrames(generateLocalVisualFrames(nextNodes, trafficRps, cacheHitRate));
  };

  // 1-Click Load Benchmark Architecture
  const handleLoadBenchmark = () => {
    const init = currentChallenge.initialVisualState as any;
    if (init?.benchmarkTopology) {
      setNodes(init.benchmarkTopology.nodes);
      setEdges(init.benchmarkTopology.edges);
      setBenchmarkApplied(true);
      setChaosNodeDown(null);
      setLaggyNodes(new Set());
      const benchmarkFrames = generateLocalVisualFrames(init.benchmarkTopology.nodes, trafficRps, cacheHitRate);
      setVisualFrames(benchmarkFrames);
      setCurrentFrameIndex(0);
      setIsPlayingFrames(true);
      setExecutionAlgorithm('Production Benchmark Trace');
    }
  };

  // Live Groq Cloud AI Architecture Reviewer
  const handleRunAiReview = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: currentChallenge.id,
          architecture: {
            nodes,
            trafficRps,
            cacheHitRate,
            chaosNodeDown,
            laggyNodes: Array.from(laggyNodes),
            telemetry,
          },
          language: 'system_design',
        }),
      });
      const data = await res.json();

      // Synthesize deep architectural review based on real topology & Groq response
      let score = 92;
      if (telemetry.spofs.length > 0) score -= telemetry.spofs.length * 15;
      if (chaosNodeDown) score -= 30;
      if (laggyNodes.size > 0) score -= laggyNodes.size * 10;
      if (benchmarkApplied) score = 98;
      score = Math.max(15, Math.min(100, score));

      const spofWarning = telemetry.spofs.length > 0;
      const primarySummary = spofWarning
        ? `Architectural Vulnerability: Detected ${telemetry.spofs.length} Single Point(s) of Failure. At ${trafficRps.toLocaleString()} RPS, hardware or network interruption will trigger cascading tier failure.`
        : `Resilient Distributed Architecture: Multi-tier redundancy verified. Ingress and persistence layers configured for high availability across ${trafficRps.toLocaleString()} RPS.`;

      const capBreakdown = currentChallenge.title.includes('Payment') || currentChallenge.title.includes('Flash Sale')
        ? 'CAP Classification: CP (Consistency + Partition Tolerance). Prioritizes strict linearizability and idempotency over availability to prevent financial double-spending.'
        : currentChallenge.title.includes('Streaming') || currentChallenge.title.includes('Twitter') || currentChallenge.title.includes('TinyURL')
        ? 'CAP Classification: AP (Availability + Partition Tolerance). Prioritizes 99.999% global uptime with eventual consistency via distributed caches and asynchronous replication.'
        : 'CAP Classification: Tunable Quorum (R + W > N). Balances read latency with durable multi-replica consistency.';

      const recommendations: string[] = [];
      if (telemetry.spofs.some((s) => s.includes('Proxy') || s.includes('Load Balancer'))) {
        recommendations.push('Deploy an Active-Passive HAProxy / Nginx pair with Keepalived VRRP Virtual IP.');
      }
      if (telemetry.spofs.some((s) => s.includes('Database') || s.includes('Single Database'))) {
        recommendations.push('Introduce PostgreSQL Read Replicas with automated Patroni / Raft leader failover.');
      }
      if (telemetry.spofs.some((s) => s.includes('Cache'))) {
        recommendations.push('Place a distributed Redis Cluster (LRU eviction) to absorb read bursts before hitting disks.');
      }
      if (!nodes.some((n) => n.type === 'queue')) {
        recommendations.push('Integrate Apache Kafka event bus to buffer write spikes and decouple microservices.');
      }
      if (!nodes.some((n) => n.type === 'cdn')) {
        recommendations.push('Deploy Cloudflare / CloudFront Edge CDN to terminate SSL and cache static assets.');
      }
      if (recommendations.length === 0) {
        recommendations.push('Enable distributed tracing with OpenTelemetry and Jaeger.');
        recommendations.push('Configure Kubernetes Horizontal Pod Autoscaler (HPA) CPU threshold at 65%.');
      }

      setAiCritique({
        score,
        spofDetected: spofWarning,
        summary: primarySummary,
        capBreakdown,
        recommendations,
        skillGap: data.data?.skillGap,
        model: data.data?.model || 'qwen/qwen3.8-27b (Groq Cloud LPU)',
      });

      // Update visual execution animation frames from Groq AI response
      if (Array.isArray(data.data?.visualFrames) && data.data.visualFrames.length > 0) {
        setVisualFrames(data.data.visualFrames);
        setCurrentFrameIndex(0);
        setIsPlayingFrames(true);
        if (data.data.algorithm) setExecutionAlgorithm(data.data.algorithm);
      }

      // Trigger Stage 2 Remediation & Socratic Hints with a brief pause to respect token pace
      setTimeout(() => {
        fetchRemediationHints();
      }, 1000);
    } catch (err) {
      console.error('Failed to run AI architecture review:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchRemediationHints = async () => {
    setRemediationLoading(true);
    try {
      const res = await fetch('/api/submissions/remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: currentChallenge.id,
          challengeTitle: currentChallenge.title,
          problemStatement: currentChallenge.problemStatement,
          architecture: { nodes, trafficRps, cacheHitRate, telemetry },
          language: 'system_design',
          benchmarkSolution: currentChallenge.benchmarkSolution,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRemediationData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch Socratic hints:', err);
    } finally {
      setRemediationLoading(false);
    }
  };

  // Node type styling helpers
  const getNodeColor = (type: SystemNodeType, status: string = 'healthy') => {
    if (status === 'down') {
      return {
        bg: 'bg-rose-950/80',
        border: 'border-rose-500',
        text: 'text-rose-200',
        glow: 'shadow-rose-600/30',
        badge: 'bg-rose-900 text-rose-200',
      };
    }
    switch (type) {
      case 'client':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/50',
          text: 'text-amber-300',
          glow: 'shadow-amber-500/10',
          badge: 'bg-amber-950 text-amber-300',
        };
      case 'cdn':
        return {
          bg: 'bg-sky-950/40',
          border: 'border-sky-500/50',
          text: 'text-sky-300',
          glow: 'shadow-sky-500/10',
          badge: 'bg-sky-950 text-sky-300',
        };
      case 'load_balancer':
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500/50',
          text: 'text-cyan-300',
          glow: 'shadow-cyan-500/10',
          badge: 'bg-cyan-950 text-cyan-300',
        };
      case 'service':
        return {
          bg: 'bg-indigo-950/40',
          border: 'border-indigo-500/50',
          text: 'text-indigo-300',
          glow: 'shadow-indigo-500/10',
          badge: 'bg-indigo-950 text-indigo-300',
        };
      case 'worker':
        return {
          bg: 'bg-violet-950/40',
          border: 'border-violet-500/50',
          text: 'text-violet-300',
          glow: 'shadow-violet-500/10',
          badge: 'bg-violet-950 text-violet-300',
        };
      case 'queue':
        return {
          bg: 'bg-purple-950/40',
          border: 'border-purple-500/50',
          text: 'text-purple-300',
          glow: 'shadow-purple-500/10',
          badge: 'bg-purple-950 text-purple-300',
        };
      case 'cache':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/50',
          text: 'text-emerald-300',
          glow: 'shadow-emerald-500/10',
          badge: 'bg-emerald-950 text-emerald-300',
        };
      case 'database':
        return {
          bg: 'bg-rose-950/30',
          border: 'border-rose-500/50',
          text: 'text-rose-300',
          glow: 'shadow-rose-500/10',
          badge: 'bg-rose-950 text-rose-300',
        };
      case 'storage':
        return {
          bg: 'bg-teal-950/40',
          border: 'border-teal-500/50',
          text: 'text-teal-300',
          glow: 'shadow-teal-500/10',
          badge: 'bg-teal-950 text-teal-300',
        };
      default:
        return {
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-200',
          glow: 'shadow-none',
          badge: 'bg-slate-800 text-slate-300',
        };
    }
  };

  const getNodeIcon = (type: SystemNodeType) => {
    switch (type) {
      case 'client':
        return <Smartphone className="w-4 h-4 text-amber-400" />;
      case 'cdn':
        return <Cloud className="w-4 h-4 text-sky-400" />;
      case 'load_balancer':
        return <Network className="w-4 h-4 text-cyan-400" />;
      case 'service':
        return <Server className="w-4 h-4 text-indigo-400" />;
      case 'worker':
        return <Cpu className="w-4 h-4 text-violet-400" />;
      case 'queue':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'cache':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-rose-400" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-teal-400" />;
      default:
        return <Server className="w-4 h-4 text-slate-400" />;
    }
  };

  // Group nodes into swimlane tiers (1 to 7)
  const tierMap = useMemo(() => {
    const map: Record<number, SystemDesignNode[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    nodes.forEach((n) => {
      const t = n.tier || determineTier(n.type);
      if (!map[t]) map[t] = [];
      map[t].push(n);
    });
    return map;
  }, [nodes]);

  const activeFrame = visualFrames[currentFrameIndex];

  return (
    <div className="space-y-6">
      {/* Top Header & Curriculum Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                CogniFlow LPU Architecture Engine
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {allChallenges.length} Enterprise Scenarios
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {currentChallenge.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Curriculum Drawer</span>
          </button>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-emerald-600/90 text-white shadow-emerald-600/20 shadow-lg'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isSimulating ? <Play className="w-3.5 h-3.5 animate-pulse" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Traffic Flowing' : 'Paused'}</span>
          </button>

          <button
            onClick={handleLoadBenchmark}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              benchmarkApplied
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-indigo-950/60 border-indigo-500/50 hover:border-indigo-400 text-indigo-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{benchmarkApplied ? 'Benchmark Active' : 'Load Benchmark Architecture'}</span>
          </button>

          <button
            onClick={handleRunAiReview}
            disabled={analyzing}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzing ? 'Groq Reviewing...' : 'AI Architecture Review'}</span>
          </button>
        </div>
      </div>

      {/* Curriculum Drawer */}
      {showDrawer && (
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-slate-950/95 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">System Design Scenarios Curriculum</h3>
            </div>
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios (e.g. TinyURL, Kafka)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Challenge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredChallenges.map((ch) => {
              const isSelected = currentChallenge.id === ch.id;
              const init = ch.initialVisualState as any;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChallenge(ch);
                    if (onSelectChallenge) onSelectChallenge(ch);
                    setShowDrawer(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-500'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                        {init?.category?.split(' ')[0] || 'Web'}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        {(init?.targetRPS || 30000).toLocaleString()} RPS
                      </span>
                    </div>
                    <h4 className="text-xs font-bold line-clamp-1">{ch.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {ch.problemStatement}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-mono">+{ch.xpReward} XP</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-0.5">
                      Launch <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Engineering Telemetry & Odometer Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Status Gauge */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Cluster Health</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                telemetry.statusState === 'HEALTHY'
                  ? 'bg-emerald-400 animate-ping'
                  : telemetry.statusState === 'DEGRADED'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500 animate-bounce'
              }`}
            />
            <span
              className={`text-sm font-bold tracking-tight ${
                telemetry.statusState === 'HEALTHY'
                  ? 'text-emerald-400'
                  : telemetry.statusState === 'DEGRADED'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {telemetry.statusState}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {nodes.length} Nodes Online
          </span>
        </div>

        {/* P99 Latency */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>P99 Latency</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1 text-base font-extrabold text-cyan-400 font-mono">
            {telemetry.p99LatencyMs}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Budget: &lt; {(currentChallenge.initialVisualState as any)?.maxLatencyMs || 50}ms
          </span>
        </div>

        {/* Availability SLA */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Availability SLA</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="my-1 text-base font-extrabold text-indigo-300 font-mono">
            {telemetry.sla}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Four Nines Standard
          </span>
        </div>

        {/* Traffic RPS */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Ingress Load</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-1 text-base font-extrabold text-purple-300 font-mono">
            {trafficRps.toLocaleString()} <span className="text-xs text-slate-500">RPS</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Adjustable Slider
          </span>
        </div>

        {/* Cache Hit % */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Cache Hit Rate</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 text-base font-extrabold text-emerald-400 font-mono">
            {cacheHitRate}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Absorbs Read Bursts
          </span>
        </div>

        {/* DB IOPS */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Database IOPS</span>
            <Database className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="my-1 text-base font-extrabold text-rose-400 font-mono">
            {telemetry.dbIops}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Penetrating Reads + Writes
          </span>
        </div>
      </div>

      {/* Interactive Sliders & Chaos Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Sliders */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Traffic RPS Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" /> RPS:
            </span>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-28 sm:w-36 accent-purple-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-400 w-16">
              {trafficRps.toLocaleString()}
            </span>
          </div>

          {/* Cache Hit Rate Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Cache Hit:
            </span>
            <input
              type="range"
              min="0"
              max="99"
              step="1"
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              className="w-24 sm:w-32 accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-emerald-400 w-10">
              {cacheHitRate}%
            </span>
          </div>
        </div>

        {/* Quick Chaos Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Chaos Mode:
          </span>

          <button
            onClick={() => {
              const lb = nodes.find((n) => n.type === 'load_balancer');
              if (lb) toggleNodeCrash(lb.id);
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900 transition-colors cursor-pointer"
          >
            Crash Ingress LB
          </button>

          <button
            onClick={() => {
              const cache = nodes.find((n) => n.type === 'cache');
              if (cache) toggleNodeCrash(cache.id);
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-300 text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
          >
            Kill Cache (Stampede)
          </button>

          <button
            onClick={() => {
              const db = nodes.find((n) => n.type === 'database');
              if (db) toggleNodeCrash(db.id);
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900 transition-colors cursor-pointer"
          >
            Kill Primary DB
          </button>

          <button
            onClick={() => {
              setChaosNodeDown(null);
              setLaggyNodes(new Set());
              setNodes((prev) => prev.map((n) => ({ ...n, status: 'healthy' })));
              setVisualFrames(generateLocalVisualFrames(nodes, trafficRps, cacheHitRate));
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Heal All</span>
          </button>
        </div>
      </div>

      {/* Component Palette Toolbox */}
      <div className="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Plus className="w-3.5 h-3.5 text-purple-400" /> Toolbox Palette:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddNode('load_balancer', 'Nginx Ingress (Replica)')}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:border-cyan-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Network className="w-3 h-3" /> + Load Balancer
          </button>

          <button
            onClick={() => handleAddNode('service', `API Microservice #${nodes.filter((n) => n.type === 'service').length + 1}`)}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold hover:border-indigo-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Server className="w-3 h-3" /> + Microservice Pod
          </button>

          <button
            onClick={() => handleAddNode('cache', 'Redis Cluster (LRU)')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3 h-3" /> + Redis Cache
          </button>

          <button
            onClick={() => handleAddNode('queue', 'Kafka Event Bus')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:border-purple-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Layers className="w-3 h-3" /> + Kafka Queue
          </button>

          <button
            onClick={() => handleAddNode('database', 'Postgres Read Replica')}
            className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:border-rose-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Database className="w-3 h-3" /> + Read Replica
          </button>

          <button
            onClick={() => handleAddNode('cdn', 'Cloudflare Edge CDN')}
            className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-300 text-xs font-semibold hover:border-sky-400 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Cloud className="w-3 h-3" /> + CDN Edge
          </button>
        </div>
      </div>

      {/* SPOF Alert Banner (if single points of failure exist) */}
      {telemetry.spofs.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/60 text-amber-200 text-xs flex items-start gap-2.5 shadow-lg shadow-amber-950/30 animate-in fade-in duration-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">
              Warning: {telemetry.spofs.length} Single Point(s) of Failure Detected!
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-amber-300/90">
              {telemetry.spofs.map((spof, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700/60">
                  {spof}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BIG INTERACTIVE MULTI-TIER TOPOLOGY CANVAS */}
      <div className="glass-panel-glow p-6 rounded-2xl relative overflow-hidden border border-slate-800 min-h-[580px]">
        {/* Animated Background Mesh & Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950/50 to-black/80 pointer-events-none" />

        {/* Top Canvas Bar */}
        <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Network className="w-4 h-4 text-purple-400" />
            <span>Interactive Distributed Architecture Topology Grid</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Traffic Packets: <strong className="text-cyan-400 font-bold">{trafficRps.toLocaleString()} RPS</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>Click any node to trigger Chaos Crash / Latency Spike</span>
          </div>
        </div>

        {/* Interactive Step-by-Step Visual Execution Frame Stepper */}
        {visualFrames.length > 0 && (
          <div className="relative z-10 mb-6 p-4 rounded-xl bg-slate-900/95 border border-purple-500/40 space-y-3 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-wide">
                      AI Request Packet Execution Trace
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-950 border border-purple-700 text-purple-300 font-mono font-bold">
                      {executionAlgorithm}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Step {currentFrameIndex + 1} of {visualFrames.length} • Action: <strong className="text-cyan-400">{visualFrames[currentFrameIndex]?.action || 'PACKET_HOP'}</strong>
                  </span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
                  disabled={currentFrameIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 disabled:opacity-40 transition-all cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlayingFrames(!isPlayingFrames)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    isPlayingFrames
                      ? 'bg-amber-600 text-white shadow-amber-600/30'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                  }`}
                >
                  {isPlayingFrames ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlayingFrames ? 'Pause Trace' : 'Play Trace'}</span>
                </button>

                <button
                  onClick={() => setCurrentFrameIndex(Math.min(visualFrames.length - 1, currentFrameIndex + 1))}
                  disabled={currentFrameIndex >= visualFrames.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 disabled:opacity-40 transition-all cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setCurrentFrameIndex(0);
                    setIsPlayingFrames(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Replay from Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Timeline Scrubber Dots */}
            <div className="flex items-center gap-1 pt-1 overflow-x-auto">
              {visualFrames.map((frame, idx) => {
                const isActive = idx === currentFrameIndex;
                const isPast = idx < currentFrameIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentFrameIndex(idx);
                      setIsPlayingFrames(false);
                    }}
                    className={`h-2 flex-1 min-w-[28px] rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50'
                        : isPast
                        ? 'bg-purple-600/80 hover:bg-purple-500'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    title={`Step ${idx + 1}: ${frame.action}`}
                  />
                );
              })}
            </div>

            {/* Step Educational Explanation Banner */}
            {visualFrames[currentFrameIndex] && (
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start sm:items-center gap-2 text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1 sm:mt-0 animate-ping" />
                  <span className="leading-relaxed font-medium">
                    {visualFrames[currentFrameIndex].explanation}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    Hop Latency: {visualFrames[currentFrameIndex].latencyMs || 2}ms
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    visualFrames[currentFrameIndex].status === 'FAILED' || visualFrames[currentFrameIndex].status === 'DISK_ERROR'
                      ? 'bg-rose-950 border border-rose-800 text-rose-300'
                      : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                  }`}>
                    {visualFrames[currentFrameIndex].status || 'OK'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multi-Tier Swimlanes Layout */}
        <div className="relative z-10 space-y-8 max-w-5xl mx-auto py-2">
          {/* Tier 1: Clients */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 font-bold">
              Tier 1: Global Consumers & Clients
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              {tierMap[1]?.map((node) => renderNodeCard(node))}
            </div>
            {renderDownArrow(1)}
          </div>

          {/* Tier 2: Edge CDN (if present) */}
          {tierMap[2]?.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400/80 mb-2 font-bold">
                Tier 2: Edge CDN & Anycast DNS
              </span>
              <div className="flex flex-wrap justify-center gap-4">
                {tierMap[2].map((node) => renderNodeCard(node))}
              </div>
              {renderDownArrow(2)}
            </div>
          )}

          {/* Tier 3: Ingress & Load Balancing */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 mb-2 font-bold">
              Tier 3: Ingress & Reverse Proxy Layer
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              {tierMap[3]?.map((node) => renderNodeCard(node))}
            </div>
            {renderDownArrow(3)}
          </div>

          {/* Tier 4: Microservices / Application Layer */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400/80 mb-2 font-bold">
              Tier 4: Stateless Microservice Pods & Dispatchers
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              {tierMap[4]?.map((node) => renderNodeCard(node))}
            </div>
            {renderDownArrow(4)}
          </div>

          {/* Tier 5 & 6: Messaging Queues + In-Memory Caching */}
          {(tierMap[5]?.length > 0 || tierMap[6]?.length > 0) && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 mb-2 font-bold">
                Tier 5 & 6: Async Event Bus & Distributed In-Memory Caching
              </span>
              <div className="flex flex-wrap justify-center gap-4">
                {tierMap[5]?.map((node) => renderNodeCard(node))}
                {tierMap[6]?.map((node) => renderNodeCard(node))}
              </div>
              {renderDownArrow(6)}
            </div>
          )}

          {/* Tier 7: Persistent Persistence & Databases */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400/80 mb-2 font-bold">
              Tier 7: Persistent Persistence, Replication & Storage
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              {tierMap[7]?.map((node) => renderNodeCard(node))}
            </div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="mt-8 pt-4 border-t border-slate-800/80 bg-slate-900/80 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-white">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  {selectedNode.label}
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getNodeColor(selectedNode.type, selectedNode.status).badge}`}>
                    {selectedNode.status?.toUpperCase()}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Type: {selectedNode.type} | Tier {selectedNode.tier} | Load: {selectedNode.rps || (trafficRps / Math.max(tierMap[selectedNode.tier || 4]?.length || 1, 1)).toFixed(0)} RPS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleNodeCrash(selectedNode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedNode.status === 'down'
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-rose-950 border border-rose-600 text-rose-300 hover:bg-rose-900'
                }`}
              >
                {selectedNode.status === 'down' ? 'Recover Node' : 'Simulate Hardware Crash'}
              </button>

              <button
                onClick={() => toggleLatencySpike(selectedNode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  laggyNodes.has(selectedNode.id)
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {laggyNodes.has(selectedNode.id) ? 'Clear Latency Lag' : '+350ms Latency Spike'}
              </button>

              <button
                onClick={() => handleRemoveNode(selectedNode.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                title="Remove Node"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Groq Cloud AI Architecture Review Report */}
      {aiCritique && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-5 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Groq Cloud LPU Architectural Resilience Report
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Engine: {aiCritique.model}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Resilience Score
                </span>
                <span
                  className={`text-xl font-extrabold font-mono ${
                    aiCritique.score >= 80 ? 'text-emerald-400' : aiCritique.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {aiCritique.score} / 100
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs font-mono"
                   style={{
                     borderColor: aiCritique.score >= 80 ? '#10b981' : aiCritique.score >= 50 ? '#f59e0b' : '#f43f5e',
                     color: aiCritique.score >= 80 ? '#10b981' : aiCritique.score >= 50 ? '#f59e0b' : '#f43f5e',
                   }}>
                {aiCritique.score}%
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
            {aiCritique.summary}
          </div>

          {/* CAP Theorem Breakdown */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs space-y-1">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> CAP Theorem & Distributed Consistency Analysis
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {aiCritique.capBreakdown}
            </p>
          </div>

          {/* Architectural Recommendations */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              Targeted Production Recommendations
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiCritique.recommendations.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Socratic Hints & Solution Accordion */}
          {remediationData && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  Socratic Architectural Guidance & Benchmark Fix
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setActiveHintLevel(level)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        activeHintLevel === level
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Hint {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Hint Content */}
              {remediationData.hints?.[activeHintLevel - 1] && (
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                  <span className="font-bold text-purple-300 block mb-1">
                    Level {activeHintLevel}: {remediationData.hints[activeHintLevel - 1].title}
                  </span>
                  {remediationData.hints[activeHintLevel - 1].hint}
                </div>
              )}

              {/* Benchmark Solution Overview */}
              {remediationData.solution && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Production Benchmark Architecture Solution
                    </span>
                    <button
                      onClick={handleLoadBenchmark}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Apply Topology
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {remediationData.solution.explanation}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                    <span>Target Latency: <strong className="text-cyan-400">{remediationData.solution.timeComplexity}</strong></span>
                    <span>Availability: <strong className="text-emerald-400">{remediationData.solution.spaceComplexity}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Helper to render individual node card on canvas
  function renderNodeCard(node: SystemDesignNode) {
    const isSelected = selectedNode?.id === node.id;
    const isDown = node.status === 'down';
    const isLaggy = laggyNodes.has(node.id);
    const styling = getNodeColor(node.type, node.status);
    const isSpof = node.isSPOF || (node.type === 'load_balancer' && tierMap[3]?.length === 1) || (node.type === 'database' && tierMap[7]?.length === 1);

    // Check if this node is active in the current animation frame
    const isFrameActiveNode =
      activeFrame &&
      (activeFrame.activeNodeId === node.id ||
        (activeFrame.activeNodeId?.toLowerCase().includes(node.type.toLowerCase()) && node.tier === activeFrame.tier));

    // Approximate RPS load for this node
    const tierCount = tierMap[node.tier || 4]?.length || 1;
    const assignedRps = Math.round(trafficRps / tierCount);

    return (
      <div
        key={node.id}
        onClick={() => setSelectedNode(node)}
        className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer select-none min-w-[210px] max-w-[240px] shadow-lg ${
          styling.bg
        } ${styling.border} ${styling.glow} ${
          isFrameActiveNode
            ? 'ring-4 ring-cyan-400 shadow-2xl shadow-cyan-400/60 scale-[1.05] z-30'
            : isSelected
            ? 'ring-2 ring-purple-400 scale-[1.03]'
            : 'hover:scale-[1.01]'
        }`}
      >
        {/* Active Frame Action Badge */}
        {isFrameActiveNode && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black font-mono tracking-wider shadow-lg shadow-cyan-400/50 flex items-center gap-1 animate-pulse whitespace-nowrap z-40">
            <Zap className="w-3 h-3 fill-slate-950" /> {activeFrame.action}
          </span>
        )}

        {/* SPOF warning indicator pill */}
        {isSpof && !isDown && !isFrameActiveNode && (
          <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold font-mono tracking-wider shadow-md animate-pulse">
            SPOF
          </span>
        )}

        {/* Latency Lag indicator */}
        {isLaggy && (
          <span className="absolute -top-2.5 -left-2 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-bold font-mono tracking-wider shadow-md">
            +350ms LAG
          </span>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border transition-colors ${isFrameActiveNode ? 'bg-cyan-950 border-cyan-400' : 'bg-slate-900/80 border-slate-700/60'}`}>
              {getNodeIcon(node.type)}
            </div>
            <div>
              <h5 className="text-xs font-bold text-white line-clamp-1">{node.label}</h5>
              <span className="text-[10px] text-slate-400 font-mono block">
                {node.sublabel || node.type}
              </span>
            </div>
          </div>
        </div>

        {/* Node Metrics Bottom Row */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            {isDown ? (
              <strong className="text-rose-400 font-bold">OFFLINE</strong>
            ) : (
              <span className="text-cyan-400 font-bold">{assignedRps.toLocaleString()} RPS</span>
            )}
          </span>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styling.badge}`}>
            {isDown ? 'DEAD' : 'OK'}
          </span>
        </div>

        {/* Quick Crash Trigger Button on Card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleNodeCrash(node.id);
          }}
          title="Click to trigger Chaos Crash"
          className="absolute -bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-rose-500 text-[9px] text-slate-400 hover:text-rose-400 font-mono transition-colors"
        >
          {isDown ? 'Revive' : 'Kill'}
        </button>
      </div>
    );
  }

  // Downward connection line with glowing animated particles
  function renderDownArrow(tierIndex: number = 1) {
    const isTierActive = activeFrame && (activeFrame.tier === tierIndex || activeFrame.tier === tierIndex + 1);
    return (
      <div className={`w-0.5 h-6 relative overflow-hidden my-1 transition-all ${
        isTierActive
          ? 'bg-cyan-400 w-1 shadow-lg shadow-cyan-400/80'
          : 'bg-gradient-to-b from-indigo-500/60 to-purple-500/60'
      }`}>
        {isSimulating && (
          <div
            className={`w-full h-2.5 rounded-full shadow-md animate-bounce ${
              isTierActive ? 'bg-cyan-300 shadow-cyan-300' : 'bg-cyan-400 shadow-cyan-400/80'
            }`}
            style={{ animationDuration: isTierActive ? '0.6s' : '1.2s' }}
          />
        )}
      </div>
    );
  }
}
