/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sable Circle — Brand Kit & Watermark Studio
 * Manage studio branding: logo watermark positioning, opacity,
 * palette tokens (#0F0F0F, #F5F2EB, #BFA46F), and typography presets.
 */

import React, { useState } from 'react';
import { useSableStore } from '../../lib/db/store';
import {
  Palette,
  Upload,
  Check,
  Plus,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { BrandKit } from '../../types';

export const BrandKitManager: React.FC = () => {
  const { brandKits, activeBrandKit, updateBrandKit, addBrandKit } = useSableStore();
  const [selectedKitId, setSelectedKitId] = useState<string>(activeBrandKit.id);

  const currentKit = brandKits.find((k) => k.id === selectedKitId) || activeBrandKit;

  const handleUpdate = (partial: Partial<BrandKit>) => {
    const updated = { ...currentKit, ...partial };
    updateBrandKit(updated);
  };

  const handleCreateNewKit = () => {
    const newKit: BrandKit = {
      id: `bk_${Date.now()}`,
      workspaceId: currentKit.workspaceId,
      name: `Custom Atelier ${brandKits.length + 1}`,
      logoUrl: '/assets/aistudio/App_Icon_Dark_03_4960f3e5.png',
      watermarkPosition: 'top-right',
      watermarkOpacity: 0.85,
      watermarkScale: 0.9,
      primaryColor: '#0F0F0F',
      accentColor: '#BFA46F',
      secondaryColor: '#F5F2EB',
      fontHeading: 'Outfit',
      fontSub: 'Plus Jakarta Sans',
      isDefault: false,
    };
    addBrandKit(newKit);
    setSelectedKitId(newKit.id);
  };

  const handleMakeDefault = (kitId: string) => {
    brandKits.forEach((k) => {
      updateBrandKit({ ...k, isDefault: k.id === kitId });
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8E8A82] mb-1">
            <span>Identity & Aesthetics</span>
            <span>·</span>
            <span>Watermark Placement & Typography</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F5F2EB]">
            Brand Kit & Watermark Studio
          </h1>
          <p className="text-xs text-[#8E8A82] mt-1 max-w-xl">
            Ensure every 9:16 short adheres strictly to your production house aesthetic.
            Logos and color tokens are rendered dynamically into video export frames.
          </p>
        </div>

        <button
          onClick={handleCreateNewKit}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#F5F2EB] rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#BFA46F]" />
          <span>New Brand Kit</span>
        </button>
      </div>

      {/* Brand Kit Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {brandKits.map((kit) => {
          const isSelected = kit.id === currentKit.id;
          return (
            <div
              key={kit.id}
              onClick={() => setSelectedKitId(kit.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#181818] border-[#BFA46F]/70 shadow-md ring-1 ring-[#BFA46F]/30'
                  : 'bg-[#131313] border-[#222222] hover:border-[#303030]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#F5F2EB]">{kit.name}</div>
                  <div className="text-[11px] text-[#8E8A82] mt-0.5 font-mono">
                    {kit.fontHeading} / {kit.fontSub}
                  </div>
                </div>
                {kit.isDefault && (
                  <span className="text-[10px] font-mono uppercase bg-[#BFA46F]/20 text-[#D4BE8D] px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>

              {/* Color Swatch Preview */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#202020]">
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: kit.primaryColor }}
                  title="Primary"
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: kit.accentColor }}
                  title="Accent"
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: kit.secondaryColor }}
                  title="Secondary"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor & Live 9:16 Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customizer Controls */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#242424] rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <div>
              <h2 className="text-sm font-semibold text-[#F5F2EB]">{currentKit.name}</h2>
              <div className="text-[11px] text-[#8E8A82]">Configure identity parameters</div>
            </div>
            {!currentKit.isDefault && (
              <button
                onClick={() => handleMakeDefault(currentKit.id)}
                className="text-xs text-[#BFA46F] hover:underline"
              >
                Set as Workspace Default
              </button>
            )}
          </div>

          {/* Logo / Monogram Setup */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#F5F2EB] flex items-center justify-between">
              <span>Studio Logo / Monogram</span>
              <span className="text-[11px] text-[#737373] font-normal">PNG or SVG with alpha</span>
            </label>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0F0F0F] border border-[#222222]">
              <div className="w-12 h-12 rounded-full bg-black border border-[#BFA46F]/50 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={currentKit.logoUrl}
                  alt="Brand Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-[#F5F2EB]">Sable Circle Interlocking SC</div>
                <div className="text-[11px] text-[#8E8A82]">Custom circular medallion</div>
              </div>
              <label className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2F2F2F] text-xs text-[#F5F2EB] rounded cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 inline mr-1 text-[#BFA46F]" />
                <span>Replace</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      handleUpdate({ logoUrl: URL.createObjectURL(f) });
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Watermark Position */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#F5F2EB]">
              Watermark Screen Position
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'top-left', label: 'Top Left' },
                { id: 'top-right', label: 'Top Right' },
                { id: 'bottom-left', label: 'Bottom Left' },
                { id: 'bottom-right', label: 'Bottom Right' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => handleUpdate({ watermarkPosition: pos.id as BrandKit['watermarkPosition'] })}
                  className={`p-2.5 rounded text-xs border transition-all text-center ${
                    currentKit.watermarkPosition === pos.id
                      ? 'bg-[#1F1F1F] border-[#BFA46F] text-[#F5F2EB] font-medium'
                      : 'bg-[#161616] border-[#252525] text-[#8E8A82] hover:text-[#F5F2EB]'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 rounded-lg bg-[#0F0F0F] border border-[#222222]">
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8A82]">Watermark Opacity</span>
                <span className="font-mono text-[#D4BE8D]">
                  {Math.round(currentKit.watermarkOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={currentKit.watermarkOpacity}
                onChange={(e) => handleUpdate({ watermarkOpacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#0F0F0F] border border-[#222222]">
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8A82]">Watermark Scale</span>
                <span className="font-mono text-[#D4BE8D]">
                  {Math.round(currentKit.watermarkScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={currentKit.watermarkScale}
                onChange={(e) => handleUpdate({ watermarkScale: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Palette Tokens */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#F5F2EB]">
              Color Identity Tokens
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#737373] uppercase font-mono">Primary Canvas</span>
                <div className="flex items-center gap-2 p-2 bg-[#0F0F0F] border border-[#262626] rounded">
                  <input
                    type="color"
                    value={currentKit.primaryColor}
                    onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                    className="w-6 h-6 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={currentKit.primaryColor}
                    onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono uppercase text-[#F5F2EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#737373] uppercase font-mono">Accent Gold</span>
                <div className="flex items-center gap-2 p-2 bg-[#0F0F0F] border border-[#262626] rounded">
                  <input
                    type="color"
                    value={currentKit.accentColor}
                    onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                    className="w-6 h-6 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={currentKit.accentColor}
                    onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono uppercase text-[#D4BE8D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#737373] uppercase font-mono">Secondary Ivory</span>
                <div className="flex items-center gap-2 p-2 bg-[#0F0F0F] border border-[#262626] rounded">
                  <input
                    type="color"
                    value={currentKit.secondaryColor}
                    onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                    className="w-6 h-6 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={currentKit.secondaryColor}
                    onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono uppercase text-[#E5E5E5] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Vertical Short Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-mono uppercase tracking-wider text-[#737373] mb-3">
            9:16 Short Brand Render Preview
          </div>

          <div className="w-[280px] aspect-[9/16] rounded-2xl bg-black border border-[#2D2D2D] relative overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Background cinematic gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1814] via-[#0F0F0F] to-[#080808] opacity-90" />

            {/* Dynamic Watermark */}
            <div
              className={`absolute p-3 ${
                currentKit.watermarkPosition === 'top-left'
                  ? 'top-2 left-2'
                  : currentKit.watermarkPosition === 'bottom-left'
                  ? 'bottom-8 left-2'
                  : currentKit.watermarkPosition === 'bottom-right'
                  ? 'bottom-8 right-2'
                  : 'top-2 right-2'
              }`}
              style={{
                opacity: currentKit.watermarkOpacity,
                transform: `scale(${currentKit.watermarkScale})`,
              }}
            >
              <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                <img
                  src={currentKit.logoUrl}
                  alt="Watermark"
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span
                  className="text-[9px] font-mono tracking-wider uppercase font-semibold"
                  style={{ color: currentKit.secondaryColor }}
                >
                  SABLE
                </span>
              </div>
            </div>

            {/* Simulated Hook */}
            <div className="relative z-10 pt-10 text-center">
              <span
                className="inline-block px-3 py-1 rounded text-[10px] font-display font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: currentKit.primaryColor,
                  color: currentKit.secondaryColor,
                  border: `1px solid ${currentKit.accentColor}50`,
                }}
              >
                THE UNTOLD PERSPECTIVE
              </span>
            </div>

            {/* Simulated Caption */}
            <div className="relative z-10 text-center pb-8 space-y-2">
              <p
                className="text-sm font-bold leading-snug uppercase"
                style={{
                  fontFamily: currentKit.fontHeading,
                  color: currentKit.secondaryColor,
                }}
              >
                WHERE <span style={{ color: currentKit.accentColor }}>VISION</span> MEETS PRECISION
              </p>
              <div
                className="text-[10px] tracking-wider uppercase font-mono opacity-80"
                style={{ color: currentKit.accentColor }}
              >
                DIRECTOR'S CUT · 4K 60FPS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
