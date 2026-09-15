import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RecipeDish } from '../../types';
import { 
  Sparkles, 
  Search, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  Leaf, 
  BookOpen, 
  UploadCloud, 
  Check, 
  ArrowRight,
  Flame,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { ScrollReveal } from '../common/ScrollReveal';

export const NormalUserRecipeView: React.FC = () => {
  const { recipes, userProfile, setRole } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCookRecipeId, setActiveCookRecipeId] = useState<string | null>(null);
  const [cookedSuccessId, setCookedSuccessId] = useState<string | null>(null);

  const categories = ['All', 'Soups & Potages', 'Starters & Sides', 'Sauces & Condiments', 'Infusions & Glazes'];

  const filteredRecipes = recipes.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.scrapTypeNeeded.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCookDish = (recipe: RecipeDish) => {
    sounds.playSuccessChime();
    setCookedSuccessId(recipe.id);
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setTimeout(() => {
      setCookedSuccessId(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner for Home Cook */}
      <ScrollReveal direction="up" distance={20}>
        <div className="bg-[#FFFDF9] border border-[#E8DFD1] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Home Cook Discovery
              </span>
              <span className="text-xs font-mono text-stone-500">• Tailored Recipes by Master Chefs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              Chef-Crafted Recipes for Your Leftovers
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl font-sans">
              Every recipe below transforms vegetable peels, chicken bones, citrus rinds, and bread crusts into gourmet home meals.
            </p>
          </div>

          <button
            onClick={() => setRole('prep')}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Food Image & Enter Weights</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <ScrollReveal direction="up" distance={20} delay={0.06}>
        <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E8DFD1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ingredient or dish..."
              className="w-full bg-white text-stone-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.map((recipe, idx) => {
          const isExpanded = activeCookRecipeId === recipe.id;
          const isSuccess = cookedSuccessId === recipe.id;

          return (
            <ScrollReveal key={recipe.id} delay={idx * 0.06} direction="up" distance={24}>
              <div
                className="bg-[#FFFDF9] border border-[#E8DFD1] hover:border-emerald-400 rounded-2xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between space-y-4 h-full"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {recipe.category}
                    </span>
                    <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> {recipe.prepTimeMins} mins
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-stone-900 text-lg">
                    {recipe.title}
                  </h3>

                  {/* Dish Photography Banner */}
                  {recipe.imageUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden my-2.5 border border-[#E8DFD1] group shadow-inner bg-stone-100">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono">
                        <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                          {recipe.scrapWeightNeededKg} kg {recipe.scrapTypeNeeded.replace('_', ' ')}
                        </span>
                        {recipe.author && (
                          <span className="bg-emerald-700/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-white shadow-xs">
                            {recipe.author}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Scrap Requirement Tag */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-stone-600">
                      <span className="text-stone-400 text-[10px] uppercase font-semibold">Uses Scrap:</span>
                      <strong className="text-emerald-700 font-bold">
                        {recipe.scrapWeightNeededKg} kg ({recipe.scrapTypeNeeded.replace('_', ' ')})
                      </strong>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span className="text-stone-400 text-[10px] uppercase font-semibold">Yield:</span>
                      <span className="text-stone-800">{recipe.yieldPortions} home portions</span>
                    </div>
                  </div>

                  {/* Collapsible Cooking Steps */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#E8DFD1] space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                          Pantry Ingredients:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {recipe.pantryIngredients.map((p, i) => (
                            <span key={i} className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#E8DFD1] text-stone-700">
                              • {p.name} ({p.qty})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                          Step-by-Step Instructions:
                        </span>
                        {recipe.instructions.map((step, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1] text-[11px] font-mono text-stone-700 leading-tight">
                            <strong className="text-emerald-700 mr-1">Step {idx + 1}:</strong> {step}
                          </div>
                        ))}
                      </div>

                      {recipe.chefTips && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
                          💡 <strong>Chef Secret Tip:</strong> {recipe.chefTips}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#E8DFD1] flex items-center gap-2">
                  <button
                    onClick={() => setActiveCookRecipeId(isExpanded ? null : recipe.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-[#E8DFD1] font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isExpanded ? 'Hide Steps' : 'View Recipe Steps'}</span>
                  </button>

                  <button
                    onClick={() => handleCookDish(recipe)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1 ${
                      isSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Diverted {recipe.scrapWeightNeededKg} kg!</span>
                      </>
                    ) : (
                      <>
                        <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                        <span>I Made This!</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </div>
  );
};
