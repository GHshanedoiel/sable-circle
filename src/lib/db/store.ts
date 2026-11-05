/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Client-Side State & Storage Engine
 * Synchronizes with Drizzle relational schemas, providing reactive
 * state across all components with automatic local persistence.
 */

import { useState, useEffect } from 'react';
import {
  User,
  Workspace,
  SourceVideo,
  Clip,
  BrandKit,
  BatchQueueItem,
  CaptionStyle,
  MembershipTier,
  StoredMediaItem,
  SocialAccount,
  StorageBin,
} from '../../types';
import {
  INITIAL_USER,
  WORKSPACES,
  SAMPLE_VIDEOS,
  INITIAL_CLIPS,
  BRAND_KITS,
  CAPTION_STYLES,
  INITIAL_STORED_MEDIA,
  INITIAL_SOCIAL_ACCOUNTS,
} from '../mock-data';

const STORAGE_KEYS = {
  USER: 'sable_user_v1',
  WORKSPACES: 'sable_workspaces_v1',
  ACTIVE_WORKSPACE: 'sable_active_ws_v1',
  VIDEOS: 'sable_videos_v1',
  CLIPS: 'sable_clips_v1',
  BRAND_KITS: 'sable_brandkits_v1',
  BATCH_QUEUE: 'sable_batchqueue_v1',
  STORED_MEDIA: 'sable_stored_media_v1',
  SOCIAL_ACCOUNTS: 'sable_social_accounts_v1',
};

export class SableDataStore {
  private static instance: SableDataStore;
  private listeners: Set<() => void> = new Set();

  public user: User = INITIAL_USER;
  public workspaces: Workspace[] = WORKSPACES;
  public activeWorkspaceId: string = WORKSPACES[0].id;
  public videos: SourceVideo[] = SAMPLE_VIDEOS;
  public clips: Clip[] = INITIAL_CLIPS;
  public brandKits: BrandKit[] = BRAND_KITS;
  public batchQueue: BatchQueueItem[] = [];
  public storedMedia: StoredMediaItem[] = INITIAL_STORED_MEDIA;
  public socialAccounts: SocialAccount[] = INITIAL_SOCIAL_ACCOUNTS;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): SableDataStore {
    if (!SableDataStore.instance) {
      SableDataStore.instance = new SableDataStore();
    }
    return SableDataStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((cb) => cb());
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (storedVideos) this.videos = JSON.parse(storedVideos);

      const storedClips = localStorage.getItem(STORAGE_KEYS.CLIPS);
      if (storedClips) this.clips = JSON.parse(storedClips);

      const storedBrandKits = localStorage.getItem(STORAGE_KEYS.BRAND_KITS);
      if (storedBrandKits) this.brandKits = JSON.parse(storedBrandKits);

      const storedQueue = localStorage.getItem(STORAGE_KEYS.BATCH_QUEUE);
      if (storedQueue) this.batchQueue = JSON.parse(storedQueue);

      const storedVault = localStorage.getItem(STORAGE_KEYS.STORED_MEDIA);
      if (storedVault) this.storedMedia = JSON.parse(storedVault);

      const storedSocial = localStorage.getItem(STORAGE_KEYS.SOCIAL_ACCOUNTS);
      if (storedSocial) this.socialAccounts = JSON.parse(storedSocial);

      const storedWs = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE);
      if (storedWs) this.activeWorkspaceId = storedWs;
    } catch {
      // Fallback to initial defaults if storage read fails
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(this.videos));
      localStorage.setItem(STORAGE_KEYS.CLIPS, JSON.stringify(this.clips));
      localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(this.brandKits));
      localStorage.setItem(STORAGE_KEYS.BATCH_QUEUE, JSON.stringify(this.batchQueue));
      localStorage.setItem(STORAGE_KEYS.STORED_MEDIA, JSON.stringify(this.storedMedia));
      localStorage.setItem(STORAGE_KEYS.SOCIAL_ACCOUNTS, JSON.stringify(this.socialAccounts));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKSPACE, this.activeWorkspaceId);
    } catch {
      // Storage quota or sandboxing exception catch
    }
  }

  // User & Tier Actions
  public updateTier(tier: MembershipTier) {
    this.user = {
      ...this.user,
      tier,
      creditsRemaining: tier === 'elite' ? 9999 : tier === 'pro' ? 850 : 35,
    };
    this.notify();
  }

  public deductCredit(amount: number = 10) {
    this.user = {
      ...this.user,
      creditsRemaining: Math.max(0, this.user.creditsRemaining - amount),
    };
    this.notify();
  }

  // Workspace Actions
  public setActiveWorkspace(workspaceId: string) {
    this.activeWorkspaceId = workspaceId;
    this.notify();
  }

  // Video Actions
  public addVideo(video: SourceVideo) {
    this.videos = [video, ...this.videos];
    this.notify();
  }

  public deleteVideo(videoId: string) {
    this.videos = this.videos.filter((v) => v.id !== videoId);
    this.clips = this.clips.filter((c) => c.videoId !== videoId);
    this.notify();
  }

  // Clip Actions
  public addClips(newClips: Clip[]) {
    this.clips = [...newClips, ...this.clips];
    this.notify();
  }

  public updateClip(updatedClip: Clip) {
    this.clips = this.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c));
    this.notify();
  }

  public reorderClips(reordered: Clip[]) {
    this.clips = reordered.map((c, index) => ({
      ...c,
      manualRankOrder: index + 1,
    }));
    this.notify();
  }

  public deleteClip(clipId: string) {
    this.clips = this.clips.filter((c) => c.id !== clipId);
    this.notify();
  }

  // Brand Kit Actions
  public updateBrandKit(kit: BrandKit) {
    this.brandKits = this.brandKits.map((k) => (k.id === kit.id ? kit : k));
    this.notify();
  }

  public addBrandKit(kit: BrandKit) {
    this.brandKits = [...this.brandKits, kit];
    this.notify();
  }

  // Batch Queue Actions
  public enqueueClip(clip: Clip, platform: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x') {
    const video = this.videos.find((v) => v.id === clip.videoId);
    const item: BatchQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clipId: clip.id,
      videoTitle: video ? video.title : 'Masterclass Footage',
      clipTitle: clip.title,
      platform,
      aspectRatio: clip.aspectRatio,
      progress: 0,
      status: 'pending',
      duration: `${clip.durationSeconds.toFixed(1)}s`,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.batchQueue = [item, ...this.batchQueue];
    this.notify();

    // Simulate async high-performance render pipeline
    this.simulateRender(item.id);
  }

  private simulateRender(itemId: string) {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 22) + 12;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        this.batchQueue = this.batchQueue.map((item) =>
          item.id === itemId
            ? {
                ...item,
                progress: 100,
                status: 'completed',
                completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : item
        );
        this.notify();
      } else {
        this.batchQueue = this.batchQueue.map((item) =>
          item.id === itemId
            ? {
                ...item,
                progress: prog,
                status: 'processing',
              }
            : item
        );
        this.notify();
      }
    }, 450);
  }

  public clearBatchQueue() {
    this.batchQueue = [];
    this.notify();
  }

  public removeBatchItem(itemId: string) {
    this.batchQueue = this.batchQueue.filter((item) => item.id !== itemId);
    this.notify();
  }

  // Media Storage Vault Actions
  public addStoredMedia(item: StoredMediaItem) {
    this.storedMedia = [item, ...this.storedMedia];
    this.notify();
  }

  public saveClipToStorage(
    clip: Clip,
    bin: StorageBin = 'shorts_ready',
    scheduledTime?: string,
    autoPost: boolean = false,
    targetPlatforms: ('youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x')[] = ['youtube_shorts']
  ): StoredMediaItem {
    const video = this.videos.find((v) => v.id === clip.videoId);
    const newItem: StoredMediaItem = {
      id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clipId: clip.id,
      title: clip.title,
      hookText: clip.hookText,
      videoSrc: video ? video.videoSrc : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: video ? video.thumbnailUrl : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      bin,
      aspectRatio: clip.aspectRatio,
      durationSeconds: clip.durationSeconds,
      viralityScore: clip.virality.overall,
      scheduledPublishTime: scheduledTime,
      targetPlatforms,
      autoPostEnabled: autoPost,
      status: scheduledTime ? 'scheduled' : 'saved',
      createdAt: 'Just now',
      notes: `Mastered in Editing Studio · ${clip.aspectRatio} format`,
    };

    this.storedMedia = [newItem, ...this.storedMedia];
    this.notify();
    return newItem;
  }

  public moveStoredMediaBin(id: string, bin: StorageBin) {
    this.storedMedia = this.storedMedia.map((item) =>
      item.id === id
        ? {
            ...item,
            bin,
            status: bin === 'scheduled' ? 'scheduled' : bin === 'published' ? 'published' : 'saved',
          }
        : item
    );
    this.notify();
  }

  public scheduleMediaPost(
    id: string,
    scheduledPublishTime: string,
    autoPostEnabled: boolean,
    targetPlatforms?: ('youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x')[]
  ) {
    this.storedMedia = this.storedMedia.map((item) =>
      item.id === id
        ? {
            ...item,
            bin: 'scheduled',
            status: 'scheduled',
            scheduledPublishTime,
            autoPostEnabled,
            targetPlatforms: targetPlatforms || item.targetPlatforms,
          }
        : item
    );
    this.notify();
  }

  public deleteStoredMedia(id: string) {
    this.storedMedia = this.storedMedia.filter((item) => item.id !== id);
    this.notify();
  }

  // Social Account & Auto-Posting Access Actions
  public connectSocialAccount(
    id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x',
    handle: string,
    channelName: string
  ) {
    this.socialAccounts = this.socialAccounts.map((acc) =>
      acc.id === id
        ? {
            ...acc,
            connected: true,
            handle,
            channelName,
            lastSynced: 'Just now',
          }
        : acc
    );
    this.notify();
  }

  public disconnectSocialAccount(id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x') {
    this.socialAccounts = this.socialAccounts.map((acc) =>
      acc.id === id
        ? {
            ...acc,
            connected: false,
            handle: undefined,
            channelName: undefined,
            autoPostEnabled: false,
          }
        : acc
    );
    this.notify();
  }

  public toggleSocialAutoPost(id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x') {
    this.socialAccounts = this.socialAccounts.map((acc) =>
      acc.id === id ? { ...acc, autoPostEnabled: !acc.autoPostEnabled } : acc
    );
    this.notify();
  }

  public updateSocialPrivacy(
    id: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'x',
    defaultPrivacy: 'public' | 'unlisted' | 'private'
  ) {
    this.socialAccounts = this.socialAccounts.map((acc) =>
      acc.id === id ? { ...acc, defaultPrivacy } : acc
    );
    this.notify();
  }

  public resetToDefaults() {
    localStorage.clear();
    this.user = INITIAL_USER;
    this.workspaces = WORKSPACES;
    this.activeWorkspaceId = WORKSPACES[0].id;
    this.videos = SAMPLE_VIDEOS;
    this.clips = INITIAL_CLIPS;
    this.brandKits = BRAND_KITS;
    this.batchQueue = [];
    this.storedMedia = INITIAL_STORED_MEDIA;
    this.socialAccounts = INITIAL_SOCIAL_ACCOUNTS;
    this.notify();
  }
}

export function useSableStore() {
  const store = SableDataStore.getInstance();
  const [, setTick] = useState(0);

  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, [store]);

  return {
    user: store.user,
    workspaces: store.workspaces,
    activeWorkspaceId: store.activeWorkspaceId,
    activeWorkspace: store.workspaces.find((w) => w.id === store.activeWorkspaceId) || store.workspaces[0],
    videos: store.videos,
    clips: store.clips,
    brandKits: store.brandKits,
    activeBrandKit: store.brandKits.find((b) => b.isDefault) || store.brandKits[0],
    batchQueue: store.batchQueue,
    storedMedia: store.storedMedia,
    socialAccounts: store.socialAccounts,
    captionStyles: CAPTION_STYLES,
    updateTier: store.updateTier.bind(store),
    deductCredit: store.deductCredit.bind(store),
    setActiveWorkspace: store.setActiveWorkspace.bind(store),
    addVideo: store.addVideo.bind(store),
    deleteVideo: store.deleteVideo.bind(store),
    addClips: store.addClips.bind(store),
    updateClip: store.updateClip.bind(store),
    reorderClips: store.reorderClips.bind(store),
    deleteClip: store.deleteClip.bind(store),
    updateBrandKit: store.updateBrandKit.bind(store),
    addBrandKit: store.addBrandKit.bind(store),
    enqueueClip: store.enqueueClip.bind(store),
    clearBatchQueue: store.clearBatchQueue.bind(store),
    removeBatchItem: store.removeBatchItem.bind(store),
    // Vault & Storage Bindings
    addStoredMedia: store.addStoredMedia.bind(store),
    saveClipToStorage: store.saveClipToStorage.bind(store),
    moveStoredMediaBin: store.moveStoredMediaBin.bind(store),
    scheduleMediaPost: store.scheduleMediaPost.bind(store),
    deleteStoredMedia: store.deleteStoredMedia.bind(store),
    // Social Accounts Bindings
    connectSocialAccount: store.connectSocialAccount.bind(store),
    disconnectSocialAccount: store.disconnectSocialAccount.bind(store),
    toggleSocialAutoPost: store.toggleSocialAutoPost.bind(store),
    updateSocialPrivacy: store.updateSocialPrivacy.bind(store),
    resetToDefaults: store.resetToDefaults.bind(store),
  };
}
