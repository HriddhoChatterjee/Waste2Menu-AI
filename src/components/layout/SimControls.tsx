import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Zap, 
  PlusCircle, 
  ShoppingCart, 
  HeartHandshake, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const SimControls: React.FC = () => {
  const { 
    simulateScrapDump, 
    simulateOrderRush, 
    simulateShiftEndFallback, 
    resetAllData 
  } = useAppStore();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-charcoal-dark/95 backdrop-blur-xl border border-charcoal-light/90 shadow-2xl rounded-2xl p-2 px-3 flex items-center space-x-2 text-xs">
        
        {/* Toggle label */}
        <div className="flex items-center space-x-2 pl-1 pr-2 border-r border-charcoal-light/60">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-heading font-bold text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sim Engine</span>
          </span>
        </div>

        {/* Quick action buttons */}
        <button
          onClick={simulateScrapDump}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-charcoal hover:bg-emerald-500/20 hover:text-emerald-300 text-textMuted border border-charcoal-light transition-all font-medium"
          title="Simulate Cutting Board Scrap Scan Inflow"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">+ Scrap Dump</span>
          <span className="sm:hidden">+ Scrap</span>
        </button>

        <button
          onClick={simulateOrderRush}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-charcoal hover:bg-violet-500/20 hover:text-violet-300 text-textMuted border border-charcoal-light transition-all font-medium"
          title="Simulate POS Order & Decrement Dynamic Special portions"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">Rush Order</span>
          <span className="sm:hidden">Order</span>
        </button>

        <button
          onClick={simulateShiftEndFallback}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-charcoal hover:bg-amber-500/20 hover:text-amber-300 text-textMuted border border-charcoal-light transition-all font-medium"
          title="Broadcast Remaining Specials to NGO Portal"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-amber" />
          <span className="hidden sm:inline">Shift End NGO</span>
          <span className="sm:hidden">NGO</span>
        </button>

        <button
          onClick={resetAllData}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-charcoal hover:bg-coral/20 hover:text-coral text-textMuted border border-charcoal-light transition-all"
          title="Reset All Data to Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
