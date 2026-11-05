/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Interactive Editing Studio & 9:16 Reframe Engine
 * Real-time video player with canvas reframing, word-by-word karaoke captions,
 * trim handles, waveform visualization, and brand watermark overlay.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Scissors,
  Layers,
  Sparkles,
  Maximize2,
  Check,
  Smartphone,
  Square,
  Monitor,
  MoveHorizontal,
  ChevronRight,
  Download,
  FolderArchive,
  Clock,
  Calendar,
} from 'lucide-react';
import { Clip, CaptionStyle, StorageBin } from '../../types';

interface EditingStudioProps {
  clip: Clip;
  onNavigate: (tab: string) => void;
  onExportClip: (clip: Clip) => void;
}

export const EditingStudio: React.FC<EditingStudioProps> = ({
  clip: initialClip,
  onNavigate,
  onExportClip,
}) => {
  const {
    videos,
    captionStyles,
    brandKits,
    activeBrandKit,
    updateClip,
    enqueueClip,
    saveClipToStorage,
  } = useSableStore();
  const [clip, setClip] = useState<Clip>(initialClip);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialClip.startTime);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCaptionStyleId, setSelectedCaptionStyleId] = useState(initialClip.captionStyleId || 'cinema-gold');
  const [activeTab, setActiveTab] = useState<'reframing' | 'captions' | 'overlay' | 'audio'>('reframing');
  const [customHook, setCustomHook] = useState(initialClip.hookText);
  const [customCta, setCustomCta] = useState(initialClip.ctaText || 'Subscribe for the Director Cut');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<StorageBin>('shorts_ready');
  const [saveScheduleTime, setSaveScheduleTime] = useState('Tomorrow at 09:00 AM (EST)');
  const [autoPostCheck, setAutoPostCheck] = useState(true);
  const [savedVaultSuccess, setSavedVaultSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync internal state if initialClip changes from parent
  useEffect(() => {
    setClip(initialClip);
    setCurrentTime(initialClip.startTime);
    setCustomHook(initialClip.hookText);
    setCustomCta(initialClip.ctaText || '');
    if (videoRef.current) {
      videoRef.current.currentTime = initialClip.startTime;
    }
  }, [initialClip]);

  const sourceVideo = videos.find((v) => v.id === clip.videoId) || videos[0];
  const currentCaptionStyle = captionStyles.find((s) => s.id === selectedCaptionStyleId) || captionStyles[0];

  // Sync playback time loop within [clip.startTime, clip.endTime]
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      if (time >= clip.endTime) {
        video.currentTime = clip.startTime;
        setCurrentTime(clip.startTime);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [clip.startTime, clip.endTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (video.currentTime >= clip.endTime || video.currentTime < clip.startTime) {
        video.currentTime = clip.startTime;
      }
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(clip.startTime, Math.min(clip.endTime, newTime));
    video.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const handleTrimStartChange = (start: number) => {
    const newStart = Math.min(start, clip.endTime - 3);
    const updated = {
      ...clip,
      startTime: Math.round(newStart * 10) / 10,
      durationSeconds: Math.round((clip.endTime - newStart) * 10) / 10,
    };
    setClip(updated);
    updateClip(updated);
    if (videoRef.current && currentTime < newStart) {
      videoRef.current.currentTime = newStart;
    }
  };

  const handleTrimEndChange = (end: number) => {
    const newEnd = Math.max(end, clip.startTime + 3);
    const updated = {
      ...clip,
      endTime: Math.round(newEnd * 10) / 10,
      durationSeconds: Math.round((newEnd - clip.startTime) * 10) / 10,
    };
    setClip(updated);
    updateClip(updated);
  };

  const handleAspectChange = (aspect: '9:16' | '1:1' | '16:9') => {
    const updated = { ...clip, aspectRatio: aspect };
    setClip(updated);
    updateClip(updated);
  };

  const handleCropOffsetChange = (offset: number) => {
    const updated = { ...clip, cropOffsetX: offset };
    setClip(updated);
    updateClip(updated);
  };

  // Extract current speaking words for live karaoke caption preview
  const currentSegment = sourceVideo.transcript?.segments.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  // Formatting helper for timecode display
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const clipProgressPercent = Math.max(
    0,
    Math.min(100, ((currentTime - clip.startTime) / (clip.endTime - clip.startTime)) * 100)
  );

  const [enqueuedSuccess, setEnqueuedSuccess] = useState(false);

  const handleEnqueue = () => {
    enqueueClip(clip, 'youtube_shorts');
    setEnqueuedSuccess(true);
    setTimeout(() => setEnqueuedSuccess(false), 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Precision Editor</span>
            <span>·</span>
            <span>Clip #{clip.manualRankOrder}</span>
            <span>·</span>
            <span className="text-[#BFA46F]">Viral Score {clip.virality.overall}/100</span>
          </div>
          <h1 className="text-xl font-display font-bold text-[#F5F2EB] flex items-center gap-3">
            <span>{clip.title}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-medium text-[#F5F2EB] rounded transition-colors"
          >
            {savedVaultSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Saved in Vault!</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-3.5 h-3.5 text-[#BFA46F]" />
                <span>Save to Vault & Bins</span>
              </>
            )}
          </button>

          <button
            onClick={handleEnqueue}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-medium text-[#F5F2EB] rounded transition-colors"
          >
            {enqueuedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Added to Queue!</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-[#BFA46F]" />
                <span>Enqueue Batch</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onExportClip(clip);
              onNavigate('export');
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master Short</span>
          </button>
        </div>
      </div>

      {/* Save to Vault Creation Bin Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2D2D2D] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#BFA46F]/10 border border-[#BFA46F]/30 flex items-center justify-center text-xs font-bold text-[#BFA46F]">
                  <FolderArchive className="w-4 h-4 text-[#BFA46F]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F2EB]">Save Clip to Media Storage Vault</h3>
                  <div className="text-[11px] text-[#737373]">Organize into a creation bin or schedule auto-post</div>
                </div>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-[#737373] hover:text-[#F5F2EB] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8E8A82] mb-1.5">
                  Select Target Creation Bin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'shorts_ready', label: 'YouTube Shorts Bin', desc: 'Ready for 9:16 distribution' },
                    { id: 'raw_clips', label: 'Raw Highlight Clips Bin', desc: 'Unedited moment extracts' },
                    { id: 'drafts', label: 'Drafts Bin', desc: 'Work in progress' },
                    { id: 'scheduled', label: 'Scheduled Queue Bin', desc: 'Ready for auto-posting' },
                  ].map((bin) => (
                    <button
                      key={bin.id}
                      onClick={() => setSelectedBin(bin.id as StorageBin)}
                      className={`p-3 rounded border text-left transition-colors ${
                        selectedBin === bin.id
                          ? 'bg-[#BFA46F]/15 border-[#BFA46F] text-[#F5F2EB]'
                          : 'bg-[#181818] border-[#252525] text-[#8E8A82] hover:text-[#F5F2EB]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#F5F2EB]">{bin.label}</div>
                      <div className="text-[10px] text-[#737373] mt-0.5">{bin.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedBin === 'scheduled' && (
                <div className="p-3.5 bg-[#181818] border border-[#2B2B2B] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4BE8D]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Auto-Post Schedule Timing</span>
                  </div>
                  <select
                    value={saveScheduleTime}
                    onChange={(e) => setSaveScheduleTime(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2D2D2D] rounded px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#BFA46F]"
                  >
                    <option value="Today at 06:00 PM (EST) · Peak Evening Slot">
                      Today at 06:00 PM (EST) · Peak Evening Slot
                    </option>
                    <option value="Tomorrow at 09:00 AM (EST) · Morning Rush">
                      Tomorrow at 09:00 AM (EST) · Morning Rush
                    </option>
                    <option value="Tomorrow at 12:30 PM (EST) · Lunchtime Break">
                      Tomorrow at 12:30 PM (EST) · Lunchtime Break
                    </option>
                    <option value="Saturday at 11:00 AM (EST) · Weekend Primetime">
                      Saturday at 11:00 AM (EST) · Weekend Primetime
                    </option>
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={autoPostCheck}
                      onChange={(e) => setAutoPostCheck(e.target.checked)}
                      className="accent-[#BFA46F] rounded"
                    />
                    <span className="text-[11px] text-[#A5A096]">
                      Automatically dispatch via AI Auto-Pilot when release time arrives
                    </span>
                  </label>
                </div>
              )}

              <div className="text-[11px] text-[#737373] bg-[#101010] p-2.5 rounded border border-[#1E1E1E]">
                Saved videos remain permanently in your workspace storage. You can view, re-edit, change bins, or export them anytime from the <strong>Storage Vault</strong> tab.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#222222]">
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  onNavigate('vault');
                }}
                className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] underline underline-offset-4"
              >
                Go directly to Vault
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] text-xs font-medium text-[#8E8A82] hover:text-[#F5F2EB] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    saveClipToStorage(
                      clip,
                      selectedBin,
                      selectedBin === 'scheduled' ? saveScheduleTime : undefined,
                      autoPostCheck
                    );
                    setSavedVaultSuccess(true);
                    setIsSaveModalOpen(false);
                    setTimeout(() => setSavedVaultSuccess(false), 3000);
                  }}
                  className="px-4 py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm & Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Viewport: Canvas on left/center, Controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Video Canvas & Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Aspect Ratio Switcher Bar */}
          <div className="flex items-center gap-2 p-1 bg-[#141414] border border-[#222222] rounded-lg mb-4 text-xs">
            <button
              onClick={() => handleAspectChange('9:16')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                clip.aspectRatio === '9:16'
                  ? 'bg-[#222222] text-[#F5F2EB] shadow-sm font-semibold'
                  : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#BFA46F]" />
              <span>9:16 Vertical Short</span>
            </button>

            <button
              onClick={() => handleAspectChange('1:1')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                clip.aspectRatio === '1:1'
                  ? 'bg-[#222222] text-[#F5F2EB] shadow-sm font-semibold'
                  : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              <Square className="w-3.5 h-3.5 text-[#8E8A82]" />
              <span>1:1 Square</span>
            </button>

            <button
              onClick={() => handleAspectChange('16:9')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                clip.aspectRatio === '16:9'
                  ? 'bg-[#222222] text-[#F5F2EB] shadow-sm font-semibold'
                  : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-[#8E8A82]" />
              <span>16:9 Master</span>
            </button>
          </div>

          {/* Video Viewport Frame with Smart Reframe Masking */}
          <div
            className={`relative rounded-xl overflow-hidden bg-black border border-[#2A2A2A] shadow-2xl transition-all duration-300 ${
              clip.aspectRatio === '9:16'
                ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
                : clip.aspectRatio === '1:1'
                ? 'w-[360px] sm:w-[420px] aspect-square'
                : 'w-full max-w-[560px] aspect-[16/9]'
            }`}
          >
            {/* HTML5 Native Video Element */}
            <video
              ref={videoRef}
              src={sourceVideo.videoSrc}
              muted={isMuted}
              playsInline
              className="absolute h-full max-w-none object-cover transition-transform duration-200"
              style={{
                // Transform horizontal offset based on cropOffsetX (0% - 100%)
                left: `${clip.cropOffsetX}%`,
                transform: 'translateX(-50%)',
                minWidth: clip.aspectRatio === '9:16' ? '300%' : '100%',
              }}
            />

            {/* Gradient Scrim for caption contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

            {/* Brand Watermark Overlay */}
            {activeBrandKit && (
              <div
                className={`absolute p-4 pointer-events-none ${
                  activeBrandKit.watermarkPosition === 'top-left'
                    ? 'top-2 left-2'
                    : activeBrandKit.watermarkPosition === 'bottom-left'
                    ? 'bottom-16 left-2'
                    : activeBrandKit.watermarkPosition === 'bottom-right'
                    ? 'bottom-16 right-2'
                    : 'top-2 right-2'
                }`}
                style={{ opacity: activeBrandKit.watermarkOpacity }}
              >
                <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <img
                    src={activeBrandKit.logoUrl}
                    alt="Brand Logo"
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] font-mono tracking-wider text-[#F5F2EB] uppercase">
                    SABLE
                  </span>
                </div>
              </div>
            )}

            {/* Top Hook Banner Overlay */}
            <div className="absolute top-8 inset-x-3 text-center pointer-events-none">
              <span className="inline-block bg-[#0F0F0F]/90 border border-[#BFA46F]/50 px-3 py-1 rounded text-[11px] font-display font-bold uppercase tracking-wider text-[#F5F2EB] shadow-lg">
                {customHook}
              </span>
            </div>

            {/* Live Synchronized Karaoke Captions */}
            <div
              className={`absolute inset-x-4 pointer-events-none text-center ${
                currentCaptionStyle.position === 'top'
                  ? 'top-24'
                  : currentCaptionStyle.position === 'middle'
                  ? 'top-1/2 -translate-y-1/2'
                  : 'bottom-12'
              }`}
            >
              {currentSegment ? (
                <div
                  className="inline-block px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-xl"
                  style={{ backgroundColor: currentCaptionStyle.backgroundColor }}
                >
                  <p
                    className={`text-sm sm:text-base font-bold leading-tight ${
                      currentCaptionStyle.uppercase ? 'uppercase' : ''
                    }`}
                    style={{
                      fontFamily: currentCaptionStyle.fontFamily,
                      color: currentCaptionStyle.textColor,
                    }}
                  >
                    {currentSegment.words && currentSegment.words.length > 0 ? (
                      currentSegment.words.map((w, idx) => {
                        const isSpoken = currentTime >= w.start && currentTime <= w.end;
                        const hasPassed = currentTime > w.end;
                        return (
                          <span
                            key={idx}
                            className={`inline-block mr-1.5 transition-all duration-100 ${
                              isSpoken
                                ? 'scale-110 font-black'
                                : hasPassed
                                ? 'opacity-90'
                                : 'opacity-40'
                            }`}
                            style={{
                              color: isSpoken
                                ? currentCaptionStyle.highlightColor
                                : currentCaptionStyle.textColor,
                            }}
                          >
                            {w.word}
                          </span>
                        );
                      })
                    ) : (
                      <span>{currentSegment.text}</span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="text-xs font-mono text-[#D4BE8D] opacity-60">
                  "{clip.hookText}"
                </div>
              )}
            </div>

            {/* Bottom CTA Overlay */}
            {customCta && (
              <div className="absolute bottom-3 inset-x-4 text-center pointer-events-none">
                <span className="text-[10px] text-[#BFA46F] font-mono tracking-wider uppercase opacity-90 drop-shadow">
                  {customCta}
                </span>
              </div>
            )}
          </div>

          {/* Scrubber & Timeline Bar */}
          <div className="w-full max-w-xl mt-6 p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-3">
            {/* Playback Controls & Timecodes */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] flex items-center justify-center transition-colors shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSeek(clip.startTime)}
                  className="p-1.5 text-[#8E8A82] hover:text-[#F5F2EB] transition-colors"
                  title="Return to clip start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-[#8E8A82] hover:text-[#F5F2EB] transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-xs tabular-nums text-[#D4BE8D] flex items-center gap-2">
                <span>{formatTimecode(currentTime)}</span>
                <span className="text-[#606060]">/</span>
                <span className="text-[#8E8A82]">{formatTimecode(clip.endTime)}</span>
                <span className="text-[10px] text-[#606060] font-mono">
                  ({clip.durationSeconds.toFixed(1)}s total)
                </span>
              </div>
            </div>

            {/* Timeline Waveform & Scrubber Track */}
            <div className="relative h-10 bg-[#0F0F0F] rounded-md border border-[#262626] flex items-center overflow-hidden px-2 select-none">
              {/* Simulated Audio Waveform Bars */}
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30 pointer-events-none">
                {Array.from({ length: 48 }).map((_, i) => {
                  const height = 20 + Math.sin(i * 0.7) * 40 + Math.cos(i * 1.2) * 30;
                  return (
                    <div
                      key={i}
                      className="w-1 bg-[#BFA46F] rounded-full"
                      style={{ height: `${Math.max(15, Math.min(85, height))}%` }}
                    />
                  );
                })}
              </div>

              {/* Played Progress Overlay */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#BFA46F]/20 pointer-events-none"
                style={{ width: `${clipProgressPercent}%` }}
              />

              {/* Interactive Scrubber Input */}
              <input
                type="range"
                min={clip.startTime}
                max={clip.endTime}
                step={0.05}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full relative z-10 cursor-pointer h-4 opacity-75"
              />
            </div>

            {/* Trim In / Out Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1F1F1F] text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[#8E8A82] text-[11px]">
                  <span>Trim In Handle</span>
                  <span className="font-mono text-[#D4BE8D]">{clip.startTime.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, clip.endTime - 2)}
                  step={0.2}
                  value={clip.startTime}
                  onChange={(e) => handleTrimStartChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8E8A82] text-[11px]">
                  <span>Trim Out Handle</span>
                  <span className="font-mono text-[#D4BE8D]">{clip.endTime.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min={clip.startTime + 2}
                  max={sourceVideo.durationSeconds}
                  step={0.2}
                  value={clip.endTime}
                  onChange={(e) => handleTrimEndChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Customization Tabs */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#242424] rounded-xl p-6 space-y-6">
          {/* Studio Tool Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#101010] border border-[#202020] rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('reframing')}
              className={`py-1.5 rounded transition-colors text-center ${
                activeTab === 'reframing' ? 'bg-[#222222] text-[#F5F2EB]' : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              Reframe
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`py-1.5 rounded transition-colors text-center ${
                activeTab === 'captions' ? 'bg-[#222222] text-[#F5F2EB]' : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              Captions
            </button>
            <button
              onClick={() => setActiveTab('overlay')}
              className={`py-1.5 rounded transition-colors text-center ${
                activeTab === 'overlay' ? 'bg-[#222222] text-[#F5F2EB]' : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              Hooks
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`py-1.5 rounded transition-colors text-center ${
                activeTab === 'audio' ? 'bg-[#222222] text-[#F5F2EB]' : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              Audio
            </button>
          </div>

          {/* Tab 1: 9:16 Vertical Reframing Controls */}
          {activeTab === 'reframing' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#F5F2EB]">Smart Subject Tracking & Pan</div>
                <p className="text-[11px] text-[#8E8A82] mt-0.5">
                  Calibrate the 9:16 vertical viewport frame to track speakers or cinematic action.
                </p>
              </div>

              {/* Preset Reframing Positions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCropOffsetChange(25)}
                  className={`p-2.5 rounded border text-xs text-center transition-all ${
                    clip.cropOffsetX === 25
                      ? 'bg-[#1F1F1F] border-[#BFA46F] text-[#F5F2EB]'
                      : 'bg-[#181818] border-[#2A2A2A] text-[#8E8A82] hover:text-[#F5F2EB]'
                  }`}
                >
                  <div className="font-medium">Left Third</div>
                  <div className="text-[10px] text-[#606060] font-mono">25% Pan</div>
                </button>

                <button
                  onClick={() => handleCropOffsetChange(50)}
                  className={`p-2.5 rounded border text-xs text-center transition-all ${
                    clip.cropOffsetX === 50
                      ? 'bg-[#1F1F1F] border-[#BFA46F] text-[#F5F2EB]'
                      : 'bg-[#181818] border-[#2A2A2A] text-[#8E8A82] hover:text-[#F5F2EB]'
                  }`}
                >
                  <div className="font-medium">Center Focus</div>
                  <div className="text-[10px] text-[#BFA46F] font-mono">50% Pan</div>
                </button>

                <button
                  onClick={() => handleCropOffsetChange(75)}
                  className={`p-2.5 rounded border text-xs text-center transition-all ${
                    clip.cropOffsetX === 75
                      ? 'bg-[#1F1F1F] border-[#BFA46F] text-[#F5F2EB]'
                      : 'bg-[#181818] border-[#2A2A2A] text-[#8E8A82] hover:text-[#F5F2EB]'
                  }`}
                >
                  <div className="font-medium">Right Third</div>
                  <div className="text-[10px] text-[#606060] font-mono">75% Pan</div>
                </button>
              </div>

              {/* Fine Pan Slider */}
              <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#222222] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8A82] flex items-center gap-1.5">
                    <MoveHorizontal className="w-3.5 h-3.5 text-[#BFA46F]" />
                    <span>Fine Horizontal Pan</span>
                  </span>
                  <span className="font-mono text-[#D4BE8D] tabular-nums">
                    {clip.cropOffsetX}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={clip.cropOffsetX}
                  onChange={(e) => handleCropOffsetChange(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Caption Styling System */}
          {activeTab === 'captions' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#F5F2EB]">Caption Typography & Animation</div>
                <p className="text-[11px] text-[#8E8A82] mt-0.5">
                  High-retention subtitle animations synced with speech phonemes.
                </p>
              </div>

              <div className="space-y-2.5">
                {captionStyles.map((style) => {
                  const isSelected = selectedCaptionStyleId === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => {
                        setSelectedCaptionStyleId(style.id);
                        const updated = { ...clip, captionStyleId: style.id };
                        setClip(updated);
                        updateClip(updated);
                      }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#BFA46F] ring-1 ring-[#BFA46F]/30'
                          : 'bg-[#161616] border-[#252525] hover:border-[#333333]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-[#F5F2EB] flex items-center gap-2">
                          <span>{style.name}</span>
                          <span className="text-[10px] text-[#BFA46F] font-mono capitalize">
                            · {style.animation}
                          </span>
                        </div>
                        <div
                          className="text-xs font-bold font-display"
                          style={{ color: style.highlightColor }}
                        >
                          "{style.preview}"
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-[#BFA46F]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Hook & CTA Overlays */}
          {activeTab === 'overlay' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F2EB]">
                  Opening 1.8s Hook Text
                </label>
                <input
                  type="text"
                  value={customHook}
                  onChange={(e) => {
                    setCustomHook(e.target.value);
                    const updated = { ...clip, hookText: e.target.value };
                    setClip(updated);
                    updateClip(updated);
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#0F0F0F] border border-[#2D2D2D] rounded-md text-[#F5F2EB] font-mono focus:outline-none focus:border-[#BFA46F]"
                />
                <p className="text-[11px] text-[#737373]">
                  Appears during the first 3.5 seconds to maximize algorithmic swipe-through retention.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F2EB]">
                  Call to Action (CTA) Text
                </label>
                <input
                  type="text"
                  value={customCta}
                  onChange={(e) => {
                    setCustomCta(e.target.value);
                    const updated = { ...clip, ctaText: e.target.value };
                    setClip(updated);
                    updateClip(updated);
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#0F0F0F] border border-[#2D2D2D] rounded-md text-[#F5F2EB] font-mono focus:outline-none focus:border-[#BFA46F]"
                />
                <p className="text-[11px] text-[#737373]">
                  Subtle lower-third nudge for channel subscription and comments.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Audio & Pacing */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#F5F2EB]">Audio Processing & Mastering</div>
                <p className="text-[11px] text-[#8E8A82] mt-0.5">
                  EBU R128 standard (-14 LUFS) normalization for YouTube Shorts & TikTok.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0F0F0F] border border-[#222222] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8A82]">Dialogue Volume Boost</span>
                  <span className="font-mono text-[#D4BE8D]">{clip.volume}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={clip.volume}
                  onChange={(e) => {
                    const vol = parseInt(e.target.value, 10);
                    const updated = { ...clip, volume: vol };
                    setClip(updated);
                    updateClip(updated);
                    if (videoRef.current) {
                      videoRef.current.volume = Math.min(1.0, vol / 100);
                    }
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#181818] border border-[#252525] text-xs">
                <div>
                  <div className="font-medium text-[#F5F2EB]">Automatic Audio Ducking</div>
                  <div className="text-[10px] text-[#737373]">Lowers background music when speech begins</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...clip, audioDucking: !clip.audioDucking };
                    setClip(updated);
                    updateClip(updated);
                  }}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    clip.audioDucking ? 'bg-[#BFA46F]' : 'bg-[#2E2E2E]'
                  }`}
                  aria-label="Toggle audio ducking"
                >
                  <div
                    className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-transform ${
                      clip.audioDucking ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Studio Quick Actions */}
          <div className="pt-4 border-t border-[#202020] space-y-2">
            <button
              onClick={() => {
                onExportClip(clip);
                onNavigate('export');
              }}
              className="w-full py-2.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Configure Export Package</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
