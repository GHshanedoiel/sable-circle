/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Sidebar Navigation
 * Premium studio sidebar with clean geometric typography,
 * unboxed metadata discipline, and active state indicators.
 */

import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Flame,
  Scissors,
  Palette,
  Layers,
  LineChart,
  Share2,
  BookOpen,
  FolderArchive,
  Zap,
} from 'lucide-react';
import { useSableStore } from '../../lib/db/store';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, onOpenDocs }) => {
  const { clips, batchQueue, storedMedia, socialAccounts } = useSableStore();
  const queuedCount = batchQueue.filter((q) => q.status === 'processing' || q.status === 'pending').length;
  const connectedSocials = socialAccounts.filter((s) => s.connected).length;

  const navItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'ingestion', label: 'Video Ingestion', icon: UploadCloud },
    { id: 'virality', label: 'AI Virality Engine', icon: Flame, badge: `${clips.length} Clips` },
    { id: 'studio', label: 'Editing Studio', icon: Scissors },
    { id: 'vault', label: 'Media Storage Vault', icon: FolderArchive, badge: `${storedMedia.length} Media` },
    { id: 'social_hub', label: 'Auto-Post & Channels', icon: Zap, badge: `${connectedSocials}/4 Linked` },
    { id: 'brand', label: 'Brand Kit Studio', icon: Palette },
    { id: 'batch', label: 'Batch Processing', icon: Layers, badge: queuedCount > 0 ? `${queuedCount} Active` : undefined },
    { id: 'analytics', label: 'Retention Analytics', icon: LineChart },
    { id: 'export', label: 'Export & Publishing', icon: Share2 },
  ];

  return (
    <aside className="w-64 border-r border-[#222222] bg-[#101010] flex flex-col justify-between shrink-0 select-none">
      {/* Top Section: Navigation Links */}
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-[#606060]">
            Studio Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#1C1C1C] text-[#F5F2EB] shadow-sm border border-[#2D2D2D]'
                      : 'text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#BFA46F]' : 'text-[#737373] group-hover:text-[#F5F2EB]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#BFA46F]/20 text-[#D4BE8D]'
                          : 'bg-[#1C1C1C] text-[#737373]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Documentation & Specifications */}
        <div className="pt-2 border-t border-[#1C1C1C]">
          <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-[#606060]">
            Knowledge & Specs
          </div>
          <button
            onClick={onOpenDocs}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#161616] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#737373]" />
            <span>How-To & Architecture</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Brand Tagline & Status */}
      <div className="p-4 border-t border-[#1C1C1C] bg-[#0D0D0D]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#2C2C2C] flex items-center justify-center shrink-0">
            <span className="font-display text-[10px] text-[#BFA46F] font-bold">SC</span>
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-medium text-[#F5F2EB] truncate">Sable Circle</div>
            <div className="text-[10px] text-[#8E8A82] truncate font-light tracking-wide">
              Where vision meets precision
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
