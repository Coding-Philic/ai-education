'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

interface SkillRadarProps {
  metrics: {
    dsaPointers: number;
    recursionAndTrees: number;
    dynamicProgramming: number;
    sqlQueryOptimization: number;
    distributedSystemDesign: number;
  };
}

export default function SkillRadar({ metrics }: SkillRadarProps) {
  // 5 axes: DSA Pointers, Trees & Recursion, DP, SQL Optimization, System Design
  const axes = [
    { key: 'dsaPointers', label: 'DSA Pointers', value: metrics.dsaPointers },
    { key: 'recursionAndTrees', label: 'Trees & Recursion', value: metrics.recursionAndTrees },
    { key: 'dynamicProgramming', label: 'Dynamic Programming', value: metrics.dynamicProgramming },
    { key: 'sqlQueryOptimization', label: 'SQL Optimization', value: metrics.sqlQueryOptimization },
    { key: 'distributedSystemDesign', label: 'System Design', value: metrics.distributedSystemDesign },
  ];

  // SVG Radar Polygon Math
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Background Web concentric polygons
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    return axes
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // User polygon coordinates
  const userPolygonPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.value / 100);
      return `${x},${y}`;
    })
    .join(' ');

  // Identify weak areas (< 60%)
  const weakAreas = axes.filter((a) => a.value < 60);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-[#E5E1D3]">
      
      {/* SVG Radar Chart */}
      <div className="relative w-[260px] h-[260px] shrink-0">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric grid webs */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="#D9D4C3"
              strokeWidth="1"
              strokeDasharray={idx === 3 ? 'none' : '3,3'}
              opacity="0.8"
            />
          ))}

          {/* Radial axis lines */}
          {axes.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#D9D4C3"
                strokeWidth="1"
                opacity="0.8"
              />
            );
          })}

          {/* User Data Polygon (Wispr Emerald) */}
          <polygon
            points={userPolygonPoints}
            fill="rgba(13, 104, 77, 0.18)"
            stroke="#0D684D"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Vertex Points & Labels */}
          {axes.map((axis, i) => {
            const { x, y } = getCoordinates(i, axis.value / 100);
            const labelPos = getCoordinates(i, 1.25);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#0D382B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[10px] fill-[#4E5C56] font-semibold"
                >
                  {axis.label} ({axis.value}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Diagnostic Insights Panel */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#EFF5F0] border border-[#D5E2D8] flex items-center justify-center text-[#0D684D]">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#141A17] tracking-tight">
            AI Skill Gap Diagnostic Matrix (Problem Statement 1)
          </h3>
        </div>
        <p className="text-xs text-[#5E6D66] mb-4">
          Groq Cloud AI continuously inspects your code AST submissions and query plans to isolate conceptual gaps.
        </p>

        {weakAreas.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B45309]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{weakAreas.length} Conceptual Gaps Isolated:</span>
            </div>
            {weakAreas.map((gap) => (
              <div
                key={gap.key}
                className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#92400E]">{gap.label}</span>
                  <p className="text-[11px] text-[#78350F] mt-0.5">
                    {gap.key === 'dynamicProgramming'
                      ? 'Sub-problem memoization & recurrence relation gaps detected.'
                      : 'Boundary invariant check omitted during recursion.'}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] font-mono text-[10px] font-bold">
                  {gap.value}% Mastery
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#EFF5F0] border border-[#D5E2D8] text-xs text-[#0D684D] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>All core domains meeting expected engineering benchmarks (≥ 60%).</span>
          </div>
        )}
      </div>

    </div>
  );
}
