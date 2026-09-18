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
  Check,
  Lock
} from 'lucide-react';
import { PushToPosModal } from './PushToPosModal';

interface RecipeCardProps {
  recipe: RecipeDish;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { scraps, togglePantryIngredient, isAuthenticated, openAuthModal } = useAppStore();
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
      <div className={`glass-panel rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-sm ${
        isReadyToPush 
          ? 'border-emerald-500/50 hover:border-emerald-500 shadow-glow-emerald/40' 
          : 'border-[#E8DFD1] hover:border-[#D4C6B2]'
      }`}>
        
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-violet-100 text-violet-700 border border-violet-200">
                  {recipe.category}
                </span>
                {recipe.author && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                    <ChefHat className="w-2.5 h-2.5" />
                    <span>{recipe.author}</span>
                  </span>
                )}
                {isReadyToPush && (
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Feasible Now</span>
                  </span>
                )}
              </div>
              <h3 className="font-heading font-black text-[#1C1917] text-lg mt-1.5 leading-snug">
                {recipe.title}
              </h3>
            </div>

            {/* Margin badge */}
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-heading font-black text-sm shadow-sm">
                {recipe.marginPercent}% Margin
              </span>
              <span className="text-[10px] font-mono text-[#6B6358] block mt-0.5 font-bold uppercase">
                Upcycled Profit
              </span>
            </div>
          </div>

          {/* Dish Photography Banner */}
          {recipe.imageUrl && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-[#E8DFD1] group shadow-inner bg-stone-100">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono">
                <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                  {recipe.scrapWeightNeededKg} kg {recipe.scrapTypeNeeded.replace('_', ' ')}
                </span>
                <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-white shadow-xs">
                  ₹{recipe.suggestedPrice.toFixed(0)}
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-[#6B6358] leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Quick Metrics Bar: Yield Portions, Prep Time, Scrap Needed */}
          <div className="grid grid-cols-3 gap-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#E8DFD1] mb-4 shadow-inner">
            <div>
              <span className="text-[10px] font-mono text-[#6B6358] uppercase block flex items-center gap-1 font-semibold">
                <Users className="w-3 h-3 text-emerald-600" /> Yield
              </span>
              <span className="text-sm font-heading font-black text-[#1C1917]">
                {recipe.yieldPortions} <span className="text-[11px] font-normal text-[#6B6358]">portions</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#6B6358] uppercase block flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3 text-amber" /> Prep Time
              </span>
              <span className="text-sm font-heading font-black text-[#1C1917]">
                {recipe.prepTimeMins} <span className="text-[11px] font-normal text-[#6B6358]">mins</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#6B6358] uppercase block flex items-center gap-1 font-semibold">
                <Flame className="w-3 h-3 text-coral" /> Scrap Mass
              </span>
              <span className="text-sm font-heading font-black text-[#1C1917]">
                {recipe.scrapWeightNeededKg} <span className="text-[11px] font-normal text-[#6B6358]">kg ({availableScrapWeight.toFixed(1)}k avail)</span>
              </span>
            </div>
          </div>

          {/* Cost & Margin Breakdown Box */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD1] space-y-2 mb-4 shadow-sm">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DFD1]">
              <span className="font-mono text-[#6B6358] font-bold">Cost & Margin Breakdown (Per Portion)</span>
              <span className="font-mono text-emerald-700 font-black">Suggested: ₹{recipe.suggestedPrice.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-[#FDFBF7] p-2 rounded-lg border border-[#E8DFD1]">
                <span className="text-[10px] text-[#6B6358] block">Raw Byproduct Cost</span>
                <span className="font-black text-emerald-700">₹{recipe.rawByproductCost.toFixed(2)} (Free)</span>
              </div>
              <div className="bg-[#FDFBF7] p-2 rounded-lg border border-[#E8DFD1]">
                <span className="text-[10px] text-[#6B6358] block">Seasoning & Gas</span>
                <span className="font-bold text-[#1C1917]">₹{recipe.seasoningGasCost.toFixed(2)}</span>
              </div>
              <div className="bg-[#FDFBF7] p-2 rounded-lg border border-[#E8DFD1]">
                <span className="text-[10px] text-[#6B6358] block">Batch Net Profit</span>
                <span className="font-black text-emerald-700">+₹{totalBatchProfit.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Pantry Ingredients Checklist */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-[#6B6358] uppercase tracking-wider">
                Pantry Requirements Checklist
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                {recipe.pantryIngredients.filter((pi) => pi.inStock).length}/{recipe.pantryIngredients.length} In-Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {recipe.pantryIngredients.map((ing) => (
                <button
                  type="button"
                  key={ing.name}
                  onClick={() => togglePantryIngredient(recipe.id, ing.name)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all shadow-sm ${
                    ing.inStock
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-medium'
                      : 'bg-coral-50 border-coral-200 text-coral-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {ing.inStock ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
            <div className="mt-3 pt-3 border-t border-[#E8DFD1] space-y-3">
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-900">
                <div className="font-bold flex items-center gap-1.5 text-violet-800 mb-1">
                  <ChefHat className="w-3.5 h-3.5" /> Chef Pro-Tip
                </div>
                {recipe.chefTips}
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-[#6B6358] uppercase block mb-1.5">
                  Line Preparation Steps
                </span>
                <ol className="space-y-1.5 text-xs text-[#6B6358] font-mono">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#EAE1D4] text-[#1C1917] text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-[#1C1917] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-3 border-t border-[#E8DFD1] flex items-center justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-[#6B6358] hover:text-[#1C1917] flex items-center space-x-1 font-mono font-semibold"
          >
            <span>{isExpanded ? 'Hide Steps' : 'View Chef Steps'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Approve and Push to POS Button (Requires Login/Register) */}
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('signin');
                return;
              }
              setIsPushModalOpen(true);
            }}
            disabled={isAuthenticated && !hasEnoughScrap}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl font-heading font-black text-xs shadow-md transition-all transform active:scale-95 ${
              !isAuthenticated
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                : hasEnoughScrap
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-glow-emerald'
                : 'bg-white text-[#6B6358] border border-[#E8DFD1] cursor-not-allowed opacity-60'
            }`}
          >
            {!isAuthenticated ? (
              <Lock className="w-3.5 h-3.5 text-amber-200" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>
              {!isAuthenticated
                ? 'Sign in to Push to POS'
                : hasEnoughScrap
                ? 'Approve & Push to POS'
                : `Need +${(recipe.scrapWeightNeededKg - availableScrapWeight).toFixed(1)}kg Scrap`}
            </span>
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
