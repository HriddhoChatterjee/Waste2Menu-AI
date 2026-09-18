import React from 'react';
import { VisionIngestor } from './VisionIngestor';
import { ManualScaleEntry } from './ManualScaleEntry';
import { ScrapReservoirGrid } from './ScrapReservoirGrid';
import { useAppStore } from '../../store/useAppStore';
import { ScrollReveal } from '../common/ScrollReveal';

export const KitchenPrepView: React.FC = () => {
  const { scraps } = useAppStore();
  const totalScrapsKg = scraps.reduce((acc, s) => acc + s.weightKg, 0);

  return (
    <div className="space-y-6">
      
      {/* Screen Header Banner */}
      <ScrollReveal direction="up" distance={20}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FDFBF7] to-[#F5EFEB] p-6 rounded-2xl border border-[#E8DFD1] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                Station Screen 1
              </span>
              <span className="text-[#6B6358] text-xs font-mono">• Line Ingestion Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1C1917]">
              Kitchen Prep-Scrap Tracking & AI Vision Station
            </h1>
            <p className="text-sm text-[#6B6358] max-w-2xl">
              Real-time neural segmentation cutting-board scanner, high-yield knife efficiency tracking, and live perishable byproduct reservoir.
            </p>
          </div>

          {/* Quick KPI preview */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white border border-[#E8DFD1] p-3.5 rounded-xl text-right shadow-sm">
              <div className="text-[11px] font-mono text-[#6B6358] uppercase font-bold">Stockpile Weight</div>
              <div className="text-xl font-heading font-black text-emerald-700">
                {totalScrapsKg.toFixed(1)} <span className="text-xs font-normal text-[#6B6358]">kg</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8DFD1] p-3.5 rounded-xl text-right shadow-sm">
              <div className="text-[11px] font-mono text-[#6B6358] uppercase font-bold">Logged Items</div>
              <div className="text-xl font-heading font-black text-stone-900">
                {scraps.length} <span className="text-xs font-normal text-[#6B6358]">scraps</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2-Column Grid: Vision Ingestor on Left, Scale on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Vision Ingestor (7 cols) */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" distance={24} delay={0.06}>
            <VisionIngestor />
          </ScrollReveal>
        </div>

        {/* Right: Smart Scale Entry & Knife Gauge (5 cols) */}
        <div className="lg:col-span-5">
          <ScrollReveal direction="up" distance={24} delay={0.12}>
            <ManualScaleEntry />
          </ScrollReveal>
        </div>

      </div>

      {/* Full Width: Active Scrap Reservoir Grid */}
      <div className="w-full">
        <ScrollReveal direction="up" distance={24} delay={0.16}>
          <ScrapReservoirGrid />
        </ScrollReveal>
      </div>

    </div>
  );
};
