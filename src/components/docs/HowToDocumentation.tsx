/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — In-App Documentation & Architecture Guide
 * Comprehensive reference for local terminal setup, Drizzle SQLite migrations,
 * FFmpeg video encoding, GitHub push, and the 3-Phase Product Roadmap.
 */

import React, { useState } from 'react';
import { X, BookOpen, Terminal, Database, Sparkles, Check, Copy } from 'lucide-react';

interface HowToDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToDocumentation: React.FC<HowToDocumentationProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'pipeline' | 'phases' | 'setup' | 'github' | 'playbook'>('pipeline');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#2D2D2D] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black border border-[#BFA46F]/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#BFA46F]" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-[#F5F2EB]">
                Sable Circle — Studio Documentation & Architecture Guide
              </h2>
              <div className="text-[11px] text-[#8E8A82]">
                Version 1.001 Prototype · Where vision meets precision
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#222222] bg-[#131313] text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveSection('pipeline')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'pipeline'
                ? 'border-[#BFA46F] text-[#F5F2EB]'
                : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            Workflow Steps & Vault
          </button>
          <button
            onClick={() => setActiveSection('phases')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'phases'
                ? 'border-[#BFA46F] text-[#F5F2EB]'
                : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            3-Phase Roadmap
          </button>
          <button
            onClick={() => setActiveSection('setup')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSection === 'setup'
                ? 'border-[#BFA46F] text-[#F5F2EB]'
                : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            Local Machine & FFmpeg Setup
          </button>
          <button
            onClick={() => setActiveSection('github')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSection === 'github'
                ? 'border-[#BFA46F] text-[#F5F2EB]'
                : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            Push to GitHub
          </button>
          <button
            onClick={() => setActiveSection('playbook')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeSection === 'playbook'
                ? 'border-[#BFA46F] text-[#F5F2EB]'
                : 'border-transparent text-[#8E8A82] hover:text-[#F5F2EB]'
            }`}
          >
            Director Virality Playbook
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#CCCCCC] leading-relaxed">
          {/* Section 0: Production Workflow, Creation Bins & Auto-Posting */}
          {activeSection === 'pipeline' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F2EB] mb-1">
                  Guided 4-Step Production Pipeline & Specialized Workflows
                </h3>
                <p className="text-[#8E8A82]">
                  Sable Circle separates short-form vertical virality from long-form documentary clipping into dedicated, step-by-step pipelines with automated storage and scheduled publishing.
                </p>
              </div>

              {/* Numbered Steps Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#BFA46F] text-[#0F0F0F] flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="text-xs font-semibold text-[#F5F2EB]">Step 1: Video Ingestion & Diarization</span>
                  </div>
                  <p className="text-[11px] text-[#8E8A82]">
                    Import 4K/ProRes video files or paste any public YouTube URL. The ingestion engine automatically isolates audio tracks, parses word-level timestamps, and segments speaker dialogue turns.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#BFA46F] text-[#0F0F0F] flex items-center justify-center font-bold text-[10px]">2</span>
                    <span className="text-xs font-semibold text-[#F5F2EB]">Step 2: AI Virality Matrix & Ranking</span>
                  </div>
                  <p className="text-[11px] text-[#8E8A82]">
                    Evaluates hook strength (0-100), emotional peaks, pattern interrupts, and speech cadence. The matrix assigns an algorithmic Virality Score and ranks clips with manual override reordering.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#BFA46F] text-[#0F0F0F] flex items-center justify-center font-bold text-[10px]">3</span>
                    <span className="text-xs font-semibold text-[#F5F2EB]">Step 3: 9:16 Shorts Studio Reframing</span>
                  </div>
                  <p className="text-[11px] text-[#8E8A82]">
                    Interactive canvas reframing for vertical (9:16) video, live word-by-word karaoke captions, hook banners, Call-to-Action badges, audio normalization (-14 LUFS), and Brand Kit watermarks.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#BFA46F] text-[#0F0F0F] flex items-center justify-center font-bold text-[10px]">4</span>
                    <span className="text-xs font-semibold text-[#F5F2EB]">Step 4: Media Vault & Auto-Post AI</span>
                  </div>
                  <p className="text-[11px] text-[#8E8A82]">
                    Completed videos sit organized in your Storage Vault across specialized creation bins. Schedule release times or let the AI Auto-Pilot automatically publish to YouTube Shorts, TikTok, Reels, and X.
                  </p>
                </div>
              </div>

              {/* Storage Vault Creation Bins System */}
              <div className="p-4 rounded-xl bg-[#111111] border border-[#252525] space-y-3">
                <div className="text-xs font-semibold text-[#D4BE8D] uppercase tracking-wider font-mono">
                  Media Storage Vault & Creation Bins
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 bg-[#0D0D0D] rounded border border-[#1E1E1E]">
                    <div className="text-[#F5F2EB] font-medium mb-1">YouTube Shorts Bin</div>
                    <div className="text-[#737373]">Reframed 9:16 masters complete with styled karaoke captions, ready for instant publication.</div>
                  </div>
                  <div className="p-3 bg-[#0D0D0D] rounded border border-[#1E1E1E]">
                    <div className="text-[#F5F2EB] font-medium mb-1">Raw Highlight Clips Bin</div>
                    <div className="text-[#737373]">Uncut highlight moments extracted from long-form dialogue, kept for custom timeline assemblies.</div>
                  </div>
                  <div className="p-3 bg-[#0D0D0D] rounded border border-[#1E1E1E]">
                    <div className="text-[#F5F2EB] font-medium mb-1">Scheduled Queue Bin</div>
                    <div className="text-[#737373]">Videos awaiting autonomous publication at their programmed optimal watch times.</div>
                  </div>
                </div>
              </div>

              {/* Auto-Posting & Social Connections */}
              <div className="p-4 rounded-xl bg-[#111111] border border-[#252525] space-y-2 text-[11px]">
                <div className="text-xs font-semibold text-[#D4BE8D] uppercase tracking-wider font-mono">
                  Autonomous Social Media Distribution
                </div>
                <p className="text-[#8E8A82]">
                  Navigate to <strong>Auto-Post & Channels</strong> to link accounts via OAuth 2.0 PKCE. Set default privacy settings (Public, Unlisted, Private), configure target platforms, and monitor upcoming releases.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: 3-Phase Product Roadmap */}
          {activeSection === 'phases' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F2EB] mb-1">
                  Three-Phase Implementation Plan
                </h3>
                <p className="text-[#8E8A82]">
                  Sable Circle is architected to transition from prototype v1.001 to a multi-tenant,
                  GPU-accelerated desktop & cloud clipping suite.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#BFA46F]">
                    Phase 1 (Active · v1.001)
                  </div>
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    Core Architecture & AI Virality
                  </div>
                  <ul className="space-y-1 text-[#8E8A82] text-[11px] list-disc list-inside">
                    <li>Drizzle ORM SQLite relational database schema</li>
                    <li>Video Ingestion (Local MP4/MOV + YouTube URL)</li>
                    <li>Speaker diarization & word-level timing</li>
                    <li>AI Virality Matrix with 0-100 score modeling</li>
                    <li>Manual ranking override and title editing</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#D4BE8D]">
                    Phase 2 (Active · v1.001)
                  </div>
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    Interactive Studio & Brand Kit
                  </div>
                  <ul className="space-y-1 text-[#8E8A82] text-[11px] list-disc list-inside">
                    <li>One-click 9:16 vertical reframe engine</li>
                    <li>Live Word-by-Word Karaoke animated captions</li>
                    <li>Timeline trimmer with waveform scrubber</li>
                    <li>Brand Kit watermark placement & palette tokens</li>
                    <li>Multi-clip batch extractor & transcode queue</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#737373]">
                    Phase 3 (Active · v1.001)
                  </div>
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    Retention Analytics & Production
                  </div>
                  <ul className="space-y-1 text-[#8E8A82] text-[11px] list-disc list-inside">
                    <li>Pre-publish retention prediction curves</li>
                    <li>Cross-platform presets (Shorts, TikTok, Reels, X)</li>
                    <li>SRT & WebVTT subtitle package generation</li>
                    <li>FFmpeg CLI command generator for local terminal</li>
                    <li>Production documentation and GitHub instructions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Local Setup */}
          {activeSection === 'setup' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#F5F2EB]">
                Running Sable Circle Locally on Your Machine
              </h3>
              <p className="text-[#8E8A82]">
                Follow these exact steps to clone, configure, and launch Sable Circle locally with
                Node.js, Drizzle SQLite, and FFmpeg:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#0E0E0E] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#BFA46F]">
                      1. Clone & Install Dependencies
                    </span>
                    <button
                      onClick={() => copyToClipboard('git clone <YOUR_REPO_URL>\ncd sable-circle\nnpm install', 'c1')}
                      className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] flex items-center gap-1"
                    >
                      {copiedCode === 'c1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'c1' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black font-mono text-[#D4BE8D] text-[11px]">
{`git clone https://github.com/your-username/sable-circle.git
cd sable-circle
npm install`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0E0E0E] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#BFA46F]">
                      2. Configure Environment Variables
                    </span>
                    <button
                      onClick={() => copyToClipboard('cp .env.example .env', 'c2')}
                      className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] flex items-center gap-1"
                    >
                      {copiedCode === 'c2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'c2' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black font-mono text-[#D4BE8D] text-[11px]">
{`cp .env.example .env`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0E0E0E] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#BFA46F]">
                      3. Generate & Migrate SQLite Database (Drizzle ORM)
                    </span>
                    <button
                      onClick={() => copyToClipboard('npm run db:generate\nnpm run db:migrate', 'c3')}
                      className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] flex items-center gap-1"
                    >
                      {copiedCode === 'c3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'c3' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black font-mono text-[#D4BE8D] text-[11px]">
{`npm run db:generate
npm run db:migrate`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0E0E0E] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#BFA46F]">
                      4. Start the Development Server
                    </span>
                    <button
                      onClick={() => copyToClipboard('npm run dev', 'c4')}
                      className="text-xs text-[#8E8A82] hover:text-[#F5F2EB] flex items-center gap-1"
                    >
                      {copiedCode === 'c4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'c4' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black font-mono text-[#D4BE8D] text-[11px]">
{`npm run dev`}
                  </pre>
                  <p className="text-[11px] text-[#8E8A82]">
                    Open <span className="font-mono text-[#F5F2EB]">http://localhost:3000</span> in your browser.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: GitHub Push */}
          {activeSection === 'github' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#F5F2EB]">
                Pushing Your Codebase to GitHub
              </h3>
              <p className="text-[#8E8A82]">
                Execute the following commands in your project terminal to commit and push to a new
                GitHub repository:
              </p>

              <div className="p-4 rounded-lg bg-[#0E0E0E] border border-[#222222] space-y-3">
                <pre className="p-3 rounded bg-black font-mono text-[#D4BE8D] text-[11px] leading-relaxed">
{`git init
git add .
git commit -m "feat: initial Sable Circle studio v1.001 prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sable-circle.git
git push -u origin main`}
                </pre>
                <div className="text-[11px] text-[#8E8A82]">
                  The included <span className="font-mono text-[#D4BE8D]">.gitignore</span> automatically
                  excludes node_modules, build caches, and local video processing files.
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Virality Playbook */}
          {activeSection === 'playbook' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#F5F2EB]">
                The Executive YouTube Shorts & Retention Playbook
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#0F0F0F] border border-[#222222]">
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    1. The 1.8-Second Cognitive Disruption Rule
                  </div>
                  <p className="text-[11px] text-[#8E8A82] mt-1">
                    The viewer makes a subconscious swipe decision in under 2 seconds. The opening
                    frame must feature a provocative statement, paradoxical question, or visual
                    pattern interrupt before the logo or name appears.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0F0F0F] border border-[#222222]">
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    2. Speech Cadence & Dialogue Pacing
                  </div>
                  <p className="text-[11px] text-[#8E8A82] mt-1">
                    Optimal viral speech cadence is 2.4 to 3.2 words per second (140–190 WPM). Pauses
                    longer than 0.8 seconds must either carry immense dramatic weight or be trimmed
                    out in the Editing Studio.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0F0F0F] border border-[#222222]">
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    3. EBU R128 Audio Normalization (-14 LUFS)
                  </div>
                  <p className="text-[11px] text-[#8E8A82] mt-1">
                    YouTube Shorts automatically compresses audio that exceeds -14 LUFS. Sable Circle's
                    FFmpeg export preset uses the <span className="font-mono text-[#D4BE8D]">loudnorm</span> filter
                    to ensure your dialogue sounds crisp, punchy, and loud without clipping.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#222222] bg-[#111111]">
          <span className="text-[11px] text-[#737373]">
            Sable Circle Architecture · Confidential & Proprietary
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
