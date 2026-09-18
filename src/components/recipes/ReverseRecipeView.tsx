import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RecipeCard } from './RecipeCard';
import { CreateRecipeModal } from './CreateRecipeModal';
import { 
  Sparkles, 
  ChefHat, 
  Search, 
  Filter, 
  TrendingUp, 
  Layers, 
  Clock, 
  CheckCircle2,
  Plus,
  Lock
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const ReverseRecipeView: React.FC = () => {
  const { recipes, scraps, userProfile, isAuthenticated, openAuthModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'my_authored' | 'feasible'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const authorName = userProfile?.name || 'Chef Aarav Singhania';

  // Feasible check helper
  const checkFeasibility = (recipe: typeof recipes[0]) => {
    const availScrap = scraps
      .filter((s) => s.category === recipe.scrapTypeNeeded)
      .reduce((acc, s) => acc + s.weightKg, 0);
    return availScrap >= recipe.scrapWeightNeededKg;
  };

  const myAuthoredRecipes = recipes.filter(
    (r) => r.author === authorName || r.id === 'rec-1' || r.id === 'rec-2'
  );
  const feasibleRecipes = recipes.filter(checkFeasibility);

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    // Tab filter
    if (activeTab === 'my_authored') {
      const isMine = r.author === authorName || r.id === 'rec-1' || r.id === 'rec-2';
      if (!isMine) return false;
    } else if (activeTab === 'feasible') {
      if (!checkFeasibility(r)) return false;
    }

    // Category filter
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;

    // Search filter
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.scrapTypeNeeded.includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const categories = [
    'all', 
    'Starters & Sides', 
    'Soups & Potages', 
    'Small Plates & Bar Bites', 
    'Mains & Pasta', 
    'Desserts & Pastry'
  ];

  return (
    <div className="space-y-6">
      
      {/* Screen Header */}
      <ScrollReveal direction="up" distance={20}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FDFBF7] to-[#F5EFEB] p-6 rounded-2xl border border-[#E8DFD1] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Station Screen 2
              </span>
              <span className="text-[#6B6358] text-xs font-mono">• Reverse Optimization KDS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1C1917]">
              Reverse Recipe Matcher & Chef Studio
            </h1>
            <p className="text-sm text-[#6B6358] max-w-2xl">
              Algorithmic culinary synthesis matching real-time scrap reservoir stockpiles into high-margin, zero-waste dishes and chef-crafted specials.
            </p>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('signin');
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              {!isAuthenticated ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
              <span>{isAuthenticated ? '+ Author New Recipe' : '+ Author Recipe (Sign In)'}</span>
            </button>

            <div className="bg-white border border-[#E8DFD1] p-3 rounded-xl text-right shadow-xs">
              <div className="text-[10px] font-mono text-[#6B6358] uppercase font-bold">Total Recipes</div>
              <div className="text-lg font-heading font-black text-emerald-700">
                {recipes.length} <span className="text-xs font-normal text-[#6B6358]">dishes</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Chef Mode Sub-Tabs (All / My Authored / Feasible) */}
      <ScrollReveal direction="up" distance={20} delay={0.06}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#F5EFEB] border border-[#E8DFD1]">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-heading transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1] font-medium'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Recipes</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'all' ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-700'}`}>
                {recipes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my_authored')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-heading transition-all ${
                activeTab === 'my_authored'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1] font-medium'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>My Authored Dishes</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'my_authored' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {myAuthoredRecipes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('feasible')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-heading transition-all ${
                activeTab === 'feasible'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1] font-medium'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feasible From Stock</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'feasible' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {feasibleRecipes.length}
              </span>
            </button>
          </div>

          <div className="text-xs font-mono text-stone-500 pr-2 hidden sm:block">
            Logged in: <span className="font-bold text-stone-800">{authorName}</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Controls Bar: Search & Category Tabs */}
      <ScrollReveal direction="up" distance={20} delay={0.1}>
        <div className="glass-panel p-4 rounded-2xl border border-[#E8DFD1] flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#6B6358] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, scraps, tags..."
              className="w-full bg-white text-[#1C1917] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD1] shadow-xs focus:outline-none focus:border-emerald-500 font-medium"
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
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-white text-[#6B6358] hover:text-[#1C1917] border border-[#E8DFD1] hover:bg-[#F5EFEB]'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* Grid of Matched Recipes or Empty State */}
      {activeTab === 'my_authored' && !isAuthenticated ? (
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center py-12 px-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
              <Lock className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-stone-900 text-lg">
                Kitchen Account Sign In Required
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Saving, authoring, and managing custom kitchen specials are commercial features available after signing in or registering your kitchen.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-heading font-bold shadow-xs transition-transform active:scale-95"
              >
                Sign In to Kitchen
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-heading font-bold shadow-xs transition-transform active:scale-95"
              >
                Register Account
              </button>
            </div>
          </div>
        </ScrollReveal>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe, idx) => (
            <ScrollReveal key={recipe.id} delay={idx * 0.06} direction="up" distance={24}>
              <RecipeCard recipe={recipe} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#E8DFD1] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-stone-900 text-base">No recipes found for this filter</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                {activeTab === 'my_authored' 
                  ? "You haven't published any custom dishes matching this criteria. Click 'Author New Recipe' to create one!"
                  : "No dishes currently match the selected criteria or scrap stockpiles."}
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
            >
              + Author New Recipe Now
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* Chef Recipe Creation Modal */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

    </div>
  );
};
