/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Main Application Root
 * Executive AI-powered YouTube Shorts & Clipping Studio
 * Tagline: Where vision meets precision
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProductionWorkflowStepper } from './components/workflow/ProductionWorkflowStepper';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VideoIngestion } from './components/ingestion/VideoIngestion';
import { ClipViralityEngine } from './components/virality/ClipViralityEngine';
import { EditingStudio } from './components/studio/EditingStudio';
import { StorageVault } from './components/vault/StorageVault';
import { SocialConnectionsHub } from './components/autopost/SocialConnectionsHub';
import { BrandKitManager } from './components/brand/BrandKitManager';
import { BatchProcessing } from './components/batch/BatchProcessing';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ExportPublisher } from './components/export/ExportPublisher';
import { HowToDocumentation } from './components/docs/HowToDocumentation';
import { useSableStore } from './lib/db/store';
import { Clip } from './types';

export default function App() {
  const { clips } = useSableStore();
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedClip, setSelectedClip] = useState<Clip>(clips[0]);
  const [docsOpen, setDocsOpen] = useState<boolean>(false);

  // Maintain active clip reference
  const activeClip = clips.find((c) => c.id === selectedClip?.id) || clips[0];

  const handleSelectClip = (clip: Clip) => {
    setSelectedClip(clip);
  };

  const handleExportClip = (clip: Clip) => {
    setSelectedClip(clip);
    setCurrentTab('export');
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F2EB] flex flex-col font-sans selection:bg-[#BFA46F]/30 selection:text-[#F5F2EB]">
      {/* Top Bar Contract Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenDocs={() => setDocsOpen(true)}
      />

      {/* Guided Step-by-Step Pipeline Stepper */}
      <ProductionWorkflowStepper
        currentTab={currentTab}
        onNavigate={setCurrentTab}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          onOpenDocs={() => setDocsOpen(true)}
        />

        {/* Dynamic Viewport Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#0F0F0F] pb-16">
          {currentTab === 'overview' && (
            <DashboardOverview
              onNavigate={setCurrentTab}
              onSelectClip={handleSelectClip}
            />
          )}

          {currentTab === 'ingestion' && (
            <VideoIngestion
              onNavigate={setCurrentTab}
              onClipsGenerated={() => {
                if (clips.length > 0) setSelectedClip(clips[0]);
              }}
            />
          )}

          {currentTab === 'virality' && (
            <ClipViralityEngine
              onNavigate={setCurrentTab}
              onSelectClip={handleSelectClip}
            />
          )}

          {currentTab === 'studio' && activeClip && (
            <EditingStudio
              clip={activeClip}
              onNavigate={setCurrentTab}
              onExportClip={handleExportClip}
            />
          )}

          {currentTab === 'vault' && (
            <StorageVault
              onNavigate={setCurrentTab}
              onSelectClipForStudio={(clipId) => {
                const found = clips.find((c) => c.id === clipId);
                if (found) {
                  setSelectedClip(found);
                  setCurrentTab('studio');
                }
              }}
            />
          )}

          {currentTab === 'social_hub' && (
            <SocialConnectionsHub onNavigate={setCurrentTab} />
          )}

          {currentTab === 'brand' && <BrandKitManager />}

          {currentTab === 'batch' && <BatchProcessing />}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'export' && activeClip && (
            <ExportPublisher
              clip={activeClip}
              onNavigate={setCurrentTab}
            />
          )}
        </main>
      </div>

      {/* In-App Documentation & Architecture Guide Modal */}
      <HowToDocumentation
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />
    </div>
  );
}
