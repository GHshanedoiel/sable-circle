/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Media Storage Vault & Creation Bins
 * Organize completed shorts and clips into dedicated workflow bins:
 * Shorts Creation Bin, Raw Highlight Clips, Drafts, Scheduled, and Published.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  FolderArchive,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Trash2,
  Share2,
  ChevronDown,
  Check,
  Play,
  Scissors,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Smartphone,
  Video,
} from 'lucide-react';
import { StorageBin, StoredMediaItem, Clip } from '../../types';
import { triggerFileDownload } from '../../lib/ffmpeg/processor';

interface StorageVaultProps {
  onNavigate: (tab: string) => void;
  onSelectClipForStudio: (clipId: string) => void;
}

export const StorageVault: React.FC<StorageVaultProps> = ({
  onNavigate,
  onSelectClipForStudio,
}) => {
  const {
    storedMedia,
    clips,
    moveStoredMediaBin,
    scheduleMediaPost,
    deleteStoredMedia,
    socialAccounts,
  } = useSableStore();

  const [activeBin, setActiveBin] = useState<StorageBin | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [schedulingItemId, setSchedulingItemId] = useState<string | null>(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState('Tomorrow at 09:00 AM (EST)');
  const [autoPostToggle, setAutoPostToggle] = useState(true);
  const [movingBinItemId, setMovingBinItemId] = useState<string | null>(null);

  const binTabs: { id: StorageBin | 'all'; label: string; count: number; icon: any }[] = [
    { id: 'all', label: 'All Vault Media', count: storedMedia.length, icon: FolderArchive },
    {
      id: 'shorts_ready',
      label: 'YouTube Shorts Creation Bin',
      count: storedMedia.filter((m) => m.bin === 'shorts_ready').length,
      icon: Smartphone,
    },
    {
      id: 'raw_clips',
      label: 'Raw Highlight Clips Bin',
      count: storedMedia.filter((m) => m.bin === 'raw_clips').length,
      icon: Video,
    },
    {
      id: 'scheduled',
      label: 'Scheduled for Auto-Post',
      count: storedMedia.filter((m) => m.bin === 'scheduled').length,
      icon: Calendar,
    },
    {
      id: 'drafts',
      label: 'Drafts & Uncut',
      count: storedMedia.filter((m) => m.bin === 'drafts').length,
      icon: Layers,
    },
    {
      id: 'published',
      label: 'Published Archive',
      count: storedMedia.filter((m) => m.bin === 'published').length,
      icon: CheckCircle2,
    },
  ];

  const filteredItems = storedMedia.filter((item) => {
    if (activeBin !== 'all' && item.bin !== activeBin) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.hookText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApplySchedule = (itemId: string) => {
    scheduleMediaPost(itemId, selectedScheduleTime, autoPostToggle);
    setSchedulingItemId(null);
  };

  const handleDownloadManifest = (item: StoredMediaItem) => {
    const pkg = JSON.stringify(item, null, 2);
    triggerFileDownload(`${item.title.replace(/\s+/g, '_')}_vault_package.json`, pkg, 'application/json');
  };

  const schedulePresets = [
    'Today at 06:00 PM (Prime Time)',
    'Tomorrow at 09:00 AM (EST)',
    'Tomorrow at 04:30 PM (EST)',
    'Friday at 12:00 PM (Weekend Surge)',
    'Saturday at 10:00 AM (Creator Peak)',
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Storage Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Asset Repository</span>
            <span>·</span>
            <span>Categorized Creation Bins & Scheduled Releases</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Media Storage Vault & Bins
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-2xl">
            Save completed shorts and clips in organized bins. Hold assets until you're ready to publish,
            or schedule automatic posting to connected social media channels.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('social_hub')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-medium text-[#F5F2EB] rounded-md transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#BFA46F]" />
            <span>Auto-Posting Channels</span>
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-2 px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Create New Short in Studio</span>
          </button>
        </div>
      </div>

      {/* Search & Bin Categorization Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stored clips by title or hook..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#141414] border border-[#262626] rounded-md text-[#F5F2EB] placeholder-[#606060] focus:outline-none focus:border-[#BFA46F]"
            />
          </div>
          <span className="text-xs font-mono text-[#8E8A82]">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in view
          </span>
        </div>

        {/* Creation Bins Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#222222]">
          {binTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeBin === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBin(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1F1F1F] text-[#F5F2EB] border border-[#303030] shadow-sm'
                    : 'text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#161616]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#BFA46F]' : 'text-[#737373]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-[#BFA46F]/20 text-[#D4BE8D]' : 'bg-[#161616] text-[#737373]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-[#121212] border border-[#222222] space-y-3">
          <FolderArchive className="w-8 h-8 text-[#505050] mx-auto" />
          <h3 className="text-sm font-semibold text-[#F5F2EB]">This creation bin is empty</h3>
          <p className="text-xs text-[#8E8A82] max-w-md mx-auto">
            When you complete clips in the Editing Studio or Batch Transcoder, choose "Save to Storage Vault"
            to organize them here.
          </p>
          <button
            onClick={() => onNavigate('studio')}
            className="mt-2 px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Open Editing Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isScheduling = schedulingItemId === item.id;
            const isMovingBin = movingBinItemId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#141414] border border-[#242424] hover:border-[#333333] transition-all overflow-hidden flex flex-col justify-between shadow-lg"
              >
                {/* Media Preview Header */}
                <div className="p-4 space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-[#262626] group">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Aspect & Score Tag */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-black/70 backdrop-blur-sm text-[10px] font-mono uppercase text-[#F5F2EB] px-2 py-0.5 rounded border border-white/10">
                        {item.aspectRatio}
                      </span>
                      <span className="bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#D4BE8D] px-2 py-0.5 rounded border border-[#BFA46F]/30">
                        {item.viralityScore}/100
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono text-[#F5F2EB] px-2 py-0.5 rounded">
                      {item.durationSeconds.toFixed(1)}s
                    </div>

                    {/* Hook Text Overlay */}
                    <div className="absolute bottom-2 left-2 right-14 truncate">
                      <span className="text-[10px] font-bold font-mono text-[#BFA46F] tracking-wider uppercase">
                        "{item.hookText}"
                      </span>
                    </div>
                  </div>

                  {/* Title & Bin Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#737373]">
                      <span className="font-mono capitalize text-[#D4BE8D]">
                        Bin: {item.bin.replace('_', ' ')}
                      </span>
                      <span>{item.createdAt}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F5F2EB] line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Scheduled Status Banner if active */}
                  {item.scheduledPublishTime && (
                    <div className="p-2 rounded bg-[#181818] border border-[#BFA46F]/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#BFA46F]" />
                        <span className="text-[11px] text-[#F5F2EB] font-mono">
                          {item.scheduledPublishTime}
                        </span>
                      </div>
                      {item.autoPostEnabled && (
                        <span className="text-[9px] font-mono uppercase bg-[#BFA46F]/20 text-[#D4BE8D] px-1.5 py-0.5 rounded">
                          Auto-Pilot
                        </span>
                      )}
                    </div>
                  )}

                  {/* Inline Schedule Dropdown Drawer */}
                  {isScheduling && (
                    <div className="p-3.5 rounded-lg bg-[#0F0F0F] border border-[#2D2D2D] space-y-3 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F5F2EB]">Select Publication Slot</span>
                        <button
                          onClick={() => setSchedulingItemId(null)}
                          className="text-[#8E8A82] hover:text-[#F5F2EB] text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>

                      <select
                        value={selectedScheduleTime}
                        onChange={(e) => setSelectedScheduleTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#161616] border border-[#2A2A2A] rounded text-[#F5F2EB] focus:outline-none focus:border-[#BFA46F]"
                      >
                        {schedulePresets.map((preset, i) => (
                          <option key={i} value={preset}>
                            {preset}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E8A82] text-[11px]">Enable AI Auto-Post</span>
                        <input
                          type="checkbox"
                          checked={autoPostToggle}
                          onChange={(e) => setAutoPostToggle(e.target.checked)}
                          className="accent-[#BFA46F] cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={() => handleApplySchedule(item.id)}
                        className="w-full py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Schedule</span>
                      </button>
                    </div>
                  )}

                  {/* Inline Move Bin Drawer */}
                  {isMovingBin && (
                    <div className="p-3 rounded-lg bg-[#0F0F0F] border border-[#2D2D2D] space-y-2 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F5F2EB]">Move to Creation Bin</span>
                        <button
                          onClick={() => setMovingBinItemId(null)}
                          className="text-[#8E8A82] hover:text-[#F5F2EB] text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {(['shorts_ready', 'raw_clips', 'drafts', 'scheduled', 'published'] as StorageBin[]).map(
                          (bin) => (
                            <button
                              key={bin}
                              onClick={() => {
                                moveStoredMediaBin(item.id, bin);
                                setMovingBinItemId(null);
                              }}
                              className={`p-1.5 rounded text-left text-[11px] capitalize transition-colors ${
                                item.bin === bin
                                  ? 'bg-[#BFA46F]/20 text-[#D4BE8D] font-medium'
                                  : 'bg-[#181818] text-[#8E8A82] hover:text-[#F5F2EB]'
                              }`}
                            >
                              {bin.replace('_', ' ')}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="p-3 bg-[#111111] border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Schedule Button */}
                    <button
                      onClick={() => {
                        setSchedulingItemId(isScheduling ? null : item.id);
                        setMovingBinItemId(null);
                      }}
                      className="px-2.5 py-1 text-xs text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1C1C1C] rounded transition-colors flex items-center gap-1"
                      title="Schedule Publication"
                    >
                      <Calendar className="w-3 h-3 text-[#BFA46F]" />
                      <span className="hidden sm:inline">Schedule</span>
                    </button>

                    {/* Move Bin Button */}
                    <button
                      onClick={() => {
                        setMovingBinItemId(isMovingBin ? null : item.id);
                        setSchedulingItemId(null);
                      }}
                      className="px-2.5 py-1 text-xs text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1C1C1C] rounded transition-colors flex items-center gap-1"
                      title="Move between bins"
                    >
                      <Layers className="w-3 h-3 text-[#8E8A82]" />
                      <span className="hidden sm:inline">Bin</span>
                    </button>

                    {/* Download Package */}
                    <button
                      onClick={() => handleDownloadManifest(item)}
                      className="p-1 text-[#8E8A82] hover:text-[#F5F2EB] hover:bg-[#1C1C1C] rounded transition-colors"
                      title="Download JSON manifest & assets"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Launch into studio */}
                    <button
                      onClick={() => {
                        if (item.clipId) {
                          onSelectClipForStudio(item.clipId);
                          onNavigate('studio');
                        } else {
                          onNavigate('studio');
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-[#F5F2EB] rounded flex items-center gap-1 transition-colors"
                    >
                      <Scissors className="w-3 h-3 text-[#BFA46F]" />
                      <span>Studio</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteStoredMedia(item.id)}
                      className="p-1 text-[#606060] hover:text-red-400 rounded transition-colors"
                      title="Delete from Vault"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
