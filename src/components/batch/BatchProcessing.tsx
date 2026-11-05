/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Batch Processing & Transcoding Queue
 * High-throughput pipeline: Multi-clip generation from source videos,
 * concurrent FFmpeg transcoding simulators, and bulk export packages.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  Trash2,
  FileDown,
  Zap,
} from 'lucide-react';
import { detectViralClips } from '../../lib/ai/virality-engine';
import { triggerFileDownload } from '../../lib/ffmpeg/processor';

export const BatchProcessing: React.FC = () => {
  const { videos, clips, batchQueue, addClips, enqueueClip, clearBatchQueue, removeBatchItem } = useSableStore();
  const [selectedVideoId, setSelectedVideoId] = useState(videos[0]?.id || '');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchCount, setBatchCount] = useState<number>(5);

  const selectedVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  const handleRunBatchExtraction = () => {
    if (!selectedVideo || !selectedVideo.transcript) return;
    setIsGeneratingBatch(true);

    setTimeout(() => {
      const generated = detectViralClips(selectedVideo.id, selectedVideo.transcript!, {
        minDurationSeconds: 10,
        maxDurationSeconds: 50,
      });

      const topCandidates = generated.slice(0, batchCount);
      addClips(topCandidates);

      // Automatically enqueue for YouTube Shorts batch export
      topCandidates.forEach((clip) => {
        enqueueClip(clip, 'youtube_shorts');
      });

      setIsGeneratingBatch(false);
    }, 1200);
  };

  const handleBulkExportAllClips = () => {
    clips.forEach((clip) => {
      enqueueClip(clip, 'youtube_shorts');
    });
  };

  const completedCount = batchQueue.filter((i) => i.status === 'completed').length;
  const processingCount = batchQueue.filter((i) => i.status === 'processing').length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>High-Throughput Transcoding</span>
            <span>·</span>
            <span>Concurrent Queue</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Batch Processing & Multi-Clip Transcoder
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-xl">
            Extract multiple 9:16 vertical shorts from full-length footage in one batch.
            Monitor rendering progress and download complete export packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {batchQueue.length > 0 && (
            <button
              onClick={clearBatchQueue}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#262626] border border-[#2D2D2D] text-xs text-[#8E8A82] hover:text-[#F5F2EB] rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          )}

          <button
            onClick={handleBulkExportAllClips}
            disabled={clips.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] disabled:opacity-50 text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Enqueue All {clips.length} Clips</span>
          </button>
        </div>
      </div>

      {/* Batch Generator Launcher */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#BFA46F]" />
          <h2 className="text-sm font-semibold text-[#F5F2EB]">
            Automated Multi-Clip Batch Extractor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-xs text-[#8E8A82]">Select Source Production</label>
            <select
              value={selectedVideoId}
              onChange={(e) => setSelectedVideoId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#0F0F0F] border border-[#2A2A2A] rounded-md text-[#F5F2EB] focus:outline-none focus:border-[#BFA46F]"
            >
              {videos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.formattedDuration})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-[#8E8A82]">Clips to Extract</label>
            <select
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-xs bg-[#0F0F0F] border border-[#2A2A2A] rounded-md text-[#F5F2EB] focus:outline-none focus:border-[#BFA46F]"
            >
              <option value={3}>Top 3 Viral Clips</option>
              <option value={5}>Top 5 Viral Clips</option>
              <option value={8}>Top 8 Viral Clips</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={handleRunBatchExtraction}
              disabled={isGeneratingBatch}
              className="w-full py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-[#F5F2EB] rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isGeneratingBatch ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#BFA46F] animate-spin" />
                  <span>Analyzing Hooks...</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#BFA46F]" />
                  <span>Execute Batch Extract</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Queue Status Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82]">Total Enqueued Jobs</div>
          <div className="text-xl font-bold font-mono tabular-nums text-[#F5F2EB] mt-1">
            {batchQueue.length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82]">Transcoding In-Flight</div>
          <div className="text-xl font-bold font-mono tabular-nums text-[#D4BE8D] mt-1">
            {processingCount}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
          <div className="text-xs text-[#8E8A82]">Completed & Packaged</div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            {completedCount}
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#737373]">
          Active Transcode Jobs
        </div>

        {batchQueue.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#121212] border border-[#222222] text-[#737373] text-xs">
            Queue is empty. Select clips or run a batch extract above to start background rendering.
          </div>
        ) : (
          <div className="border border-[#222222] rounded-lg overflow-hidden bg-[#121212]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-[#222222] text-[#737373] uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Clip Candidate</th>
                  <th className="py-3 px-4">Platform Spec</th>
                  <th className="py-3 px-4">Aspect</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Transcoding Progress</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1D] text-[#CCCCCC]">
                {batchQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-[#181818]/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#F5F2EB]">{item.clipTitle}</td>
                    <td className="py-3 px-4 font-mono capitalize text-[#8E8A82]">
                      {item.platform.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#D4BE8D]">{item.aspectRatio}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-[#8E8A82]">
                      {item.duration}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono tabular-nums text-[#8E8A82]">
                          <span>{item.progress}%</span>
                          <span>{item.status}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.status === 'completed'
                                ? 'bg-emerald-500'
                                : 'bg-[#BFA46F]'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'completed' ? (
                          <>
                            <button
                              onClick={() => {
                                const manifest = JSON.stringify(item, null, 2);
                                triggerFileDownload(`${item.clipTitle.replace(/\s+/g, '_')}_batch.json`, manifest, 'application/json');
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded transition-colors"
                              title="Download Transcode Manifest"
                            >
                              <FileDown className="w-3 h-3" />
                              <span>Ready (Download)</span>
                            </button>
                            <button
                              onClick={() => removeBatchItem(item.id)}
                              className="p-1 text-[#606060] hover:text-red-400 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-[#BFA46F] font-mono">
                            Rendering...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
