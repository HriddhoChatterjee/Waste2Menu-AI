import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Zap, Clock, TrendingDown, Sparkles } from 'lucide-react';

export const FlashDiscountSlider: React.FC = () => {
  const { flashDiscountPercent, setFlashDiscount } = useAppStore();

  const discountLevels = [0, 20, 40, 50];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-amber/40 bg-gradient-to-r from-amber/5 via-charcoal to-obsidian shadow-glow-amber/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Title and Explanation */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber/20 border border-amber/40 text-amber animate-pulse">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-heading font-black text-white text-sm">
                Closing-Hour Flash Markdown Engine
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber/20 text-amber border border-amber/40">
                {flashDiscountPercent > 0 ? `${flashDiscountPercent}% Markdown Active` : 'Standard Price'}
              </span>
            </div>
            <p className="text-xs text-textMuted font-mono">
              Apply dynamic time-decay discounts to Chef Specials before shift close to prevent food waste.
            </p>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center space-x-2">
          {discountLevels.map((lvl) => {
            const isSelected = flashDiscountPercent === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setFlashDiscount(lvl)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-amber text-obsidian shadow-glow-amber scale-105'
                    : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light hover:border-amber/40'
                }`}
              >
                {lvl === 0 ? '0% (Base)' : `-${lvl}%`}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
