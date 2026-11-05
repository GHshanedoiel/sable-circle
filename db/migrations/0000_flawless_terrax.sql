CREATE TABLE `batch_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`total_items` integer DEFAULT 0 NOT NULL,
	`completed_items` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `brand_kits` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`logo_url` text,
	`watermark_position` text DEFAULT 'top-right' NOT NULL,
	`watermark_opacity` real DEFAULT 0.85 NOT NULL,
	`watermark_scale` real DEFAULT 1 NOT NULL,
	`primary_color` text DEFAULT '#0F0F0F' NOT NULL,
	`accent_color` text DEFAULT '#BFA46F' NOT NULL,
	`secondary_color` text DEFAULT '#F5F2EB' NOT NULL,
	`font_heading` text DEFAULT 'Outfit' NOT NULL,
	`font_sub` text DEFAULT 'Plus Jakarta Sans' NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clips` (
	`id` text PRIMARY KEY NOT NULL,
	`video_id` text NOT NULL,
	`title` text NOT NULL,
	`hook_text` text NOT NULL,
	`cta_text` text,
	`start_time` real NOT NULL,
	`end_time` real NOT NULL,
	`duration_seconds` real NOT NULL,
	`virality_score` integer NOT NULL,
	`hook_score` integer NOT NULL,
	`retention_score` integer NOT NULL,
	`emotion_score` integer NOT NULL,
	`pacing_score` integer NOT NULL,
	`reasoning` text NOT NULL,
	`tags_json` text DEFAULT '[]' NOT NULL,
	`aspect_ratio` text DEFAULT '9:16' NOT NULL,
	`crop_offset_x` real DEFAULT 50 NOT NULL,
	`caption_style_id` text DEFAULT 'cinema-gold' NOT NULL,
	`manual_rank_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `export_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`clip_id` text NOT NULL,
	`platform` text NOT NULL,
	`resolution` text DEFAULT '1080x1920' NOT NULL,
	`fps` integer DEFAULT 60 NOT NULL,
	`srt_content` text,
	`vtt_content` text,
	`optimized_title` text,
	`optimized_description` text,
	`optimized_tags_json` text,
	`status` text DEFAULT 'ready' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`clip_id`) REFERENCES `clips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transcripts` (
	`id` text PRIMARY KEY NOT NULL,
	`video_id` text NOT NULL,
	`raw_text` text NOT NULL,
	`segments_json` text NOT NULL,
	`detected_speakers_count` integer DEFAULT 1 NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`tier` text DEFAULT 'elite' NOT NULL,
	`credits_remaining` integer DEFAULT 100 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`title` text NOT NULL,
	`source_type` text NOT NULL,
	`source_url` text,
	`local_file_path` text,
	`duration_seconds` real NOT NULL,
	`resolution` text DEFAULT '1080p',
	`thumbnail_url` text,
	`status` text DEFAULT 'uploaded' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
