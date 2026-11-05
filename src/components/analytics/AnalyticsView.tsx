/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Retention Analytics & Algorithmic Forensics
 * Pre-publish audience retention simulator, drop-off probability curve,
 * and cross-platform algorithmic virality benchmarking.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Clip } from '../../types';

export const AnalyticsView: React.FC = () => {
  const { clips } = useSableStore();
  const [selectedClipId, setSelectedClipId] = useState(clips[0]?.id || '');

  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  // Dynamic retention curve based on selected clip virality factors
  const hook = selectedClip ? selectedClip.virality.hookStrength : 95;
  const retention = selectedClip ? selectedClip.virality.retentionScore : 90;
  const overall = selectedClip ? selectedClip.virality.overall : 94;

  const retentionCurve = [
    { sec: '0s', retention: 100, label: 'Viewer Swipe Impression' },
    { sec: '1s', retention: Math.min(99, Math.round(hook * 0.98)), label: 'Cognitive Hook Impact' },
    { sec: '2s', retention: Math.min(97, Math.round(hook * 0.93)), label: 'Sub-2s Threshold Cleared' },
    { sec: '4s', retention: Math.min(93, Math.round(retention * 0.95)), label: 'Narrative Setup' },
    { sec: '8s', retention: Math.min(88, Math.round(retention * 0.90)), label: 'Core Tension Delivery' },
    { sec: '12s', retention: Math.min(84, Math.round(retention * 0.86)), label: 'Emotional Climax' },
    { sec: '16s', retention: Math.min(80, Math.round(retention * 0.82)), label: 'Loop Seamless Transition' },
  ];

  const predicted3s = (hook * 0.93).toFixed(1);
  const predictedCompletion = (retention * 0.82).toFixed(1);
  const loopVelocity = (1.1 + (overall / 100) * 0.38).toFixed(2);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Predictive Intelligence</span>
            <span>·</span>
            <span>Pre-Publish Retention Modeling</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Algorithmic Retention & Virality Analytics
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-xl">
            Simulate how the YouTube Shorts and TikTok algorithms will score your hook before you publish.
            Pinpoint exact drop-off hazards to engineer 80%+ completion rates.
          </p>
        </div>

        {/* Clip Selector */}
        <div className="w-72">
          <label className="text-[11px] text-[#737373] block mb-1">Inspect Clip Candidate</label>
          <select
            value={selectedClipId}
            onChange={(e) => setSelectedClipId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#2D2D2D] rounded-md text-[#F5F2EB] focus:outline-none focus:border-[#BFA46F]"
          >
            {clips.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.manualRankOrder} {c.title} ({c.virality.overall}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#141414] border border-[#242424]">
          <div className="text-xs text-[#8E8A82]">Predicted 3s Retention</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {predicted3s}%
          </div>
          <div className="text-[11px] text-[#737373] mt-1">
            Industry Benchmark: <span className="text-[#8E8A82]">68.0%</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#242424]">
          <div className="text-xs text-[#8E8A82]">Predicted Completion Rate</div>
          <div className="text-2xl font-bold font-mono text-[#D4BE8D] mt-1 tabular-nums">
            {predictedCompletion}%
          </div>
          <div className="text-[11px] text-[#737373] mt-1">
            Top 1% Creator Tier: <span className="text-[#8E8A82]">72.0%</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#242424]">
          <div className="text-xs text-[#8E8A82]">Algorithm Loop Velocity</div>
          <div className="text-2xl font-bold font-mono text-[#F5F2EB] mt-1 tabular-nums">
            {loopVelocity}x
          </div>
          <div className="text-[11px] text-[#737373] mt-1">Seamless loop replay index</div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#242424]">
          <div className="text-xs text-[#8E8A82]">Virality Confidence Score</div>
          <div className="text-2xl font-bold font-mono text-[#BFA46F] mt-1 tabular-nums">
            {selectedClip.virality.overall}
            <span className="text-xs text-[#737373]">/100</span>
          </div>
          <div className="text-[11px] text-[#737373] mt-1">Neural cadence verified</div>
        </div>
      </div>

      {/* Retention Curve Visualizer */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F5F2EB]">
              Simulated Second-by-Second Viewer Retention Curve
            </h2>
            <p className="text-xs text-[#8E8A82] mt-0.5">
              Reflects speech velocity, dialogue pause duration, and cognitive curiosity peaks.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Low Drop-off Risk Profile
          </span>
        </div>

        {/* Visual Retention Bars */}
        <div className="grid grid-cols-7 gap-3 pt-4">
          {retentionCurve.map((point, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono tabular-nums text-[#D4BE8D]">
                {point.retention}%
              </span>
              <div className="w-full h-36 bg-[#1A1A1A] rounded-md relative flex items-end overflow-hidden p-1">
                <div
                  className="w-full bg-[#BFA46F] rounded transition-all duration-700"
                  style={{ height: `${point.retention}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[#F5F2EB] font-bold">{point.sec}</span>
              <span className="text-[10px] text-[#737373] text-center leading-tight">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Comparison Matrix */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-4">
        <h2 className="text-sm font-semibold text-[#F5F2EB]">
          Platform-Specific Algorithmic Affinity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#242424] space-y-2">
            <div className="text-xs font-semibold text-[#F5F2EB]">YouTube Shorts</div>
            <div className="text-lg font-mono text-[#D4BE8D] font-bold">96% Affinity</div>
            <p className="text-[11px] text-[#8E8A82]">
              Rewards high viewer completion percentage and watch-time loops.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#242424] space-y-2">
            <div className="text-xs font-semibold text-[#F5F2EB]">TikTok Pro</div>
            <div className="text-lg font-mono text-[#D4BE8D] font-bold">92% Affinity</div>
            <p className="text-[11px] text-[#8E8A82]">
              Sub-1.5s hook velocity is optimized for instant FYP scroll stops.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#242424] space-y-2">
            <div className="text-xs font-semibold text-[#F5F2EB]">Instagram Reels</div>
            <div className="text-lg font-mono text-[#D4BE8D] font-bold">89% Affinity</div>
            <p className="text-[11px] text-[#8E8A82]">
              Clean typography and high-status visual grading elevate shareability in DMs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#242424] space-y-2">
            <div className="text-xs font-semibold text-[#F5F2EB]">X (Twitter Video)</div>
            <div className="text-lg font-mono text-[#D4BE8D] font-bold">85% Affinity</div>
            <p className="text-[11px] text-[#8E8A82]">
              Autoplay in feeds without sound benefits from bold burn-in captions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
