/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — AI Clip Detection & Virality Matrix
 * Automated virality prediction, hook strength inspection,
 * cognitive retention breakdown, and manual override re-ranking.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Flame,
  Scissors,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Edit2,
  Check,
  Zap,
} from 'lucide-react';
import { Clip } from '../../types';

interface ClipViralityEngineProps {
  onNavigate: (tab: string) => void;
  onSelectClip: (clip: Clip) => void;
}

export const ClipViralityEngine: React.FC<ClipViralityEngineProps> = ({
  onNavigate,
  onSelectClip,
}) => {
  const { clips, updateClip, reorderClips, enqueueClip } = useSableStore();
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '');
  const [editingClipId, setEditingClipId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editHook, setEditHook] = useState('');
  const [filterQuery, setFilterQuery] = useState<'all' | '90+' | '80+'>('all');
  const [enqueuedNotice, setEnqueuedNotice] = useState(false);

  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  const filteredClips = clips.filter((c) => {
    if (filterQuery === '90+') return c.virality.overall >= 90;
    if (filterQuery === '80+') return c.virality.overall >= 80;
    return true;
  });

  const moveRank = (clipId: string, direction: 'up' | 'down') => {
    const index = clips.findIndex((c) => c.id === clipId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clips.length) return;

    const newClips = [...clips];
    const [moved] = newClips.splice(index, 1);
    newClips.splice(targetIndex, 0, moved);
    reorderClips(newClips);
  };

  const handleStartEdit = (clip: Clip) => {
    setEditingClipId(clip.id);
    setEditTitle(clip.title);
    setEditHook(clip.hookText);
  };

  const handleSaveEdit = (clip: Clip) => {
    updateClip({
      ...clip,
      title: editTitle,
      hookText: editHook,
    });
    setEditingClipId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Algorithmic Intelligence</span>
            <span>·</span>
            <span>Cognitive Retention Modeling</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            AI Virality & Clip Ranking Matrix
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-2xl">
            Clips scored across 4 psychological retention axes: hook velocity, emotional resonance,
            pacing, and loop continuity. Re-rank or customize before final studio cut.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-[#222222] rounded-md shrink-0">
          <button
            onClick={() => setFilterQuery('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterQuery === 'all'
                ? 'bg-[#222222] text-[#F5F2EB]'
                : 'text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            All Candidates ({clips.length})
          </button>
          <button
            onClick={() => setFilterQuery('90+')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterQuery === '90+'
                ? 'bg-[#222222] text-[#D4BE8D]'
                : 'text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            Tier 1 Viral (90+)
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Ranked List, Right is In-Depth Virality Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ranked Clip List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs text-[#737373] font-mono uppercase tracking-wider px-1">
            Ranked Viral Moments (Drag or Use Arrows to Override)
          </div>

          <div className="space-y-2.5">
            {filteredClips.map((clip, index) => {
              const isSelected = clip.id === selectedClip?.id;
              const isEditing = editingClipId === clip.id;

              return (
                <div
                  key={clip.id}
                  onClick={() => {
                    setSelectedClipId(clip.id);
                    onSelectClip(clip);
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181818] border-[#BFA46F]/50 shadow-md ring-1 ring-[#BFA46F]/20'
                      : 'bg-[#131313] border-[#222222] hover:border-[#303030]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Numerical Rank */}
                      <div className="w-6 h-6 rounded bg-[#202020] border border-[#2E2E2E] flex items-center justify-center text-xs font-mono font-bold text-[#BFA46F] shrink-0 mt-0.5">
                        {index + 1}
                      </div>

                      <div className="flex-1 space-y-1">
                        {isEditing ? (
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs bg-[#0F0F0F] border border-[#333333] rounded text-[#F5F2EB]"
                              placeholder="Clip Title"
                            />
                            <input
                              type="text"
                              value={editHook}
                              onChange={(e) => setEditHook(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs bg-[#0F0F0F] border border-[#333333] rounded text-[#D4BE8D] font-mono"
                              placeholder="Hook Headline"
                            />
                            <button
                              onClick={() => handleSaveEdit(clip)}
                              className="px-3 py-1 text-xs bg-[#BFA46F] text-[#0F0F0F] font-semibold rounded flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs font-semibold text-[#F5F2EB] flex items-center gap-2">
                              <span>{clip.title}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(clip);
                                }}
                                className="text-[#606060] hover:text-[#F5F2EB] transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[11px] font-mono text-[#D4BE8D]">
                              Hook: "{clip.hookText}"
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#737373] pt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-mono tabular-nums">
                                  {clip.startTime.toFixed(1)}s – {clip.endTime.toFixed(1)}s (
                                  {clip.durationSeconds}s)
                                </span>
                              </span>
                              <span>·</span>
                              <span>{clip.aspectRatio} Vertical Short</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Virality Score Badge & Re-rank buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono tabular-nums text-[#D4BE8D]">
                          {clip.virality.overall}
                          <span className="text-[10px] text-[#737373] font-normal">/100</span>
                        </div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-[#737373]">
                          Viral Index
                        </div>
                      </div>

                      {/* Manual Override Order Arrows */}
                      <div
                        className="flex flex-col gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => moveRank(clip.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-[#252525] rounded disabled:opacity-20 text-[#8E8A82]"
                          title="Promote Rank"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveRank(clip.id, 'down')}
                          disabled={index === filteredClips.length - 1}
                          className="p-1 hover:bg-[#252525] rounded disabled:opacity-20 text-[#8E8A82]"
                          title="Demote Rank"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Clip Virality Breakdown Inspector */}
        {selectedClip && (
          <div className="lg:col-span-5 space-y-6 bg-[#141414] border border-[#242424] rounded-xl p-6 sticky top-24">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#BFA46F]">
                  Algorithmic Forensic Breakdown
                </span>
                <h2 className="text-lg font-display font-bold text-[#F5F2EB] mt-0.5">
                  {selectedClip.title}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] border border-[#2D2D2D] flex flex-col items-center justify-center shrink-0">
                <span className="text-base font-bold font-mono text-[#D4BE8D] leading-none">
                  {selectedClip.virality.overall}
                </span>
                <span className="text-[8px] font-mono text-[#737373] uppercase mt-0.5">SCORE</span>
              </div>
            </div>

            {/* Virality Factor Bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8E8A82] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#BFA46F]" />
                    <span>0–2s Hook Disruption</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#F5F2EB] font-medium">
                    {selectedClip.virality.hookStrength}/100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#BFA46F] rounded-full transition-all duration-500"
                    style={{ width: `${selectedClip.virality.hookStrength}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8E8A82] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>Retention Velocity</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#F5F2EB] font-medium">
                    {selectedClip.virality.retentionScore}/100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${selectedClip.virality.retentionScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8E8A82] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Emotional Resonance</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#F5F2EB] font-medium">
                    {selectedClip.virality.emotionalResonance}/100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${selectedClip.virality.emotionalResonance}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8E8A82] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dialogue Pacing & WPM</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#F5F2EB] font-medium">
                    {selectedClip.virality.pacingScore}/100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${selectedClip.virality.pacingScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Algorithmic Reasoning */}
            <div className="p-3.5 rounded-lg bg-[#0E0E0E] border border-[#222222] text-xs text-[#8E8A82] leading-relaxed">
              <span className="text-[#D4BE8D] font-mono text-[10px] uppercase block mb-1">
                Executive Synthesis
              </span>
              {selectedClip.virality.reasoning}
            </div>

            {/* Key Moments */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
                Critical Timestamp Markers
              </div>
              <div className="space-y-1.5">
                {selectedClip.virality.keyMoments.map((km, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2 rounded bg-[#181818] border border-[#252525]"
                  >
                    <span className="text-[#E5E5E5]">{km.label}</span>
                    <span className="font-mono tabular-nums text-[#BFA46F] text-[11px]">
                      {km.timestamp.toFixed(1)}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onSelectClip(selectedClip);
                  onNavigate('studio');
                }}
                className="w-full py-2.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Launch in Editing Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  enqueueClip(selectedClip, 'youtube_shorts');
                  setEnqueuedNotice(true);
                  setTimeout(() => setEnqueuedNotice(false), 2000);
                }}
                className="w-full py-2 bg-[#1C1C1C] hover:bg-[#252525] text-[#F5F2EB] border border-[#2D2D2D] text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {enqueuedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Added to YouTube Shorts Queue!</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#BFA46F]" />
                    <span>Direct Queue for YouTube Shorts (60fps)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
