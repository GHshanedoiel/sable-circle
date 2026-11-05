# Sable Circle — AI-Powered YouTube Shorts & Clipping Studio

> **Where vision meets precision.**

Sable Circle is a studio-grade YouTube Shorts and clipping engine designed for elite creators, directors, and executive producers. It transforms long-form dialogue, masterclasses, and cinematic interviews into high-status, retention-engineered 9:16 vertical shorts.

---

## 🏛️ Brand & Visual Identity

- **Tagline**: Where vision meets precision
- **Primary Color**: Deep Charcoal / Near Black (`#0F0F0F`)
- **Secondary Color**: Soft Ivory (`#F5F2EB`)
- **Accent Color**: Muted Gold (`#BFA46F`)
- **Typography**: Geometric Sans (`Outfit`), Clean Body (`Plus Jakarta Sans`), Tabular Telemetry (`JetBrains Mono`)
- **Monogram**: Interlocking SC emblem inside a dark circular medallion

---

## 🚀 Core Features

1. **Video Ingestion & Transcription**
   - Drag-and-drop local long-form footage (MP4, MOV, ProRes).
   - High-bitrate YouTube URL importer.
   - Automatic speaker diarization and phoneme-aligned word timestamps.

2. **AI Clip Detection & Virality Engine**
   - Cognitive pattern interrupt detection in the opening 1.8 seconds.
   - Multidimensional **Virality Score (0–100)**:
     - 0–2s Hook Disruption
     - Retention Velocity
     - Emotional Resonance
     - Dialogue Pacing & WPM Cadence
   - Smart ranking with manual override re-ordering and title customization.

3. **Interactive 9:16 Editing Studio**
   - Real-time video canvas with aspect ratio switching (9:16, 1:1, 16:9).
   - Smart subject reframing with horizontal pan calibration.
   - Live word-by-word **Karaoke subtitle animations** synced directly with playback.
   - Hook headline and CTA lower-third overlays.
   - Interactive waveform scrubber and precision trim handles.

4. **Brand Kit & Watermark Studio**
   - Custom logo watermark positioning (top-right, top-left, bottom-right, bottom-left).
   - Opacity and scale calibration.
   - Studio color token management.
   - Saved brand presets ready for one-click application.

5. **Batch Processing & Transcode Queue**
   - Multi-clip automated batch extractor from full-length footage.
   - Concurrent queue status tracking (Pending, Processing, Completed).
   - Bulk packaging and export triggers.

6. **Retention Analytics**
   - Second-by-second pre-publish retention curve simulator.
   - Drop-off risk diagnosis.
   - Platform affinity benchmarks (YouTube Shorts, TikTok, Instagram Reels, X).

7. **Export & Publishing**
   - High-fidelity 1080x1920 60fps / 4K ProRes exports.
   - Platform-optimized titles, descriptions, and hashtags.
   - `.SRT` and `.VTT` subtitle file downloads.
   - Copyable FFmpeg CLI command line generator for local terminal execution.

8. **Media Storage Vault & Creation Bins**
   - Dedicated storage vault where finished videos sit organized by purpose.
   - Specialized **Creation Bins**:
     - *YouTube Shorts Bin*: Reframed vertical 9:16 masters ready for immediate release.
     - *Raw Highlight Clips Bin*: Uncut dialogue moments cataloged for future edits.
     - *Drafts Bin*: In-progress cuts and caption stylings.
     - *Scheduled Queue Bin*: Mastered assets queued for timed auto-posting.
     - *Published Archive*: Lifetime historical distribution catalog.
   - Move videos between bins anytime, schedule posting dates/times, and download full deployment manifests.

9. **Auto-Posting AI & Social Media Access Hub**
   - Manage authenticated access to YouTube Shorts, TikTok Pro, Instagram Reels, and X.
   - Interactive OAuth credentials connector with channel handles, display names, and default privacy settings (Public, Unlisted, Private).
   - Autonomous **AI Auto-Pilot Scheduler** that dispatches queued shorts when the programmed audience retention slot arrives.

10. **Guided 4-Step Production Pipeline**
    - Step 1: Video Ingestion & Diarization
    - Step 2: AI Virality Matrix & Ranking
    - Step 3: 9:16 Shorts Studio Reframing
    - Step 4: Storage Vault & Autonomous Auto-Post
    - Pipeline Switcher between *YouTube Shorts Fast-Track* and *Long-Form Clipping*.

---

## 🛠️ Tech Stack

- **Frontend & Framework**: React 19 + TypeScript + Vite (Next.js App Router architecture ready)
- **Styling**: Tailwind CSS v4 + Motion
- **Database**: SQLite with Drizzle ORM (`drizzle-kit`)
- **Video Engine**: FFmpeg (60fps, EBU R128 `-14 LUFS` audio normalization, pan reframing)
- **AI Layer**: Abstracted intelligence engine with Gemini API integration hooks

---

## 💻 Local Machine Setup Guide

Follow these exact steps to run Sable Circle locally on your machine:

### 1. Prerequisites

Ensure you have installed:
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org))
- **npm** or **bun** / **pnpm**
- **FFmpeg** (for local CLI video rendering):
  - **macOS** (Homebrew): `brew install ffmpeg`
  - **Ubuntu / Debian**: `sudo apt update && sudo apt install ffmpeg`
  - **Windows** (winget): `winget install Gyan.FFmpeg` or `choco install ffmpeg`

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/sable-circle.git
cd sable-circle
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Open `.env` and verify the values:
```ini
GEMINI_API_KEY="your-gemini-api-key-here"
APP_URL="http://localhost:3000"
DATABASE_URL="file:./sable_circle.db"
```

### 5. Initialize the SQLite Database (Drizzle ORM)

Generate and run the database schema migrations:

```bash
# Generate schema migrations
npm run db:generate

# Apply migrations to local SQLite database
npm run db:migrate
```

*(Optional)* Launch Drizzle Studio to inspect and edit database records in your browser:
```bash
npm run db:studio
```

### 6. Start the Local Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🐙 How to Push to GitHub

To publish this project to your GitHub account:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit with a descriptive message
git commit -m "feat: initial Sable Circle studio prototype v1.001"

# 4. Set main branch
git branch -M main

# 5. Add your GitHub repository remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sable-circle.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📋 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite --port=3000 --host=0.0.0.0` | Starts local development server on port 3000 |
| `npm run build` | `vite build` | Compiles production assets into `/dist` |
| `npm run start` | `vite preview --port=3000 --host=0.0.0.0` | Serves production build locally |
| `npm run lint` | `tsc --noEmit` | Validates TypeScript types across the project |
| `npm run db:generate` | `drizzle-kit generate` | Generates SQLite migration files from `/db/schema.ts` |
| `npm run db:migrate` | `drizzle-kit migrate` | Applies pending migrations to `sable_circle.db` |
| `npm run db:studio` | `drizzle-kit studio` | Opens Drizzle visual database management UI |

---

## 🗺️ 3-Phase Roadmap

### Phase 1: Architecture, Ingestion & Virality Engine (Completed · v1.001)
- Drizzle ORM SQLite database schema for users, workspaces, long videos, transcripts, clips, and brand kits.
- Ingestion pipeline with drag-and-drop local video upload and YouTube URL fetcher.
- Speaker diarization output with word-level timestamps.
- AI Virality Matrix with multidimensional 0–100 scoring and manual ranking overrides.

### Phase 2: Interactive Studio & Brand Kit (Completed · v1.001)
- 9:16 vertical shorts reframing engine with pan calibration.
- Real-time word-by-word karaoke animated subtitles.
- Interactive timeline scrubber with trim in/out handles.
- Brand Kit manager with logo watermark positioning and palette tokens.
- Multi-clip automated batch extractor and transcoding queue.

### Phase 3: Analytics, Platform Exports & Cloud Scaling (Completed · v1.001)
- Second-by-second pre-publish retention simulator and drop-off diagnostics.
- Multi-platform presets (YouTube Shorts, TikTok, Instagram Reels, X).
- Auxiliary delivery downloads: `.SRT` and `.VTT` subtitle generators.
- Local FFmpeg CLI pipeline command builder.
- Complete documentation and local machine guide.

---

## 📄 License

Apache-2.0. Copyright (c) 2026 Sable Circle. All rights reserved.
