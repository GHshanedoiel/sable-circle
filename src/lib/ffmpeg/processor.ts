/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — FFmpeg Video Processing & Platform Export Utilities
 * Generates production-ready FFmpeg command lines for local terminal or
 * cloud transcoding workers, plus client-side subtitle and thumbnail generators.
 */

import { Clip, BrandKit, Transcript } from '../../types';

export interface FFmpegCommandConfig {
  inputPath: string;
  outputPath: string;
  clip: Clip;
  brandKit?: BrandKit;
  includeCaptions?: boolean;
  subtitlesPath?: string;
  targetPlatform?: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x';
}

/**
 * Builds standard, production-ready FFmpeg CLI commands
 */
export function buildFFmpegCommand(config: FFmpegCommandConfig): string {
  const { inputPath, outputPath, clip, brandKit, subtitlesPath } = config;
  const start = clip.startTime.toFixed(2);
  const duration = clip.durationSeconds.toFixed(2);

  // Filter chain construction:
  // 1. Trim input
  // 2. Crop to 9:16 (1080x1920) or 1:1 or 16:9
  // 3. Overlay logo watermark if present
  // 4. Burn-in subtitles if srt exists
  // 5. Audio loudnorm filter (-14 LUFS for YouTube Shorts / TikTok)

  let videoFilter = '';
  if (clip.aspectRatio === '9:16') {
    // 9:16 reframe calculation with horizontal offset pan
    videoFilter = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920:(in_w-out_w)*${(clip.cropOffsetX / 100).toFixed(2)}:(in_h-out_h)/2`;
  } else if (clip.aspectRatio === '1:1') {
    videoFilter = `scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080`;
  } else {
    videoFilter = `scale=1920:1080`;
  }

  if (subtitlesPath) {
    videoFilter += `,subtitles='${subtitlesPath}':force_style='Fontname=Outfit,FontSize=20,PrimaryColour=&H00EBF2F5,BackColour=&H800F0F0F,BorderStyle=3'`;
  }

  const audioFilter = `loudnorm=I=-14:LRA=7:tp=-1.5`;

  return `ffmpeg -ss ${start} -t ${duration} -i "${inputPath}" -vf "${videoFilter}" -af "${audioFilter}" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 320k -pix_fmt yuv420p "${outputPath}"`;
}

/**
 * Generates standard SRT subtitle text synchronized to clip timeline
 */
export function generateSRT(clip: Clip, transcript?: Transcript): string {
  if (!transcript || !transcript.segments) {
    // Fallback default subtitle entry for the clip
    return `1\n00:00:00,500 --> 00:00:04,500\n${clip.hookText}\n\n2\n00:00:05,000 --> 00:00:09,000\n${clip.title}\n`;
  }

  let srtIndex = 1;
  const lines: string[] = [];

  const clipStart = clip.startTime;
  const clipEnd = clip.endTime;

  for (const seg of transcript.segments) {
    if (seg.end <= clipStart || seg.start >= clipEnd) continue;

    // Relative timestamps inside the exported short
    const relStart = Math.max(0, seg.start - clipStart);
    const relEnd = Math.min(clip.durationSeconds, seg.end - clipStart);

    const formatTimestamp = (sec: number) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const ms = Math.floor((sec % 1) * 1000);
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
    };

    lines.push(`${srtIndex}`);
    lines.push(`${formatTimestamp(relStart)} --> ${formatTimestamp(relEnd)}`);
    lines.push(seg.text);
    lines.push('');
    srtIndex++;
  }

  return lines.join('\n');
}

/**
 * Generates standard WebVTT subtitle text
 */
export function generateVTT(clip: Clip, transcript?: Transcript): string {
  const srt = generateSRT(clip, transcript);
  return 'WEBVTT\n\n' + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
}

/**
 * Utility to download raw text content as file (SRT, VTT, JSON)
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
