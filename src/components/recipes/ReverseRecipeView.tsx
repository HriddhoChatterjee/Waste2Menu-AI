import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RecipeCard } from './RecipeCard';
import { 
  Sparkles, 
  ChefHat, 
  Search, 
  Filter, 
  TrendingUp, 
  Layers, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const ReverseRecipeView: React.FC = () => {
  const { recipes, scraps } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFeasible, setOnlyFeasible] = useState<boolean>(false);

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.scrapTypeNeeded.includes(searchQuery.toLowerCase());
    
    if (onlyFeasible) {
      const availScrap = scraps
        .filter((s) => s.category === r.scrapTypeNeeded)
        .reduce((acc, s) => acc + s.weightKg, 0);
      const isFeasible = availScrap >= r.scrapWeightNeededKg;
      return matchesCat && matchesSearch && isFeasible;
    }

    return matchesCat && matchesSearch;
  });

  const categories = ['all', 'Soups & Potages', 'Small Plates & Bar Bites', 'Starters & Sides'];

  // Potential revenue
  const totalPotentialProfit = recipes.reduce((acc, r) => {
    return acc + (r.yieldPortions * r.suggestedPrice - r.yieldPortions * r.seasoningGasCost);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-charcoal via-charcoal-dark to-obsidian p-6 rounded-2xl border border-charcoal-light shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
              Station Screen 2
            </span>
            <span className="text-textMuted text-xs font-mono">• Reverse Optimization KDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Reverse Recipe Matcher & Chef KDS
          </h1>
          <p className="text-sm text-textMuted max-w-2xl">
            Algorithmic culinary synthesis matching real-time scrap reservoir stockpiles into high-margin, zero-waste daily specials.
          </p>
        </div>

        {/* Quick KDS Stats */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-obsidian/80 border border-charcoal-light p-3.5 rounded-xl text-right">
            <div className="text-[11px] font-mono text-textMuted uppercase">Avg Profit Margin</div>
            <div className="text-xl font-heading font-black text-emerald-400">
              93.4% <span className="text-xs font-normal text-textMuted">ROI</span>
            </div>
          </div>
          <div className="bg-obsidian/80 border border-charcoal-light p-3.5 rounded-xl text-right">
            <div className="text-[11px] font-mono text-textMuted uppercase">Available Matches</div>
            <div className="text-xl font-heading font-black text-violet-400">
              {recipes.length} <span className="text-xs font-normal text-textMuted">dishes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Tabs, Feasibility Toggle */}
      <div className="glass-panel p-4 rounded-2xl border border-charcoal-light flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, scraps, tags..."
            className="w-full bg-charcoal text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-light focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-obsidian font-bold shadow-glow-emerald'
                  : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
              }`}
            >
              {cat === 'all' ? 'All Recipes' : cat}
            </button>
          ))}
        </div>

        {/* Only Feasible Now Checkbox */}
        <button
          onClick={() => setOnlyFeasible(!onlyFeasible)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
            onlyFeasible
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${onlyFeasible ? 'text-emerald-400' : 'text-textMuted'}`} />
          <span>Feasible From Live Stock Only</span>
        </button>

      </div>

      {/* Grid of Matched Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

    </div>
  );
};
