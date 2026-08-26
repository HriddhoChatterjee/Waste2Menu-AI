import React from 'react';
import { VisionIngestor } from './VisionIngestor';
import { ManualScaleEntry } from './ManualScaleEntry';
import { ScrapReservoirGrid } from './ScrapReservoirGrid';
import { Sparkles, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const KitchenPrepView: React.FC = () => {
  const { scraps, setRole } = useAppStore();
  const totalScrapsKg = scraps.reduce((acc, s) => acc + s.weightKg, 0);

  return (
    <div className="space-y-6">
      
      {/* Screen Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-charcoal via-charcoal-dark to-obsidian p-6 rounded-2xl border border-charcoal-light shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Station Screen 1
            </span>
            <span className="text-textMuted text-xs font-mono">• Line Ingestion Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Kitchen Prep-Scrap Tracking & AI Vision Station
          </h1>
          <p className="text-sm text-textMuted max-w-2xl">
            Real-time neural segmentation cutting-board scanner, high-yield knife efficiency tracking, and live perishable byproduct reservoir.
          </p>
        </div>

        {/* Quick KPI preview */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-obsidian/80 border border-charcoal-light p-3.5 rounded-xl text-right">
            <div className="text-[11px] font-mono text-textMuted uppercase">Stockpile Weight</div>
            <div className="text-xl font-heading font-black text-emerald-400">
              {totalScrapsKg.toFixed(1)} <span className="text-xs font-normal text-textMuted">kg</span>
            </div>
          </div>
          <button
            onClick={() => setRole('recipes')}
            className="flex items-center space-x-2 px-4 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs shadow-glow-emerald transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Specials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Vision Ingestor on Left, Scale on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Vision Ingestor (7 cols) */}
        <div className="lg:col-span-7">
          <VisionIngestor />
        </div>

        {/* Right: Smart Scale Entry & Knife Gauge (5 cols) */}
        <div className="lg:col-span-5">
          <ManualScaleEntry />
        </div>

      </div>

      {/* Full Width: Active Scrap Reservoir Grid */}
      <div className="w-full">
        <ScrapReservoirGrid />
      </div>

    </div>
  );
};
