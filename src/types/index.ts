/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Core Domain Type Definitions
 */

export type MembershipTier = 'free' | 'pro' | 'elite';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tier: MembershipTier;
  creditsRemaining: number;
  roleTitle: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  projectCount: number;
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface Transcript {
  id: string;
  videoId: string;
  segments: TranscriptSegment[];
  rawText: string;
  speakerCount: number;
}

export interface ViralityKeyMoment {
  timestamp: number;
  label: string;
  impact: 'critical' | 'high' | 'medium';
}

export interface ViralityBreakdown {
  overall: number; // 0 - 100
  hookStrength: number;
  retentionScore: number;
  emotionalResonance: number;
  pacingScore: number;
  reasoning: string;
  keyMoments: ViralityKeyMoment[];
}

export interface CaptionStyle {
  id: string;
  name: string;
  preview: string;
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  animation: 'karaoke' | 'pop' | 'cinema' | 'minimal';
  uppercase: boolean;
  position: 'bottom' | 'middle' | 'top';
  stroke?: boolean;
}

export interface Clip {
  id: string;
  videoId: string;
  title: string;
  hookText: string;
  ctaText?: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  aspectRatio: '9:16' | '1:1' | '16:9';
  cropOffsetX: number; // 0 to 100 (horizontal pan position)
  captionStyleId: string;
  virality: ViralityBreakdown;
  tags: string[];
  manualRankOrder: number;
  status: 'detected' | 'editing' | 'queued' | 'exported';
  reframeMode: 'face-focus' | 'center' | 'manual';
  volume: number; // 0 - 100
  speed: number; // 0.8 to 1.5
  audioDucking: boolean;
}

export interface SourceVideo {
  id: string;
  workspaceId: string;
  title: string;
  durationSeconds: number;
  formattedDuration: string;
  resolution: string;
  fps: number;
  sourceType: 'upload' | 'youtube';
  sourceUrl?: string;
  localFilePath?: string;
  videoSrc: string;
  thumbnailUrl: string;
  createdAt: string;
  transcript?: Transcript;
  clipsCount: number;
  category: 'cinema' | 'podcast' | 'interview' | 'masterclass' | 'keynote';
}

export interface BrandKit {
  id: string;
  workspaceId: string;
  name: string;
  logoUrl: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  watermarkOpacity: number;
  watermarkScale: number;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  fontHeading: string;
  fontSub: string;
  isDefault: boolean;
}

export interface BatchQueueItem {
  id: string;
  clipId: string;
  videoTitle: string;
  clipTitle: string;
  platform: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x';
  aspectRatio: '9:16' | '1:1' | '16:9';
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PlatformPreset {
  id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x';
  name: string;
  aspectRatio: '9:16' | '1:1' | '16:9';
  maxDurationSeconds: number;
  titleLimit: number;
  descLimit: number;
  hashtagLimit: number;
  recommendedFps: number;
  resolution: string;
  audioSpec: string;
}

export type StorageBin = 'shorts_ready' | 'raw_clips' | 'drafts' | 'scheduled' | 'published';

export interface StoredMediaItem {
  id: string;
  clipId: string;
  title: string;
  hookText: string;
  videoSrc: string;
  thumbnailUrl: string;
  bin: StorageBin;
  aspectRatio: '9:16' | '1:1' | '16:9';
  durationSeconds: number;
  viralityScore: number;
  scheduledPublishTime?: string;
  targetPlatforms: ('youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x')[];
  autoPostEnabled: boolean;
  status: 'saved' | 'scheduled' | 'published';
  createdAt: string;
  notes?: string;
}

export interface SocialAccount {
  id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x';
  platformName: string;
  connected: boolean;
  handle?: string;
  channelName?: string;
  avatarUrl?: string;
  autoPostEnabled: boolean;
  defaultPrivacy: 'public' | 'unlisted' | 'private';
  lastSynced?: string;
  subscriberCount?: string;
  authScopes?: string[];
}

