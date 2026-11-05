/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Executive Dashboard Overview
 * Anti-slop disciplined layout: High-density data grid, concrete metrics,
 * production pipeline cards, and direct studio access.
 */

import React from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  UploadCloud,
  Scissors,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Play,
  FolderArchive,
} from 'lucide-react';
import { Clip } from '../../types';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  onSelectClip: (clip: Clip) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onSelectClip,
}) => {
  const { videos, clips, batchQueue } = useSableStore();

  const topClip = clips[0];
  const pendingQueueCount = batchQueue.filter((b) => b.status === 'processing').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Studio Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1.5">
            <span>Executive Production Room</span>
            <span>·</span>
            <span>Active Master Session</span>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-[#F5F2EB]">
            Where vision meets precision.
          </h1>
          <p className="text-sm text-[#8E8A82] mt-1 max-w-2xl font-normal">
            Automated intelligence for long-form dialogue, masterclasses, and cinematic interviews.
            Extract high-status 9:16 vertical shorts engineered for algorithmic retention.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('ingestion')}
            className="flex items-center gap-2 px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Source Video</span>
          </button>
          <button
            onClick={() => onNavigate('virality')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F2EB] border border-[#2D2D2D] text-xs font-medium rounded-md transition-colors"
          >
            <Flame className="w-4 h-4 text-[#BFA46F]" />
            <span>Virality Matrix</span>
          </button>
          <button
            onClick={() => onNavigate('vault')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F2EB] border border-[#2D2D2D] text-xs font-medium rounded-md transition-colors"
          >
            <FolderArchive className="w-4 h-4 text-[#BFA46F]" />
            <span>Storage Vault</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip — Tabular Numerals, Clean Non-Pill Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82] font-medium">Ingested Long-Form Videos</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#F5F2EB]">
              {videos.length}
            </span>
            <span className="text-xs text-[#737373]">productions cataloged</span>
          </div>
          <div className="mt-2 text-[11px] text-[#8E8A82] flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#737373]" />
            <span>Average runtime 48.2m</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82] font-medium">Extracted Viral Clips</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#D4BE8D]">
              {clips.length}
            </span>
            <span className="text-xs text-[#737373]">ready for 9:16 export</span>
          </div>
          <div className="mt-2 text-[11px] text-[#8E8A82] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#BFA46F]" />
            <span>Speaker diarization verified</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82] font-medium">Median Hook Velocity</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#F5F2EB]">
              94.8<span className="text-base text-[#BFA46F]">/100</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#8E8A82]">
            <span>Optimal 1.8s cognitive interrupt</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82] font-medium">Transcoding Pipeline</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#F5F2EB]">
              {pendingQueueCount > 0 ? `${pendingQueueCount} Active` : 'Idle · Ready'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#8E8A82] flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#737373]" />
            <span>FFmpeg 60fps ProRes / H.264 engine</span>
          </div>
        </div>
      </div>

      {/* Featured Viral Spotlight & Quick Reframe Launcher */}
      {topClip && (
        <div className="p-6 rounded-lg bg-[#141414] border border-[#282828] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#BFA46F] font-semibold uppercase tracking-wider font-mono text-[11px]">
                  Highest Ranked Viral Candidate
                </span>
                <span className="text-[#404040]">·</span>
                <span className="text-[#8E8A82]">Virality Score {topClip.virality.overall}/100</span>
              </div>
              <h2 className="text-xl font-display font-bold text-[#F5F2EB]">
                {topClip.title}
              </h2>
              <div className="text-xs text-[#8E8A82] leading-relaxed">
                <span className="text-[#D4BE8D] font-mono">"{topClip.hookText}"</span>
                <p className="mt-1">{topClip.virality.reasoning}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#737373]">
                <span>Duration: {topClip.durationSeconds}s</span>
                <span>·</span>
                <span>Aspect: {topClip.aspectRatio}</span>
                <span>·</span>
                <span>Style: Cinema Gold</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  onSelectClip(topClip);
                  onNavigate('studio');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-all shadow-md active:scale-98"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Open in Editing Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cataloged Master Productions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F2EB]">Cataloged Long-Form Source Footage</h3>
            <p className="text-xs text-[#8E8A82]">
              Source footage ready for AI speaker diarization and clip extraction
            </p>
          </div>
          <button
            onClick={() => onNavigate('ingestion')}
            className="text-xs text-[#BFA46F] hover:underline flex items-center gap-1"
          >
            <span>Import more footage</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border border-[#222222] rounded-lg overflow-hidden bg-[#121212]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-[#222222] text-[#737373] uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Production Title</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Resolution</th>
                  <th className="py-3 px-4">Generated Clips</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1D] text-[#CCCCCC]">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-[#181818]/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#F5F2EB] flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-[#1F1F1F] overflow-hidden shrink-0 border border-[#2D2D2D]">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="truncate max-w-sm">{vid.title}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-[#8E8A82]">
                      {vid.formattedDuration}
                    </td>
                    <td className="py-3.5 px-4 text-[#8E8A82]">{vid.resolution}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-[#D4BE8D]">
                      {vid.clipsCount} clips
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#8E8A82]">{vid.category}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('virality')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#F5F2EB] bg-[#1E1E1E] hover:bg-[#282828] border border-[#333333] rounded transition-colors"
                      >
                        <Play className="w-3 h-3 text-[#BFA46F]" />
                        <span>Inspect Clips</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
