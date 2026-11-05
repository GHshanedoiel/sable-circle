CREATE TABLE `social_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`platform_name` text NOT NULL,
	`connected` integer DEFAULT false NOT NULL,
	`handle` text,
	`channel_name` text,
	`avatar_url` text,
	`auto_post_enabled` integer DEFAULT false NOT NULL,
	`default_privacy` text DEFAULT 'public' NOT NULL,
	`subscriber_count` text,
	`last_synced` text,
	`created_at` integer,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stored_media` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`clip_id` text,
	`title` text NOT NULL,
	`hook_text` text NOT NULL,
	`video_src` text NOT NULL,
	`thumbnail_url` text,
	`bin` text DEFAULT 'shorts_ready' NOT NULL,
	`aspect_ratio` text DEFAULT '9:16' NOT NULL,
	`duration_seconds` real NOT NULL,
	`virality_score` integer DEFAULT 90 NOT NULL,
	`scheduled_publish_time` text,
	`target_platforms_json` text DEFAULT '["youtube_shorts"]' NOT NULL,
	`auto_post_enabled` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'saved' NOT NULL,
	`notes` text,
	`created_at` integer,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clip_id`) REFERENCES `clips`(`id`) ON UPDATE no action ON DELETE no action
);
