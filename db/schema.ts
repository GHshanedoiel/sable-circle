/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Drizzle ORM SQLite Schema
 * Core relational data layer for projects, long-form videos,
 * transcription segments, AI virality scoring, and brand kits.
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ---------------------------------------------------------------------------
// 1. Users & Membership Tiers
// ---------------------------------------------------------------------------
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  tier: text('tier', { enum: ['free', 'pro', 'elite'] }).default('elite').notNull(),
  creditsRemaining: integer('credits_remaining').default(100).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 2. Workspaces & Projects
// ---------------------------------------------------------------------------
export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  ownerId: text('owner_id').references(() => users.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 3. Long-Form Source Videos
// ---------------------------------------------------------------------------
export const videos = sqliteTable('videos', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  title: text('title').notNull(),
  sourceType: text('source_type', { enum: ['upload', 'youtube'] }).notNull(),
  sourceUrl: text('source_url'),
  localFilePath: text('local_file_path'),
  durationSeconds: real('duration_seconds').notNull(),
  resolution: text('resolution').default('1080p'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status', {
    enum: ['uploaded', 'transcribing', 'analyzed', 'error']
  }).default('uploaded').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 4. Transcripts & Speaker Diarization
// ---------------------------------------------------------------------------
export const transcripts = sqliteTable('transcripts', {
  id: text('id').primaryKey(),
  videoId: text('video_id').references(() => videos.id).notNull(),
  rawText: text('raw_text').notNull(),
  // JSON array containing word-level timestamps & speaker IDs
  segmentsJson: text('segments_json').notNull(),
  detectedSpeakersCount: integer('detected_speakers_count').default(1).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 5. AI Detected Viral Clips
// ---------------------------------------------------------------------------
export const clips = sqliteTable('clips', {
  id: text('id').primaryKey(),
  videoId: text('video_id').references(() => videos.id).notNull(),
  title: text('title').notNull(),
  hookText: text('hook_text').notNull(),
  ctaText: text('cta_text'),
  startTime: real('start_time').notNull(),
  endTime: real('end_time').notNull(),
  durationSeconds: real('duration_seconds').notNull(),
  // 0-100 Virality Score and factor breakdown
  viralityScore: integer('virality_score').notNull(),
  hookScore: integer('hook_score').notNull(),
  retentionScore: integer('retention_score').notNull(),
  emotionScore: integer('emotion_score').notNull(),
  pacingScore: integer('pacing_score').notNull(),
  reasoning: text('reasoning').notNull(),
  tagsJson: text('tags_json').default('[]').notNull(),
  aspectRatio: text('aspect_ratio', { enum: ['9:16', '1:1', '16:9'] }).default('9:16').notNull(),
  cropOffsetX: real('crop_offset_x').default(50).notNull(), // Horizontal focus 0-100%
  captionStyleId: text('caption_style_id').default('cinema-gold').notNull(),
  manualRankOrder: integer('manual_rank_order').default(0).notNull(),
  status: text('status', {
    enum: ['detected', 'edited', 'queued', 'exported']
  }).default('detected').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 6. Brand Kits
// ---------------------------------------------------------------------------
export const brandKits = sqliteTable('brand_kits', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  watermarkPosition: text('watermark_position', {
    enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  }).default('top-right').notNull(),
  watermarkOpacity: real('watermark_opacity').default(0.85).notNull(),
  watermarkScale: real('watermark_scale').default(1.0).notNull(),
  primaryColor: text('primary_color').default('#0F0F0F').notNull(),
  accentColor: text('accent_color').default('#BFA46F').notNull(),
  secondaryColor: text('secondary_color').default('#F5F2EB').notNull(),
  fontHeading: text('font_heading').default('Outfit').notNull(),
  fontSub: text('font_sub').default('Plus Jakarta Sans').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 7. Batch Queues & Bulk Processing
// ---------------------------------------------------------------------------
export const batchJobs = sqliteTable('batch_jobs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  totalItems: integer('total_items').default(0).notNull(),
  completedItems: integer('completed_items').default(0).notNull(),
  status: text('status', {
    enum: ['queued', 'processing', 'completed', 'failed']
  }).default('queued').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 8. Export Publishing Records
// ---------------------------------------------------------------------------
export const exportJobs = sqliteTable('export_jobs', {
  id: text('id').primaryKey(),
  clipId: text('clip_id').references(() => clips.id).notNull(),
  platform: text('platform', {
    enum: ['youtube_shorts', 'tiktok', 'instagram_reels', 'x']
  }).notNull(),
  resolution: text('resolution').default('1080x1920').notNull(),
  fps: integer('fps').default(60).notNull(),
  srtContent: text('srt_content'),
  vttContent: text('vtt_content'),
  optimizedTitle: text('optimized_title'),
  optimizedDescription: text('optimized_description'),
  optimizedTagsJson: text('optimized_tags_json'),
  status: text('status', {
    enum: ['queued', 'rendering', 'ready', 'failed']
  }).default('ready').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 9. Storage Vault & Categorized Creation Bins
// ---------------------------------------------------------------------------
export const storedMedia = sqliteTable('stored_media', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  clipId: text('clip_id').references(() => clips.id),
  title: text('title').notNull(),
  hookText: text('hook_text').notNull(),
  videoSrc: text('video_src').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  bin: text('bin', {
    enum: ['shorts_ready', 'raw_clips', 'drafts', 'scheduled', 'published']
  }).default('shorts_ready').notNull(),
  aspectRatio: text('aspect_ratio', { enum: ['9:16', '1:1', '16:9'] }).default('9:16').notNull(),
  durationSeconds: real('duration_seconds').notNull(),
  viralityScore: integer('virality_score').default(90).notNull(),
  scheduledPublishTime: text('scheduled_publish_time'),
  targetPlatformsJson: text('target_platforms_json').default('["youtube_shorts"]').notNull(),
  autoPostEnabled: integer('auto_post_enabled', { mode: 'boolean' }).default(false).notNull(),
  status: text('status', {
    enum: ['saved', 'scheduled', 'published']
  }).default('saved').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// 10. Social Media Accounts & Auto-Posting Access
// ---------------------------------------------------------------------------
export const socialAccounts = sqliteTable('social_accounts', {
  id: text('id').primaryKey(), // 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x'
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  platformName: text('platform_name').notNull(),
  connected: integer('connected', { mode: 'boolean' }).default(false).notNull(),
  handle: text('handle'),
  channelName: text('channel_name'),
  avatarUrl: text('avatar_url'),
  autoPostEnabled: integer('auto_post_enabled', { mode: 'boolean' }).default(false).notNull(),
  defaultPrivacy: text('default_privacy', {
    enum: ['public', 'unlisted', 'private']
  }).default('public').notNull(),
  subscriberCount: text('subscriber_count'),
  lastSynced: text('last_synced'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

