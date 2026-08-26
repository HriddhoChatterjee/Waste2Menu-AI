import React, { useState } from 'react';
import { RecipeDish, ScrapCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  ChefHat,
  Check
} from 'lucide-react';
import { PushToPosModal } from './PushToPosModal';

interface RecipeCardProps {
  recipe: RecipeDish;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { scraps, togglePantryIngredient } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  // Check how much scrap is available for this recipe
  const availableScrapWeight = scraps
    .filter((s) => s.category === recipe.scrapTypeNeeded)
    .reduce((acc, s) => acc + s.weightKg, 0);

  const hasEnoughScrap = availableScrapWeight >= recipe.scrapWeightNeededKg;
  const allPantryInStock = recipe.pantryIngredients.every((pi) => pi.inStock);
  const isReadyToPush = hasEnoughScrap && allPantryInStock;

  // Potential Total Revenue and Profit from this batch
  const totalBatchRevenue = recipe.yieldPortions * recipe.suggestedPrice;
  const totalBatchCost = recipe.yieldPortions * (recipe.rawByproductCost + recipe.seasoningGasCost);
  const totalBatchProfit = totalBatchRevenue - totalBatchCost;

  return (
    <>
      <div className={`glass-panel rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isReadyToPush 
          ? 'border-emerald-500/40 hover:border-emerald-400/80 shadow-glow-emerald/30' 
          : 'border-charcoal-light opacity-90'
      }`}>
        
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {recipe.category}
                </span>
                {isReadyToPush && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Feasible Now</span>
                  </span>
                )}
              </div>
              <h3 className="font-heading font-black text-white text-lg mt-1.5 leading-snug">
                {recipe.title}
              </h3>
            </div>

            {/* Margin badge */}
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-heading font-black text-sm">
                {recipe.marginPercent}% Margin
              </span>
              <span className="text-[10px] font-mono text-textMuted block mt-0.5">
                Upcycled Profit
              </span>
            </div>
          </div>

          <p className="text-xs text-textMuted leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Quick Metrics Bar: Yield Portions, Prep Time, Scrap Needed */}
          <div className="grid grid-cols-3 gap-2 bg-obsidian-dark/80 p-3 rounded-xl border border-charcoal-light mb-4">
            <div>
              <span className="text-[10px] font-mono text-textMuted uppercase block flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Yield
              </span>
              <span className="text-sm font-heading font-black text-white">
                {recipe.yieldPortions} <span className="text-[11px] font-normal text-textMuted">portions</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-textMuted uppercase block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber" /> Prep Time
              </span>
              <span className="text-sm font-heading font-black text-white">
                {recipe.prepTimeMins} <span className="text-[11px] font-normal text-textMuted">mins</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-textMuted uppercase block flex items-center gap-1">
                <Flame className="w-3 h-3 text-coral" /> Scrap Mass
              </span>
              <span className="text-sm font-heading font-black text-white">
                {recipe.scrapWeightNeededKg} <span className="text-[11px] font-normal text-textMuted">kg ({availableScrapWeight.toFixed(1)}k avail)</span>
              </span>
            </div>
          </div>

          {/* Cost & Margin Breakdown Box */}
          <div className="p-3.5 rounded-xl bg-charcoal/80 border border-charcoal-light space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-charcoal-light/60">
              <span className="font-mono text-textMuted font-medium">Cost & Margin Breakdown (Per Portion)</span>
              <span className="font-mono text-emerald-400 font-bold">Suggested: ₹{recipe.suggestedPrice.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-obsidian/60 p-2 rounded-lg border border-charcoal-light/60">
                <span className="text-[10px] text-textMuted block">Raw Byproduct Cost</span>
                <span className="font-bold text-emerald-400">₹{recipe.rawByproductCost.toFixed(2)} (Free)</span>
              </div>
              <div className="bg-obsidian/60 p-2 rounded-lg border border-charcoal-light/60">
                <span className="text-[10px] text-textMuted block">Seasoning & Gas</span>
                <span className="font-bold text-textPrimary">₹{recipe.seasoningGasCost.toFixed(2)}</span>
              </div>
              <div className="bg-obsidian/60 p-2 rounded-lg border border-charcoal-light/60">
                <span className="text-[10px] text-textMuted block">Batch Net Profit</span>
                <span className="font-bold text-emerald-400">+₹{totalBatchProfit.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Pantry Ingredients Checklist */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-semibold text-textMuted uppercase tracking-wider">
                Pantry Requirements Checklist
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {recipe.pantryIngredients.filter((pi) => pi.inStock).length}/{recipe.pantryIngredients.length} In-Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {recipe.pantryIngredients.map((ing) => (
                <button
                  type="button"
                  key={ing.name}
                  onClick={() => togglePantryIngredient(recipe.id, ing.name)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                    ing.inStock
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-coral/10 border-coral/30 text-coral'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {ing.inStock ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-coral shrink-0" />
                    )}
                    <span className="truncate">{ing.name}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80 shrink-0 ml-1">{ing.qty}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Chef Tips & Instructions */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-charcoal-light space-y-3">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs text-violet-200">
                <div className="font-bold flex items-center gap-1.5 text-violet-300 mb-1">
                  <ChefHat className="w-3.5 h-3.5" /> Chef Pro-Tip
                </div>
                {recipe.chefTips}
              </div>

              <div>
                <span className="text-xs font-mono font-semibold text-textMuted uppercase block mb-1.5">
                  Line Preparation Steps
                </span>
                <ol className="space-y-1.5 text-xs text-textMuted font-mono">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-charcoal-light text-textPrimary text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-white leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-charcoal-light flex items-center justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-textMuted hover:text-white flex items-center space-x-1 font-mono"
          >
            <span>{isExpanded ? 'Hide Steps' : 'View Chef Steps'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Approve and Push to POS Button */}
          <button
            onClick={() => setIsPushModalOpen(true)}
            disabled={!hasEnoughScrap}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all transform active:scale-95 ${
              hasEnoughScrap
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian shadow-glow-emerald'
                : 'bg-charcoal text-textMuted border border-charcoal-light cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{hasEnoughScrap ? 'Approve & Push to POS' : `Need +${(recipe.scrapWeightNeededKg - availableScrapWeight).toFixed(1)}kg Scrap`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Push to POS Modal */}
      <PushToPosModal
        isOpen={isPushModalOpen}
        recipe={recipe}
        onClose={() => setIsPushModalOpen(false)}
      />
    </>
  );
};
