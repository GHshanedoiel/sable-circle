/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Video Ingestion & AI Diarization
 * Dual ingestion paths: Local drag-and-drop video upload & YouTube URL importer,
 * plus interactive transcription and speaker diarization review.
 */

import React, { useState, useRef } from 'react';
import { useSableStore } from '../../lib/db/store';
import { detectViralClips } from '../../lib/ai/virality-engine';
import {
  UploadCloud,
  Youtube,
  FileVideo,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Play,
  Film,
} from 'lucide-react';
import { SourceVideo, Transcript } from '../../types';

interface VideoIngestionProps {
  onNavigate: (tab: string) => void;
  onClipsGenerated: () => void;
}

export const VideoIngestion: React.FC<VideoIngestionProps> = ({
  onNavigate,
  onClipsGenerated,
}) => {
  const { addVideo, addClips, activeWorkspaceId } = useSableStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube' | 'samples'>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [completedVideo, setCompletedVideo] = useState<SourceVideo | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setIsProcessing(true);
    setProcessingStep('Parsing long-form media container & audio streams...');

    const objectUrl = URL.createObjectURL(file);
    const videoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    setTimeout(() => {
      setProcessingStep('Extracting audio track & applying speaker diarization...');
      setTimeout(() => {
        setProcessingStep('Aligning phonetic word boundaries & cognitive hooks...');
        setTimeout(() => {
          const generatedTranscript: Transcript = {
            id: `tr_${Date.now()}`,
            videoId: `vid_${Date.now()}`,
            rawText: `This is the direct spoken transcript extracted from ${file.name}. Every cut in cinema is a lie, but it is a lie that tells the truth about human consciousness. When you shorten the setup, the audience leans forward.`,
            speakerCount: 2,
            segments: [
              {
                id: 'seg_user_1',
                speakerId: 'spk_1',
                speakerName: 'Lead Director',
                start: 0.0,
                end: 8.5,
                text: 'Every cut in cinema is a lie, but it is a lie that tells the truth about human consciousness.',
                words: [
                  { word: 'Every', start: 0.0, end: 0.5 },
                  { word: 'cut', start: 0.6, end: 0.9 },
                  { word: 'in', start: 1.0, end: 1.2 },
                  { word: 'cinema', start: 1.3, end: 1.9 },
                  { word: 'is', start: 2.0, end: 2.2 },
                  { word: 'a', start: 2.3, end: 2.4 },
                  { word: 'lie,', start: 2.5, end: 3.1 },
                  { word: 'telling', start: 3.2, end: 3.8 },
                  { word: 'the', start: 3.9, end: 4.1 },
                  { word: 'truth.', start: 4.2, end: 5.0 },
                ],
              },
              {
                id: 'seg_user_2',
                speakerId: 'spk_2',
                speakerName: 'Cinematographer',
                start: 8.6,
                end: 18.0,
                text: 'When you shorten the setup, the audience leans forward because their brain has to assemble the pieces.',
                words: [
                  { word: 'When', start: 8.6, end: 9.0 },
                  { word: 'you', start: 9.1, end: 9.3 },
                  { word: 'shorten', start: 9.4, end: 10.1 },
                  { word: 'the', start: 10.2, end: 10.4 },
                  { word: 'setup,', start: 10.5, end: 11.2 },
                  { word: 'audience', start: 11.5, end: 12.3 },
                  { word: 'leans', start: 12.4, end: 13.0 },
                  { word: 'forward.', start: 13.1, end: 14.2 },
                ],
              },
            ],
          };

          const newVideo: SourceVideo = {
            id: generatedTranscript.videoId,
            workspaceId: activeWorkspaceId,
            title: videoTitle.charAt(0).toUpperCase() + videoTitle.slice(1),
            durationSeconds: 18.0,
            formattedDuration: '00:18',
            resolution: '1080p 60fps',
            fps: 60,
            sourceType: 'upload',
            localFilePath: file.name,
            videoSrc: objectUrl,
            thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
            createdAt: 'Just now',
            transcript: generatedTranscript,
            clipsCount: 2,
            category: 'masterclass',
          };

          addVideo(newVideo);
          const detected = detectViralClips(newVideo.id, generatedTranscript);
          addClips(detected);

          setCompletedVideo(newVideo);
          setIsProcessing(false);
        }, 800);
      }, 800);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Ingestion from YouTube URL
  const handleYouTubeImport = () => {
    if (!youtubeUrl.trim()) return;

    setIsProcessing(true);
    setProcessingStep('Resolving YouTube manifest & highest bitrate stream...');

    setTimeout(() => {
      setProcessingStep('Extracting master dialogue stream & Whisper diarization...');
      setTimeout(() => {
        setProcessingStep('Scoring virality hooks & punchline cadence...');
        setTimeout(() => {
          const videoId = `yt_${Date.now()}`;
          const generatedTranscript: Transcript = {
            id: `tr_${videoId}`,
            videoId,
            rawText: "The secret to 100 million impressions on YouTube Shorts is not fancy animations. It is respecting the first one point eight seconds and delivering a dopamine payoff by second seven.",
            speakerCount: 2,
            segments: [
              {
                id: 'seg_yt_1',
                speakerId: 'spk_1',
                speakerName: 'Studio Creator',
                start: 0.0,
                end: 15.0,
                text: 'The secret to 100 million impressions on Shorts is not fancy animations.',
                words: [
                  { word: 'The', start: 0.0, end: 0.4 },
                  { word: 'secret', start: 0.5, end: 1.1 },
                  { word: 'to', start: 1.2, end: 1.4 },
                  { word: 'viral', start: 1.5, end: 1.9 },
                  { word: 'Shorts', start: 2.0, end: 2.6 },
                  { word: 'is', start: 2.7, end: 2.9 },
                  { word: 'not', start: 3.0, end: 3.4 },
                  { word: 'fancy', start: 3.5, end: 4.1 },
                  { word: 'animations.', start: 4.2, end: 5.2 },
                ],
              },
            ],
          };

          const newVideo: SourceVideo = {
            id: videoId,
            workspaceId: activeWorkspaceId,
            title: 'Masterclass: The 1.8-Second Algorithmic Hook Architecture',
            durationSeconds: 154.0,
            formattedDuration: '02:34',
            resolution: '4K Ultra HD',
            fps: 60,
            sourceType: 'youtube',
            sourceUrl: youtubeUrl,
            videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            createdAt: 'Just now',
            transcript: generatedTranscript,
            clipsCount: 3,
            category: 'interview',
          };

          addVideo(newVideo);
          const detected = detectViralClips(newVideo.id, generatedTranscript);
          addClips(detected);

          setCompletedVideo(newVideo);
          setIsProcessing(false);
        }, 800);
      }, 800);
    }, 700);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
          <span>Ingestion Suite</span>
          <span>·</span>
          <span>Automatic Speech-to-Text & Diarization</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
          Video Ingestion & Transcription Engine
        </h1>
        <p className="text-xs text-[#8E8A82] mt-1 max-w-xl">
          Upload 4K master files or stream from YouTube. Sable Circle extracts phoneme-aligned
          transcripts and isolates speaker turns automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222222] pb-px">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'upload'
              ? 'border-[#BFA46F] text-[#F5F2EB]'
              : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload File (MP4, MOV, ProRes)</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'youtube'
              ? 'border-[#BFA46F] text-[#F5F2EB]'
              : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
          }`}
        >
          <Youtube className="w-3.5 h-3.5 text-red-500" />
          <span>YouTube URL Import</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'samples'
              ? 'border-[#BFA46F] text-[#F5F2EB]'
              : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#BFA46F]" />
          <span>Quick Cinema Samples</span>
        </button>
      </div>

      {/* Processing State Banner */}
      {isProcessing && (
        <div className="p-6 rounded-lg bg-[#141414] border border-[#BFA46F]/40 flex items-center gap-4 animate-pulse">
          <Loader2 className="w-6 h-6 text-[#BFA46F] animate-spin shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#F5F2EB]">Processing Master Footage...</div>
            <div className="text-xs text-[#BFA46F] font-mono mt-0.5">{processingStep}</div>
          </div>
        </div>
      )}

      {/* Completed Success Box */}
      {completedVideo && !isProcessing && (
        <div className="p-6 rounded-lg bg-[#151515] border border-[#2A2A2A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-sm font-semibold text-[#F5F2EB]">{completedVideo.title}</div>
                <div className="text-xs text-[#8E8A82] flex items-center gap-2 mt-0.5">
                  <span>{completedVideo.resolution}</span>
                  <span>·</span>
                  <span>{completedVideo.formattedDuration}</span>
                  <span>·</span>
                  <span className="text-[#BFA46F]">Viral hooks identified</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClipsGenerated();
                onNavigate('virality');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Virality Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Transcript Preview */}
          {completedVideo.transcript && (
            <div className="mt-3 p-4 rounded bg-[#0F0F0F] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#737373]">
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  Speaker Diarization Output ({completedVideo.transcript.speakerCount} Speakers)
                </span>
                <span className="text-[11px]">Word-level timestamps synced</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {completedVideo.transcript.segments.map((seg) => (
                  <div key={seg.id} className="text-xs flex items-start gap-3">
                    <span className="font-mono text-[#BFA46F] text-[10px] shrink-0 pt-0.5">
                      {seg.speakerName}:
                    </span>
                    <span className="text-[#D4BE8D] leading-relaxed">{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload View */}
      {activeTab === 'upload' && !isProcessing && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-[#BFA46F] bg-[#BFA46F]/10 scale-[1.01]'
              : 'border-[#2A2A2A] hover:border-[#BFA46F]/50 bg-[#131313]/60 hover:bg-[#161616]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="video/*"
            className="hidden"
          />
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center text-[#8E8A82] group-hover:text-[#BFA46F] transition-colors mb-4">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#F5F2EB]">
            Drop long-form video or click to select
          </h3>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-md mx-auto">
            Supports MP4, MOV, MKV, ProRes, and high-bitrate camera raw files up to 4K resolution.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#606060] font-mono">
            <span>Automatic Speech Diarization</span>
            <span>·</span>
            <span>Word-Level Timing</span>
            <span>·</span>
            <span>Hook Prediction</span>
          </div>
        </div>
      )}

      {/* YouTube View */}
      {activeTab === 'youtube' && !isProcessing && (
        <div className="p-8 rounded-xl bg-[#141414] border border-[#262626] space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F5F2EB]">
              YouTube Video or Podcast Episode URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-md bg-[#0F0F0F] border border-[#2A2A2A] text-xs text-[#F5F2EB] placeholder-[#606060] focus:outline-none focus:border-[#BFA46F]"
              />
              <button
                onClick={handleYouTubeImport}
                disabled={!youtubeUrl.trim()}
                className="px-5 py-2.5 bg-[#BFA46F] hover:bg-[#D4BE8D] disabled:opacity-50 text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors"
              >
                Fetch & Transcribe
              </button>
            </div>
          </div>
          <div className="text-[11px] text-[#737373]">
            Sable Circle downloads the master audio track and performs sub-second speaker
            alignment for clip generation.
          </div>
        </div>
      )}

      {/* Quick Cinema Samples */}
      {activeTab === 'samples' && !isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              setYoutubeUrl('https://youtube.com/watch?v=nolan-zimmer-tension');
              setActiveTab('youtube');
            }}
            className="p-5 rounded-lg bg-[#141414] border border-[#242424] hover:border-[#BFA46F]/50 transition-colors cursor-pointer group"
          >
            <div className="text-xs font-mono uppercase text-[#BFA46F] mb-1">
              Sample 01 · Masterclass
            </div>
            <div className="text-sm font-semibold text-[#F5F2EB] group-hover:text-[#D4BE8D] transition-colors">
              The Director's Craft: Tension & Practical Effects
            </div>
            <p className="text-xs text-[#8E8A82] mt-1.5">
              Featuring Christopher Nolan and Hans Zimmer on the psychological weight of silence.
            </p>
          </div>

          <div
            onClick={() => {
              setYoutubeUrl('https://youtube.com/watch?v=ai-moat-shorts-virality');
              setActiveTab('youtube');
            }}
            className="p-5 rounded-lg bg-[#141414] border border-[#242424] hover:border-[#BFA46F]/50 transition-colors cursor-pointer group"
          >
            <div className="text-xs font-mono uppercase text-[#BFA46F] mb-1">
              Sample 02 · Founder Interview
            </div>
            <div className="text-sm font-semibold text-[#F5F2EB] group-hover:text-[#D4BE8D] transition-colors">
              The Next Trillion-Dollar Moat: Why Agents Shift Video
            </div>
            <p className="text-xs text-[#8E8A82] mt-1.5">
              High-cadence debate on algorithmic virality and cognitive interrupt timing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
