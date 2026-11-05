/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Platform Export & Publishing Suite
 * High-definition exports, multi-platform title/desc presets,
 * subtitle package downloads (SRT/VTT), and local FFmpeg CLI generator.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Download,
  Share2,
  FileText,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Image,
  Youtube,
  Film,
} from 'lucide-react';
import { Clip, PlatformPreset } from '../../types';
import { PLATFORM_PRESETS } from '../../lib/mock-data';
import {
  buildFFmpegCommand,
  generateSRT,
  generateVTT,
  triggerFileDownload,
} from '../../lib/ffmpeg/processor';

interface ExportPublisherProps {
  clip: Clip;
  onNavigate: (tab: string) => void;
}

export const ExportPublisher: React.FC<ExportPublisherProps> = ({ clip }) => {
  const { videos, activeBrandKit, deductCredit } = useSableStore();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformPreset['id']>('youtube_shorts');
  const [copiedFFmpeg, setCopiedFFmpeg] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const sourceVideo = videos.find((v) => v.id === clip.videoId) || videos[0];
  const activePreset = PLATFORM_PRESETS.find((p) => p.id === selectedPlatform) || PLATFORM_PRESETS[0];

  const ffmpegCommand = buildFFmpegCommand({
    inputPath: sourceVideo.localFilePath || 'input_master.mp4',
    outputPath: `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_9x16.mp4`,
    clip,
    brandKit: activeBrandKit,
    subtitlesPath: 'captions.srt',
    targetPlatform: selectedPlatform,
  });

  const optimizedTitle = `${clip.title} #Shorts`;
  const optimizedDescription = `Where vision meets precision.\n\nExtract from "${sourceVideo.title}".\n\n"${clip.hookText}"\n\n#YouTubeShorts #Filmmaking #DirectorMasterclass #Cinema #Storytelling #ViralMoments`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(ffmpegCommand);
    setCopiedFFmpeg(true);
    setTimeout(() => setCopiedFFmpeg(false), 2000);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(optimizedTitle);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleDownloadSRT = () => {
    const srt = generateSRT(clip, sourceVideo.transcript);
    triggerFileDownload(`${clip.title.replace(/\s+/g, '_')}.srt`, srt);
  };

  const handleDownloadVTT = () => {
    const vtt = generateVTT(clip, sourceVideo.transcript);
    triggerFileDownload(`${clip.title.replace(/\s+/g, '_')}.vtt`, vtt);
  };

  const handleDownloadThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark cinematic gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#191919');
    grad.addColorStop(0.5, '#0F0F0F');
    grad.addColorStop(1, '#080808');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Outer border ring
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1020, 1860);

    // Gold Hook Box
    ctx.fillStyle = '#141414';
    ctx.fillRect(80, 260, 920, 240);
    ctx.strokeStyle = '#BFA46F';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, 260, 920, 240);

    // Hook Headline
    ctx.fillStyle = '#F5F2EB';
    ctx.font = 'bold 50px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(clip.hookText, 540, 370);

    ctx.fillStyle = '#BFA46F';
    ctx.font = '32px JetBrains Mono, monospace';
    ctx.fillText(`VIRAL SCORE: ${clip.virality.overall}/100`, 540, 440);

    // Center Title
    ctx.fillStyle = '#F5F2EB';
    ctx.font = 'bold 58px Outfit, sans-serif';
    ctx.fillText('SABLE CIRCLE', 540, 1020);

    ctx.fillStyle = '#8E8A82';
    ctx.font = '32px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Where vision meets precision', 540, 1090);

    // Watermark Footer
    ctx.fillStyle = '#BFA46F';
    ctx.font = '30px JetBrains Mono, monospace';
    ctx.fillText('4K 60FPS MASTER CUT', 540, 1720);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${clip.title.replace(/\s+/g, '_')}_thumbnail.png`;
    a.click();
  };

  const handleTriggerExport = () => {
    setIsExporting(true);
    deductCredit(10);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);

      // Trigger automatic package download
      const summaryPackage = JSON.stringify(
        {
          project: 'Sable Circle Master Export',
          clipTitle: clip.title,
          hookText: clip.hookText,
          duration: `${clip.durationSeconds}s`,
          aspectRatio: clip.aspectRatio,
          platform: selectedPlatform,
          viralityScore: clip.virality.overall,
          ffmpegCommand,
        },
        null,
        2
      );
      triggerFileDownload(`${clip.title.replace(/\s+/g, '_')}_manifest.json`, summaryPackage, 'application/json');
    }, 1200);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Publishing Master</span>
            <span>·</span>
            <span>Multi-Platform Presets</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Export & Delivery Studio
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-xl">
            Export uncompressed ProRes or 1080x1920 60fps MP4 with synchronized subtitles and
            platform-optimized metadata.
          </p>
        </div>

        <button
          onClick={handleTriggerExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-all shadow-md active:scale-98"
        >
          {isExporting ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Packaging Master Files...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download Master Package</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {exportComplete && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Master delivery package and JSON manifest downloaded successfully.</span>
          </div>
          <button
            onClick={() => setExportComplete(false)}
            className="text-emerald-400 hover:underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Platform Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PLATFORM_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPlatform;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedPlatform(preset.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-[#181818] border-[#BFA46F] shadow-sm ring-1 ring-[#BFA46F]/30'
                  : 'bg-[#131313] border-[#222222] hover:border-[#303030]'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-[#F5F2EB]">{preset.name}</div>
                <div className="text-[11px] font-mono text-[#D4BE8D] mt-0.5">
                  {preset.aspectRatio} · {preset.recommendedFps}fps
                </div>
              </div>
              <div className="text-[10px] text-[#737373] font-mono">{preset.resolution}</div>
            </button>
          );
        })}
      </div>

      {/* Export Options & Subtitles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Metadata & Descriptions */}
        <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#BFA46F]">
              Platform Metadata Preset
            </h2>
            <button
              onClick={handleCopyTitle}
              className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] flex items-center gap-1"
            >
              {copiedTitle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#F5F2EB]">Title</label>
            <div className="p-2.5 rounded bg-[#0F0F0F] border border-[#2A2A2A] text-xs font-mono text-[#F5F2EB]">
              {optimizedTitle}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#F5F2EB]">Description & Tags</label>
            <div className="p-2.5 rounded bg-[#0F0F0F] border border-[#2A2A2A] text-xs text-[#8E8A82] font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {optimizedDescription}
            </div>
          </div>
        </div>

        {/* Right: Subtitle & Asset Downloads */}
        <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#BFA46F]">
            Auxiliary Delivery Assets
          </h2>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-[#0F0F0F] border border-[#222222] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F5F2EB]">SRT Subtitles</div>
                <div className="text-[10px] text-[#737373]">Synchronized for YouTube & Premiere</div>
              </div>
              <button
                onClick={handleDownloadSRT}
                className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] rounded text-xs text-[#F5F2EB] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#BFA46F]" />
                <span>.SRT</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#0F0F0F] border border-[#222222] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F5F2EB]">WebVTT Subtitles</div>
                <div className="text-[10px] text-[#737373]">HTML5 & Mobile Video standard</div>
              </div>
              <button
                onClick={handleDownloadVTT}
                className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] rounded text-xs text-[#F5F2EB] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#BFA46F]" />
                <span>.VTT</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#0F0F0F] border border-[#222222] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F5F2EB]">9:16 Hook Thumbnail</div>
                <div className="text-[10px] text-[#737373]">High-CTR canvas generated master poster</div>
              </div>
              <button
                onClick={handleDownloadThumbnail}
                className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#303030] rounded text-xs text-[#F5F2EB] flex items-center gap-1.5 transition-colors"
              >
                <Image className="w-3.5 h-3.5 text-[#BFA46F]" />
                <span>.PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Local FFmpeg CLI Command Inspector */}
      <div className="p-6 rounded-xl bg-[#141414] border border-[#242424] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#BFA46F]" />
            <h2 className="text-xs font-semibold text-[#F5F2EB]">
              Terminal & FFmpeg Pipeline Command (Run Locally)
            </h2>
          </div>
          <button
            onClick={handleCopyCommand}
            className="flex items-center gap-1.5 text-xs text-[#BFA46F] hover:text-[#D4BE8D] transition-colors"
          >
            {copiedFFmpeg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFFmpeg ? 'Command Copied' : 'Copy CLI Command'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[#202020] overflow-x-auto">
          <pre className="text-xs font-mono text-[#D4BE8D] whitespace-pre-wrap break-all leading-relaxed">
            {ffmpegCommand}
          </pre>
        </div>

        <p className="text-[11px] text-[#737373]">
          Executes 1080x1920 pan cropping, burn-in subtitle alignment, EBU R128 audio normalization,
          and H.264 CRF 18 slow preset encoding on any computer with FFmpeg installed.
        </p>
      </div>
    </div>
  );
};
