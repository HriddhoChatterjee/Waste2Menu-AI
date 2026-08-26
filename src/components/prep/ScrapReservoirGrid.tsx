import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ScrapItem, ScrapCategory } from '../../types';
import { 
  Layers, 
  Clock, 
  Trash2, 
  Sparkles, 
  Flame, 
  Leaf, 
  Apple, 
  Fish, 
  Wheat, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ScrapReservoirGrid: React.FC = () => {
  const { scraps, removeScrap, setRole } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | ScrapCategory>('all');
  
  // Real-time ticking clock simulation for perishability countdown
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCategoryIcon = (cat: ScrapCategory) => {
    switch (cat) {
      case 'poultry_bones':
        return <Flame className="w-4 h-4 text-coral" />;
      case 'mirepoix_peels':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'citrus_rinds':
        return <Apple className="w-4 h-4 text-amber" />;
      case 'herb_stems':
        return <Leaf className="w-4 h-4 text-emerald-300" />;
      case 'bread_crusts':
        return <Wheat className="w-4 h-4 text-violet-400" />;
      case 'fish_frames':
        return <Fish className="w-4 h-4 text-blue-400" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCategoryName = (cat: ScrapCategory) => {
    switch (cat) {
      case 'poultry_bones': return 'Poultry Bones & Carcasses';
      case 'mirepoix_peels': return 'Mirepoix & Root Skins';
      case 'citrus_rinds': return 'Citrus Rinds & Piths';
      case 'herb_stems': return 'Herb Stems & Leaves';
      case 'bread_crusts': return 'Sourdough Crusts';
      case 'fish_frames': return 'Fish Frames & Trims';
    }
  };

  const filteredScraps = activeFilter === 'all' 
    ? scraps 
    : scraps.filter((s) => s.category === activeFilter);

  const totalStockpileKg = scraps.reduce((acc, s) => acc + s.weightKg, 0);

  // Grouped breakdown weights
  const categoryTotals = scraps.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.weightKg;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-light gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-bold text-white text-base">
                Active Byproduct Scrap Reservoir
              </h3>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                {totalStockpileKg.toFixed(1)} kg Total
              </span>
            </div>
            <p className="text-xs text-textMuted font-mono">
              Live Stockpile with Perishable Freshness Decay Timers
            </p>
          </div>
        </div>

        {/* Shortcut to Recipe Matcher */}
        <button
          onClick={() => setRole('recipes')}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold text-xs shadow-glow-violet transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-violet-200" />
          <span>Match Reverse Recipes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-3 border-b border-charcoal-light/60 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'all'
              ? 'bg-emerald-500 text-obsidian font-bold shadow-sm'
              : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
          }`}
        >
          All Stockpiles ({scraps.length})
        </button>

        {(['poultry_bones', 'mirepoix_peels', 'citrus_rinds', 'herb_stems', 'bread_crusts'] as ScrapCategory[]).map((cat) => {
          const count = scraps.filter((s) => s.category === cat).length;
          const weight = categoryTotals[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-charcoal-lighter text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{getCategoryName(cat).split(' ')[0]}</span>
              <span className="font-mono text-[10px] text-textMuted">({weight.toFixed(1)}k)</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Scrap Cards */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredScraps.length === 0 ? (
          <div className="text-center py-12 text-textMuted">
            <Layers className="w-10 h-10 text-charcoal-light mx-auto mb-2" />
            <p className="text-sm font-medium">Scrap Reservoir Empty for this category</p>
            <p className="text-xs text-textMuted mt-1">Run an AI vision scan or log a manual smart scale entry above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredScraps.map((scrap) => {
              // Calculate simulated hours and minutes countdown
              const totalMins = Math.max(0, Math.floor(scrap.perishableHoursLeft * 60 - (ticker % 60)));
              const hours = Math.floor(totalMins / 60);
              const mins = totalMins % 60;
              const freshnessPercent = Math.min(100, Math.round((scrap.perishableHoursLeft / scrap.maxPerishableHours) * 100));

              let statusColor = 'text-emerald-400';
              let progressColor = 'bg-emerald-500';
              if (freshnessPercent < 35) {
                statusColor = 'text-coral animate-pulse';
                progressColor = 'bg-coral';
              } else if (freshnessPercent < 60) {
                statusColor = 'text-amber';
                progressColor = 'bg-amber';
              }

              return (
                <div
                  key={scrap.id}
                  className="p-4 rounded-xl bg-charcoal border border-charcoal-light hover:border-charcoal-lighter transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5">
                      <div className="p-2 rounded-lg bg-obsidian border border-charcoal-light mt-0.5">
                        {getCategoryIcon(scrap.category)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-white">{scrap.name}</h4>
                          {scrap.detectedFromVision && (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                              AI Vision
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-textMuted uppercase">
                          {getCategoryName(scrap.category)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeScrap(scrap.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-textMuted hover:text-coral hover:bg-obsidian transition-all"
                      title="Discard / Delete Scrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mass & Freshness Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-obsidian/70 p-2.5 rounded-xl border border-charcoal-light/70">
                    <div>
                      <span className="text-[10px] font-mono text-textMuted uppercase block">
                        Stock Mass
                      </span>
                      <span className="text-base font-heading font-black text-emerald-400">
                        {scrap.weightKg.toFixed(1)} <span className="text-xs font-normal text-textMuted">kg</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-textMuted uppercase block">
                        Freshness Safe Window
                      </span>
                      <span className={`text-xs font-mono font-bold flex items-center space-x-1 ${statusColor}`}>
                        <Clock className="w-3 h-3" />
                        <span>T-minus {hours}h {mins}m</span>
                      </span>
                    </div>
                  </div>

                  {/* Freshness progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-textMuted mb-1">
                      <span>Perishable Freshness</span>
                      <span>{freshnessPercent}% Safe</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-obsidian overflow-hidden border border-charcoal-light/50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${freshnessPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes / Quality */}
                  {scrap.notes && (
                    <div className="text-[11px] text-textMuted line-clamp-1 italic">
                      "{scrap.notes}"
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
