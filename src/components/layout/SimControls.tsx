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
      <div className="bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#E8DFD1] shadow-xl rounded-2xl p-2 px-3 flex items-center space-x-2 text-xs">
        
        {/* Toggle label */}
        <div className="flex items-center space-x-2 pl-1 pr-2 border-r border-[#E8DFD1]">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="font-heading font-bold text-stone-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Sim Engine</span>
          </span>
        </div>

        {/* Quick action buttons */}
        <button
          onClick={simulateScrapDump}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-[#E8DFD1] transition-all font-medium shadow-xs"
          title="Simulate Cutting Board Scrap Scan Inflow"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">+ Scrap Dump</span>
          <span className="sm:hidden">+ Scrap</span>
        </button>

        <button
          onClick={simulateOrderRush}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-violet-50 hover:text-violet-800 text-stone-700 border border-[#E8DFD1] transition-all font-medium shadow-xs"
          title="Simulate POS Order & Decrement Dynamic Special portions"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-violet-600" />
          <span className="hidden sm:inline">Rush Order</span>
          <span className="sm:hidden">Order</span>
        </button>

        <button
          onClick={simulateShiftEndFallback}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 hover:text-amber-800 text-stone-700 border border-[#E8DFD1] transition-all font-medium shadow-xs"
          title="Broadcast Remaining Specials to NGO Portal"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Shift End NGO</span>
          <span className="sm:hidden">NGO</span>
        </button>

        <button
          onClick={resetAllData}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-stone-400 border border-[#E8DFD1] transition-all shadow-xs"
          title="Reset All Data to Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
