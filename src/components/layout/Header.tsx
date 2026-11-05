/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Header Component
 * Strict Top Bar Contract: Brand lockup, workspace context & breadcrumbs,
 * Elite membership status, and real actionable affordances.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import { Sparkles, BookOpen, ChevronDown, Check, ShieldCheck, RotateCcw } from 'lucide-react';
import { MembershipTier } from '../../types';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onOpenDocs }) => {
  const { user, workspaces, activeWorkspace, setActiveWorkspace, updateTier, resetToDefaults } = useSableStore();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'overview': return 'Executive Dashboard';
      case 'ingestion': return 'Video Ingestion & Transcription';
      case 'virality': return 'AI Virality & Clip Engine';
      case 'studio': return 'Editing Studio & 9:16 Reframe';
      case 'vault': return 'Media Storage Vault & Creation Bins';
      case 'social_hub': return 'Auto-Posting AI & Social Channels';
      case 'brand': return 'Brand Kit & Watermark System';
      case 'batch': return 'Batch Processing Queue';
      case 'analytics': return 'Pre-Publish Retention Analytics';
      case 'export': return 'Platform Export & Publishing';
      default: return 'Studio Workspace';
    }
  };

  return (
    <header className="h-16 border-b border-[#222222] bg-[#121212]/90 backdrop-blur-md px-6 flex items-center justify-between gap-8 sticky top-0 z-40 select-none">
      {/* Zone 1: Brand & Workspace Breadcrumb */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 group text-left transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-full border border-[#BFA46F]/40 overflow-hidden bg-black flex items-center justify-center shadow-sm">
            <img
              src="/assets/aistudio/App_Icon_Dark_03_4960f3e5.png"
              alt="Sable Circle SC Monogram"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold tracking-tight text-[#F5F2EB] text-base">
                Sable Circle
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#BFA46F] font-mono border border-[#BFA46F]/30 px-1.5 py-0.2 rounded">
                v1.001
              </span>
            </div>
          </div>
        </button>

        <span className="text-[#3A3A3A] font-light">/</span>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setWsDropdownOpen(!wsDropdownOpen);
              setTierDropdownOpen(false);
            }}
            className="flex items-center gap-2 text-xs text-[#8E8A82] hover:text-[#F5F2EB] transition-colors py-1.5 px-2.5 rounded-md hover:bg-[#1E1E1E]"
          >
            <span className="font-medium text-[#D4BE8D]">{activeWorkspace.name}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {wsDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#181818] border border-[#2A2A2A] rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#737373] border-b border-[#242424]">
                Workspaces & Projects
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws.id);
                    setWsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#E5E5E5] hover:bg-[#222222] flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-medium">{ws.name}</div>
                    <div className="text-[10px] text-[#737373]">{ws.projectCount} productions</div>
                  </div>
                  {ws.id === activeWorkspace.id && (
                    <Check className="w-3.5 h-3.5 text-[#BFA46F]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[#3A3A3A] font-light hidden lg:inline">/</span>
        <span className="text-xs text-[#8E8A82] font-medium hidden lg:inline">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line prose) */}
      <nav className="hidden xl:flex items-center gap-6 text-xs text-[#8E8A82]">
        <button
          onClick={() => onNavigate('ingestion')}
          className={`hover:text-[#F5F2EB] transition-colors ${currentTab === 'ingestion' ? 'text-[#F5F2EB] font-medium' : ''}`}
        >
          Ingestion
        </button>
        <button
          onClick={() => onNavigate('virality')}
          className={`hover:text-[#F5F2EB] transition-colors ${currentTab === 'virality' ? 'text-[#F5F2EB] font-medium' : ''}`}
        >
          Virality Matrix
        </button>
        <button
          onClick={() => onNavigate('studio')}
          className={`hover:text-[#F5F2EB] transition-colors ${currentTab === 'studio' ? 'text-[#F5F2EB] font-medium' : ''}`}
        >
          Editing Studio
        </button>
        <button
          onClick={() => onNavigate('brand')}
          className={`hover:text-[#F5F2EB] transition-colors ${currentTab === 'brand' ? 'text-[#F5F2EB] font-medium' : ''}`}
        >
          Brand Kits
        </button>
        <button
          onClick={() => onNavigate('batch')}
          className={`hover:text-[#F5F2EB] transition-colors ${currentTab === 'batch' ? 'text-[#F5F2EB] font-medium' : ''}`}
        >
          Batch Queue
        </button>
      </nav>

      {/* Zone 3: Actions, Credits & Elite Status */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Tier Indicator & Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setTierDropdownOpen(!tierDropdownOpen);
              setWsDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-[#BFA46F]/30 bg-[#161616] hover:bg-[#1E1E1E] transition-colors text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#BFA46F]" />
            <span className="font-display font-medium text-[#F5F2EB] capitalize">
              {user.tier} Tier
            </span>
            <span className="font-mono text-[11px] text-[#BFA46F] tabular-nums">
              {user.creditsRemaining} credits
            </span>
            <ChevronDown className="w-3 h-3 text-[#8E8A82]" />
          </button>

          {tierDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#181818] border border-[#2A2A2A] rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#737373] border-b border-[#242424]">
                Membership Tier (Preview)
              </div>
              {(['free', 'pro', 'elite'] as MembershipTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    updateTier(t);
                    setTierDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#E5E5E5] hover:bg-[#222222] flex items-center justify-between transition-colors capitalize"
                >
                  <div className="flex items-center gap-2">
                    <span className={t === 'elite' ? 'text-[#BFA46F] font-semibold' : ''}>
                      {t} Member
                    </span>
                    {t === 'elite' && (
                      <span className="text-[10px] text-[#BFA46F] font-mono">Unlimited 4K</span>
                    )}
                  </div>
                  {user.tier === t && <Check className="w-3.5 h-3.5 text-[#BFA46F]" />}
                </button>
              ))}

              <div className="pt-1 mt-1 border-t border-[#242424]">
                <button
                  onClick={() => {
                    resetToDefaults();
                    setTierDropdownOpen(false);
                    onNavigate('overview');
                  }}
                  className="w-full px-3 py-2 text-left text-[11px] text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#202020] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#BFA46F]" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How-To & Docs Button */}
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] rounded transition-colors"
          title="Open Application Architecture & Local Setup Guide"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">How-To & Docs</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={() => onNavigate('ingestion')}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors shadow-sm active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Clipping Project</span>
        </button>
      </div>
    </header>
  );
};
