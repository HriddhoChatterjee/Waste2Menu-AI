import React, { useState } from 'react';
import { RecipeDish } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Sparkles, 
  CreditCard, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  Minus,
  Plus
} from 'lucide-react';

interface PushToPosModalProps {
  isOpen: boolean;
  recipe: RecipeDish;
  onClose: () => void;
}

export const PushToPosModal: React.FC<PushToPosModalProps> = ({ isOpen, recipe, onClose }) => {
  const { pushRecipeToPos, setRole } = useAppStore();
  const [portions, setPortions] = useState(recipe.yieldPortions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = portions * recipe.suggestedPrice;
  const totalCost = portions * (recipe.rawByproductCost + recipe.seasoningGasCost);
  const totalProfit = totalRevenue - totalCost;

  const handleConfirmPush = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      pushRecipeToPos(recipe.id, portions);
      setIsSubmitting(false);
      onClose();
      // Optionally jump to POS terminal to show live SKU
      setRole('pos');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-obsidian-dark border border-charcoal-light rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-textMuted hover:text-white hover:bg-charcoal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/40 text-emerald-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
              Chef Approval Authorization
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              Push Dynamic Special to Cashier POS
            </h3>
          </div>
        </div>

        {/* Dish Summary Card */}
        <div className="p-4 rounded-xl bg-charcoal border border-charcoal-light space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-white">{recipe.title}</h4>
              <p className="text-xs text-textMuted mt-0.5">{recipe.flavorProfile}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
              {recipe.marginPercent}% Margin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-obsidian p-2.5 rounded-lg border border-charcoal-light/60">
            <div>
              <span className="text-textMuted block text-[10px]">Scrap Consumed</span>
              <span className="text-emerald-400 font-bold">{recipe.scrapWeightNeededKg} kg ({recipe.scrapTypeNeeded.replace('_', ' ')})</span>
            </div>
            <div>
              <span className="text-textMuted block text-[10px]">POS Unit Price</span>
              <span className="text-white font-bold">₹{recipe.suggestedPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Portion Batch Sizer */}
        <div className="space-y-2 bg-charcoal/60 p-4 rounded-xl border border-charcoal-light">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-textMuted uppercase font-semibold">
              Authorized Portions for Service
            </span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {portions} Portions
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPortions(Math.max(4, portions - 2))}
              className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="4"
              max="30"
              step="2"
              value={portions}
              onChange={(e) => setPortions(parseInt(e.target.value))}
              className="flex-1 accent-emerald-500 cursor-pointer"
            />
            <button
              onClick={() => setPortions(Math.min(40, portions + 2))}
              className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-textMuted pt-1">
            <span>Projected Revenue: <strong className="text-white">₹{totalRevenue}</strong></span>
            <span>Est. Net Profit: <strong className="text-emerald-400">+₹{totalProfit.toFixed(0)}</strong></span>
          </div>
        </div>

        {/* Notice Info */}
        <div className="flex items-start space-x-2 text-xs text-textMuted bg-obsidian p-3 rounded-xl border border-charcoal-light">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Upon approval, this SKU will immediately appear on the Cashier POS with a live counter of <strong>{portions} portions</strong>. Unsold portions at shift close will automatically route to NGO Redistribution.
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-textMuted hover:text-white border border-charcoal-light text-xs font-bold transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmPush}
            className="flex-2 flex-grow py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian font-bold text-xs shadow-glow-emerald transition-all transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting to POS...</span>
              </span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Authorize & Deploy to POS ({portions} Portions)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
