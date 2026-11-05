/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Production Workflow Stepper & Pipeline Switcher
 * Guides creators step-by-step through distinct workflows:
 * 1. YouTube Shorts Pipeline (9:16 Vertical Virality)
 * 2. Long-Form Clipping Pipeline (Multi-Aspect Dialogue Extraction)
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  Flame,
  Scissors,
  FolderArchive,
  ChevronRight,
  Smartphone,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ProductionWorkflowStepperProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export type PipelineMode = 'shorts' | 'longform';

export const ProductionWorkflowStepper: React.FC<ProductionWorkflowStepperProps> = ({
  currentTab,
  onNavigate,
}) => {
  const [pipelineMode, setPipelineMode] = useState<PipelineMode>('shorts');

  const shortsSteps = [
    {
      stepNumber: 1,
      id: 'ingestion',
      name: 'Ingestion & Audio',
      summary: 'Upload raw 4K footage or YouTube URL with auto-transcription',
      icon: UploadCloud,
    },
    {
      stepNumber: 2,
      id: 'virality',
      name: 'AI Virality Engine',
      summary: 'Hook detection, emotional peaks, retention score 0–100',
      icon: Flame,
    },
    {
      stepNumber: 3,
      id: 'studio',
      name: '9:16 Shorts Studio',
      summary: 'Canvas reframing, karaoke captions, hook overlays & CTAs',
      icon: Scissors,
    },
    {
      stepNumber: 4,
      id: 'vault',
      name: 'Storage Vault & Auto-Post',
      summary: 'Creation bins, schedule time dropdown, autonomous dispatch',
      icon: FolderArchive,
    },
  ];

  const longformSteps = [
    {
      stepNumber: 1,
      id: 'ingestion',
      name: 'Long-Form Ingest',
      summary: 'Import full podcasts, keynotes, or interviews',
      icon: UploadCloud,
    },
    {
      stepNumber: 2,
      id: 'virality',
      name: 'Speaker & Topic Segmentation',
      summary: 'Identify continuous dialogue threads and chapter markers',
      icon: Flame,
    },
    {
      stepNumber: 3,
      id: 'studio',
      name: 'Timeline & Precision Trim',
      summary: '16:9 / 1:1 multi-aspect reframing and clean audio ducking',
      icon: Scissors,
    },
    {
      stepNumber: 4,
      id: 'vault',
      name: 'Raw Clips Storage Bin',
      summary: 'Catalog into archives, export packages or schedule releases',
      icon: FolderArchive,
    },
  ];

  const currentSteps = pipelineMode === 'shorts' ? shortsSteps : longformSteps;

  // Determine current active step index
  const activeStepIndex = currentSteps.findIndex((s) => s.id === currentTab);
  const currentStepNumber = activeStepIndex >= 0 ? activeStepIndex + 1 : 1;

  const nextStep = activeStepIndex >= 0 && activeStepIndex < currentSteps.length - 1
    ? currentSteps[activeStepIndex + 1]
    : null;

  return (
    <div className="bg-[#121212] border-b border-[#222222] px-6 py-3.5 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Pipeline Mode Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
            Workflow:
          </span>
          <div className="flex items-center p-0.5 bg-[#181818] border border-[#262626] rounded-md text-xs">
            <button
              onClick={() => setPipelineMode('shorts')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all text-xs font-medium ${
                pipelineMode === 'shorts'
                  ? 'bg-[#222222] text-[#F5F2EB] shadow-sm font-semibold'
                  : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#BFA46F]" />
              <span>YouTube Shorts Fast-Track</span>
            </button>

            <button
              onClick={() => setPipelineMode('longform')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all text-xs font-medium ${
                pipelineMode === 'longform'
                  ? 'bg-[#222222] text-[#F5F2EB] shadow-sm font-semibold'
                  : 'text-[#8E8A82] hover:text-[#F5F2EB]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#8E8A82]" />
              <span>Long-Form Clipping</span>
            </button>
          </div>
        </div>

        {/* Center: Numbered Step Progress Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = currentTab === step.id;
            const isCompleted = activeStepIndex > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onNavigate(step.id)}
                  title={step.summary}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs group shrink-0 ${
                    isCurrent
                      ? 'bg-[#1C1C1C] border border-[#BFA46F]/40 text-[#F5F2EB] shadow-sm'
                      : isCompleted
                      ? 'bg-[#151515] text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1A1A1A]'
                      : 'text-[#666666] hover:text-[#8E8A82] hover:bg-[#161616]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#BFA46F] text-[#0F0F0F]'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#1E1E1E] text-[#888888] border border-[#2E2E2E]'
                    }`}
                  >
                    {isCompleted ? '✓' : step.stepNumber}
                  </div>

                  <div className="text-left">
                    <span className="font-medium whitespace-nowrap block leading-tight">
                      {step.name}
                    </span>
                  </div>
                </button>

                {idx < currentSteps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#333333] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Next Step Quick Action Button */}
        {nextStep && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => onNavigate(nextStep.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BFA46F]/15 hover:bg-[#BFA46F]/25 text-[#D4BE8D] hover:text-[#F5F2EB] border border-[#BFA46F]/30 text-xs font-medium rounded transition-colors"
            >
              <span>Next: {nextStep.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
