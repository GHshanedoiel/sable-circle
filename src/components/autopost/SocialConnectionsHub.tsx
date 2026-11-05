/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Auto-Posting AI & Social Media Integrations Hub
 * Connect, authenticate, and manage access to YouTube Shorts, TikTok Pro,
 * Instagram Reels, and X with autonomous posting schedules.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Calendar,
  Sparkles,
  Settings2,
  Trash2,
  RefreshCw,
  Sliders,
  Send,
  Video,
  Eye,
  Check,
  ChevronRight,
  FolderArchive,
  Lock,
} from 'lucide-react';
import { SocialAccount, StoredMediaItem } from '../../types';

interface SocialConnectionsHubProps {
  onNavigate: (tab: string) => void;
}

export const SocialConnectionsHub: React.FC<SocialConnectionsHubProps> = ({ onNavigate }) => {
  const {
    socialAccounts,
    storedMedia,
    connectSocialAccount,
    disconnectSocialAccount,
    toggleSocialAutoPost,
    updateSocialPrivacy,
    moveStoredMediaBin,
    scheduleMediaPost,
  } = useSableStore();

  const [activeAccountModal, setActiveAccountModal] = useState<SocialAccount | null>(null);
  const [handleInput, setHandleInput] = useState('');
  const [channelInput, setChannelInput] = useState('');
  const [privacySelect, setPrivacySelect] = useState<'public' | 'unlisted' | 'private'>('public');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [autoPilotMaster, setAutoPilotMaster] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenConnectModal = (account: SocialAccount) => {
    setActiveAccountModal(account);
    setHandleInput(account.handle || '');
    setChannelInput(account.channelName || '');
    setPrivacySelect(account.defaultPrivacy || 'public');
  };

  const handleConfirmConnect = () => {
    if (!activeAccountModal) return;
    setIsAuthorizing(true);

    setTimeout(() => {
      const handle = handleInput.trim() || `@sable_${activeAccountModal.id.slice(0, 4)}`;
      const channel = channelInput.trim() || `${activeAccountModal.platformName} Studio Official`;
      connectSocialAccount(activeAccountModal.id, handle, channel);
      updateSocialPrivacy(activeAccountModal.id, privacySelect);
      setIsAuthorizing(false);
      setActiveAccountModal(null);
      showToast(`Successfully linked ${activeAccountModal.platformName} account!`);
    }, 800);
  };

  const handleDisconnect = (account: SocialAccount) => {
    disconnectSocialAccount(account.id);
    showToast(`Disconnected ${account.platformName}.`);
  };

  // Get scheduled queue items
  const scheduledQueue = storedMedia.filter(
    (item) => item.bin === 'scheduled' || item.status === 'scheduled' || item.scheduledPublishTime
  );

  const connectedCount = socialAccounts.filter((a) => a.connected).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1C1C1C] text-[#F5F2EB] border border-[#BFA46F]/40 shadow-xl rounded-md text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#BFA46F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#BFA46F] uppercase mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Distribution Engine</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Social Media Access & Auto-Posting AI
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-2xl font-light">
            Grant secure platform credentials to YouTube Shorts, TikTok, Instagram Reels, and X.
            Configure multi-channel autopost schedules, privacy rules, and audience retention dispatchers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('vault')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#242424] text-xs font-medium text-[#F5F2EB] border border-[#2D2D2D] rounded transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5 text-[#BFA46F]" />
            <span>View Storage Vault</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#141414] border border-[#282828] rounded text-xs">
            <span className="text-[#8E8A82]">Connected Channels:</span>
            <span className="font-mono font-semibold text-[#BFA46F]">{connectedCount} of 4</span>
          </div>
        </div>
      </div>

      {/* Auto-Pilot Master Status Banner */}
      <div className="p-5 bg-gradient-to-r from-[#181818] via-[#141414] to-[#121212] border border-[#2A2A2A] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-md bg-[#BFA46F]/10 border border-[#BFA46F]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-[#BFA46F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#F5F2EB]">AI Auto-Pilot Scheduler</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {autoPilotMaster ? 'Active · Continuous Dispatch' : 'Paused · Manual Mode'}
              </span>
            </div>
            <p className="text-xs text-[#8E8A82] mt-0.5">
              When enabled, completed shorts sitting in your <strong>Scheduled Vault Bin</strong> will automatically release to connected platforms at their assigned optimal watch times.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setAutoPilotMaster(!autoPilotMaster);
              showToast(autoPilotMaster ? 'AI Auto-Pilot suspended.' : 'AI Auto-Pilot enabled!');
            }}
            className={`px-4 py-2 text-xs font-medium rounded transition-all flex items-center gap-2 ${
              autoPilotMaster
                ? 'bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] font-semibold'
                : 'bg-[#222222] hover:bg-[#2C2C2C] text-[#F5F2EB] border border-[#333333]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{autoPilotMaster ? 'Auto-Pilot Active' : 'Resume Auto-Pilot'}</span>
          </button>
        </div>
      </div>

      {/* Platform Access Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#BFA46F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Social Media Channels</span>
          </h2>
          <span className="text-[11px] text-[#737373]">OAuth 2.0 PKCE Encrypted Storage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialAccounts.map((account) => {
            const isYouTube = account.id === 'youtube_shorts';
            const isTikTok = account.id === 'tiktok';
            const isInstagram = account.id === 'instagram_reels';
            const isX = account.id === 'x';

            return (
              <div
                key={account.id}
                className={`p-5 rounded-lg border transition-all flex flex-col justify-between ${
                  account.connected
                    ? 'bg-[#151515] border-[#2C2C2C] hover:border-[#3D3D3D]'
                    : 'bg-[#121212] border-[#202020] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Platform Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs ${
                          isYouTube
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : isTikTok
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : isInstagram
                            ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                            : 'bg-[#1E1E1E] text-[#F5F2EB] border border-[#333333]'
                        }`}
                      >
                        {isYouTube && 'YT'}
                        {isTikTok && 'TT'}
                        {isInstagram && 'IG'}
                        {isX && 'X'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F5F2EB]">
                          {account.platformName}
                        </div>
                        <div className="text-[10px] font-mono text-[#8E8A82]">
                          {account.connected ? account.channelName || 'Connected' : 'Not Connected'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-2 h-2 rounded-full ${
                        account.connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-[#3A3A3A]'
                      }`}
                    />
                  </div>

                  {/* Channel Details or Link CTA */}
                  {account.connected ? (
                    <div className="space-y-2 mt-4 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-[#202020]">
                        <span className="text-[11px] text-[#737373]">Handle</span>
                        <span className="font-mono text-[#F5F2EB]">{account.handle}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#202020]">
                        <span className="text-[11px] text-[#737373]">Subscribers</span>
                        <span className="font-mono text-[#BFA46F]">{account.subscriberCount}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#202020]">
                        <span className="text-[11px] text-[#737373]">Default Visibility</span>
                        <span className="capitalize font-mono text-[#F5F2EB]">{account.defaultPrivacy}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[11px] text-[#737373]">Auto-Post</span>
                        <button
                          onClick={() => toggleSocialAutoPost(account.id)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                            account.autoPostEnabled
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#222222] text-[#8E8A82]'
                          }`}
                        >
                          {account.autoPostEnabled ? 'ENABLED' : 'PAUSED'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-5 text-center space-y-2">
                      <Lock className="w-5 h-5 text-[#555555] mx-auto" />
                      <p className="text-[11px] text-[#737373] leading-relaxed">
                        Connect your account to allow Sable Circle to publish 9:16 vertical shorts directly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 mt-4 border-t border-[#202020] flex items-center justify-between gap-2">
                  {account.connected ? (
                    <>
                      <button
                        onClick={() => handleOpenConnectModal(account)}
                        className="flex-1 py-1.5 px-2 bg-[#1E1E1E] hover:bg-[#282828] text-[#F5F2EB] text-[11px] font-medium rounded transition-colors text-center"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => handleDisconnect(account)}
                        className="py-1.5 px-2.5 bg-[#1E1E1E] hover:bg-rose-950/40 hover:text-rose-400 text-[#737373] text-[11px] font-medium rounded transition-colors"
                        title="Disconnect Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenConnectModal(account)}
                      className="w-full py-1.5 px-3 bg-[#BFA46F]/15 hover:bg-[#BFA46F]/25 border border-[#BFA46F]/40 text-[#D4BE8D] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Grant Access</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Releases Dispatch Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#BFA46F] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Scheduled Releases</span>
            </h2>
            <p className="text-xs text-[#8E8A82] mt-0.5">
              Completed shorts stored in your vault waiting for scheduled publication.
            </p>
          </div>

          <button
            onClick={() => onNavigate('vault')}
            className="text-xs text-[#BFA46F] hover:text-[#D4BE8D] flex items-center gap-1 font-mono transition-colors"
          >
            <span>Manage All Vault Bins</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {scheduledQueue.length === 0 ? (
          <div className="p-8 border border-dashed border-[#262626] rounded-lg text-center bg-[#111111] space-y-3">
            <Clock className="w-6 h-6 text-[#555555] mx-auto" />
            <div className="text-xs text-[#8E8A82]">No shorts are currently queued for automatic distribution.</div>
            <p className="text-[11px] text-[#606060] max-w-md mx-auto">
              Finish editing a video in the <strong>Editing Studio</strong>, select <strong>Save to Vault & Schedule</strong>, and it will appear here for automated publishing.
            </p>
            <button
              onClick={() => onNavigate('studio')}
              className="px-3.5 py-1.5 bg-[#1E1E1E] hover:bg-[#282828] text-xs text-[#F5F2EB] rounded border border-[#333333] transition-colors"
            >
              Open Editing Studio
            </button>
          </div>
        ) : (
          <div className="border border-[#222222] bg-[#121212] rounded-lg overflow-hidden divide-y divide-[#1F1F1F]">
            {scheduledQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#161616] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-10 bg-[#1A1A1A] rounded overflow-hidden relative shrink-0 border border-[#2A2A2A]">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-[9px] font-mono font-bold text-white bg-black/60 px-1 py-0.5 rounded">
                        {item.aspectRatio}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#F5F2EB]">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#8E8A82] mt-0.5">
                      <span className="text-[#BFA46F] font-mono">Virality: {item.viralityScore}/100</span>
                      <span>·</span>
                      <span className="font-mono">{item.durationSeconds.toFixed(1)}s</span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {item.scheduledPublishTime || 'Scheduled for Next Optimal Slot'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    {item.targetPlatforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#1C1C1C] border border-[#2D2D2D] text-[#D4BE8D]"
                      >
                        {plat === 'youtube_shorts' && 'YT Shorts'}
                        {plat === 'tiktok' && 'TikTok'}
                        {plat === 'instagram_reels' && 'Reels'}
                        {plat === 'x' && 'X'}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      moveStoredMediaBin(item.id, 'published');
                      showToast(`Dispatched "${item.title}" to connected social channels!`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Account Modal */}
      {activeAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2D2D2D] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#BFA46F]/10 border border-[#BFA46F]/30 flex items-center justify-center text-xs font-bold text-[#BFA46F]">
                  SC
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F2EB]">
                    Link {activeAccountModal.platformName} Account
                  </h3>
                  <div className="text-[11px] text-[#737373]">Direct API Integration</div>
                </div>
              </div>

              <button
                onClick={() => setActiveAccountModal(null)}
                className="text-[#737373] hover:text-[#F5F2EB] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8E8A82] mb-1.5">
                  Channel / Page Handle
                </label>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="@yourchannelname"
                  className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded px-3 py-2 text-xs text-[#F5F2EB] placeholder-[#555555] focus:outline-none focus:border-[#BFA46F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8E8A82] mb-1.5">
                  Official Display Name
                </label>
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="e.g. Masterclass Cinema Official"
                  className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded px-3 py-2 text-xs text-[#F5F2EB] placeholder-[#555555] focus:outline-none focus:border-[#BFA46F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8E8A82] mb-1.5">
                  Default Video Privacy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['public', 'unlisted', 'private'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPrivacySelect(mode)}
                      className={`py-2 px-2 rounded border text-center capitalize transition-colors ${
                        privacySelect === mode
                          ? 'bg-[#BFA46F]/15 border-[#BFA46F] text-[#F5F2EB] font-semibold'
                          : 'bg-[#181818] border-[#252525] text-[#8E8A82] hover:text-[#F5F2EB]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#181818] border border-[#242424] rounded text-[11px] text-[#8E8A82] leading-relaxed">
                By connecting, you grant Sable Circle permission to upload vertical video shorts, set titles, captions, and publication schedules on your behalf. Tokens can be revoked anytime.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
              <button
                onClick={() => setActiveAccountModal(null)}
                className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#262626] text-xs font-medium text-[#8E8A82] hover:text-[#F5F2EB] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConnect}
                disabled={isAuthorizing}
                className="px-4 py-2 bg-[#BFA46F] hover:bg-[#D4BE8D] text-[#0F0F0F] text-xs font-semibold rounded transition-colors flex items-center gap-2"
              >
                {isAuthorizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing OAuth...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize & Link Channel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
