import React, { useState, useMemo } from 'react';
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
  Utensils,
  Layers,
  Filter,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { ScrollReveal } from '../common/ScrollReveal';
import { IngredientSelector, INGREDIENT_CATALOG } from './IngredientSelector';
import { RecipeDetailModal } from './RecipeDetailModal';
import regionalScrapRecipes from '../../data/scrapRecipes.json';

export const NormalUserRecipeView: React.FC = () => {
  const { recipes: storeRecipes, userProfile, setRole } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [detailedRecipe, setDetailedRecipe] = useState<RecipeDish | null>(null);
  const [cookedSuccessId, setCookedSuccessId] = useState<string | null>(null);

  // Convert regional scrap recipes to RecipeDish format to build an expansive library of 17+ dishes
  const regionalMappedRecipes: RecipeDish[] = useMemo(() => {
    const dishImages: Record<string, string> = {
      'rec-ridge-gourd-thogayal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      'rec-veg-trim-sambar-rasam': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      'rec-stale-roti-upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'rec-fermented-rice-kanji': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      'rec-cauliflower-stalk-bhaji': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'rec-watermelon-rind-subzi': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'rec-potato-peel-crispy-bhaja': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
      'rec-dal-water-rasam': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
      'rec-herb-stem-spiced-salt': 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
      'rec-bone-collagen-soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
      'rec-citrus-peel-chutney': 'https://images.unsplash.com/photo-1527477378696-618ec538c10e?auto=format&fit=crop&w=800&q=80',
      'rec-onion-skin-golden-broth': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
    };

    return regionalScrapRecipes.map((r: any) => {
      const category = r.primaryScrapCategory.includes('peel') || r.primaryScrapCategory.includes('trim')
        ? 'Soups & Potages'
        : r.primaryScrapCategory.includes('rice') || r.primaryScrapCategory.includes('roti')
        ? 'Starters & Sides'
        : 'Sauces & Condiments';

      // Map primary scrap category to internal ScrapCategory
      let scrapType: any = 'mirepoix_peels';
      if (r.primaryScrapCategory.includes('bone')) scrapType = 'poultry_bones';
      else if (r.primaryScrapCategory.includes('citrus')) scrapType = 'citrus_rinds';
      else if (r.primaryScrapCategory.includes('herb')) scrapType = 'herb_stems';
      else if (r.primaryScrapCategory.includes('roti') || r.primaryScrapCategory.includes('bread')) scrapType = 'bread_crusts';

      return {
        id: r.id,
        title: r.name,
        category,
        scrapTypeNeeded: scrapType,
        scrapWeightNeededKg: Number(((r.minScrapGramsPerPortion * 4) / 1000).toFixed(2)),
        yieldPortions: 4,
        prepTimeMins: r.prepTimeMinutes,
        pantryIngredients: r.stapleSpicesNeeded.map((s: string) => ({ name: s, inStock: true, qty: '1 pinch' })),
        rawByproductCost: 0,
        seasoningGasCost: r.pantryCostINR,
        suggestedPrice: Number((r.pantryCostINR * 3.5).toFixed(0)),
        marginPercent: 91.2,
        description: r.culinaryTip,
        flavorProfile: 'Nutritious regional flavors, zero-waste comfort',
        chefTips: r.culinaryTip,
        instructions: r.instructions.en,
        tags: ['Zero-Cost Scrap', r.difficulty, `₹${r.pantryCostINR}/serving`],
        author: 'Zero-Waste Community Chef',
        imageUrl: dishImages[r.id] || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        status: 'ready_to_cook' as const
      };
    });
  }, []);

  // Combined master catalog of recipes
  const allAvailableRecipes = useMemo(() => {
    return [...storeRecipes, ...regionalMappedRecipes];
  }, [storeRecipes, regionalMappedRecipes]);

  const categories = ['All', 'Soups & Potages', 'Starters & Sides', 'Small Plates & Bar Bites', 'Sauces & Condiments'];

  // Match scoring helper
  const calculateMatch = (recipe: RecipeDish) => {
    if (selectedIngredientIds.length === 0) return { score: 100, isMatched: true, matchedCount: 0 };

    let matches = 0;
    const recipeText = (
      recipe.title + ' ' + 
      recipe.description + ' ' + 
      recipe.scrapTypeNeeded + ' ' + 
      recipe.pantryIngredients.map(p => p.name).join(' ') + ' ' +
      recipe.instructions.join(' ')
    ).toLowerCase();

    selectedIngredientIds.forEach((id) => {
      const option = INGREDIENT_CATALOG.find((i) => i.id === id);
      if (!option) return;

      const tagMatch = option.scrapTag && recipe.scrapTypeNeeded === option.scrapTag;
      const textMatch = recipeText.includes(option.name.toLowerCase().split(' ')[0]) || 
                         recipeText.includes(id.replace('_', ' '));

      if (tagMatch || textMatch) {
        matches++;
      }
    });

    const score = Math.round((matches / selectedIngredientIds.length) * 100);
    return {
      score,
      isMatched: matches > 0,
      matchedCount: matches
    };
  };

  // Filtered & Ranked Recipes
  const rankedRecipes = useMemo(() => {
    return allAvailableRecipes
      .map((r) => {
        const match = calculateMatch(r);
        return { recipe: r, ...match };
      })
      .filter(({ recipe, isMatched }) => {
        const matchesCat = selectedCategory === 'All' || recipe.category === selectedCategory;
        const matchesSearch = 
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.scrapTypeNeeded.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSelection = selectedIngredientIds.length === 0 || isMatched;

        return matchesCat && matchesSearch && matchesSelection;
      })
      .sort((a, b) => b.score - a.score);
  }, [allAvailableRecipes, selectedCategory, searchQuery, selectedIngredientIds]);

  const handleCookDish = (recipe: RecipeDish) => {
    sounds.playSuccessChime();
    setCookedSuccessId(recipe.id);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setTimeout(() => {
      setCookedSuccessId(null);
    }, 3500);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner for Home Cook */}
      <ScrollReveal direction="up" distance={20}>
        <div className="bg-[#FFFDF9] border border-[#E8DFD1] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Culinary Valorization Studio
              </span>
              <span className="text-xs font-mono text-stone-500">• Reverse Recipe Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              Transform Kitchen Scraps Into Gourmet Meals
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl font-sans leading-relaxed">
              Select what scraps and pantry items you have below. Unlock complete masterclass step-by-step recipes with portion scaling, timers, and chef instructions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setRole('prep')}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Camera Scan Food Scraps</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 1. Interactive Multi-Ingredient Selector */}
      <ScrollReveal direction="up" distance={24} delay={0.04}>
        <IngredientSelector
          selectedIds={selectedIngredientIds}
          onChange={setSelectedIngredientIds}
          matchedCount={rankedRecipes.length}
        />
      </ScrollReveal>

      {/* 2. Filter, Search & Category Navigation Bar */}
      <ScrollReveal direction="up" distance={20} delay={0.06}>
        <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E8DFD1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients or tags..."
              className="w-full bg-white text-stone-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playTap();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 3. Recipes Results Header */}
      <div className="flex items-baseline justify-between px-1">
        <div>
          <h3 className="text-lg font-heading font-black text-stone-900">
            {selectedIngredientIds.length > 0 ? 'Matched Recipes For Your Basket' : 'All Curated Master Recipes'}
          </h3>
          <p className="text-xs text-stone-500 font-mono">
            Showing {rankedRecipes.length} dishes • Click any dish card to view full step-by-step recipe & portion scaler
          </p>
        </div>
      </div>

      {/* 4. Recipes Grid */}
      {rankedRecipes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFD1] space-y-3">
          <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="font-heading font-bold text-stone-800 text-base">No Matching Dishes Found</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try selecting different ingredient combinations or clearing your search filter.
          </p>
          <button
            onClick={() => {
              setSelectedIngredientIds([]);
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rankedRecipes.map(({ recipe, score, matchedCount }, idx) => {
            const isSuccess = cookedSuccessId === recipe.id;

            return (
              <ScrollReveal key={recipe.id} delay={idx * 0.05} direction="up" distance={24}>
                <div
                  className="bg-[#FFFDF9] border border-[#E8DFD1] hover:border-emerald-400 rounded-3xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between space-y-4 h-full card-3d-hover group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {recipe.category}
                      </span>

                      {selectedIngredientIds.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{score}% Match</span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> {recipe.prepTimeMins} mins
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => {
                        sounds.playTap();
                        setDetailedRecipe(recipe);
                      }}
                      className="font-heading font-black text-stone-900 text-lg group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {recipe.title}
                    </h3>

                    {/* Dish Photography Banner */}
                    {recipe.imageUrl && (
                      <div 
                        onClick={() => {
                          sounds.playTap();
                          setDetailedRecipe(recipe);
                        }}
                        className="relative w-full h-40 rounded-2xl overflow-hidden my-2.5 border border-[#E8DFD1] cursor-pointer shadow-inner bg-stone-100"
                      >
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute top-2.5 right-2.5">
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-lg border border-white/20">
                            {recipe.instructions.length} Steps
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                          <span className="bg-emerald-800/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold">
                            ₹{recipe.seasoningGasCost || (recipe.suggestedPrice * 0.08).toFixed(1)} / serving
                          </span>
                          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-stone-200 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Step-by-Step
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {recipe.description}
                    </p>

                    {/* Scrap Requirement Tag */}
                    <div className="mt-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-mono space-y-1">
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-400 text-[10px] uppercase font-semibold">Uses Scrap:</span>
                        <strong className="text-emerald-800 font-bold capitalize">
                          {recipe.scrapWeightNeededKg} kg {recipe.scrapTypeNeeded.replace('_', ' ')}
                        </strong>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-400 text-[10px] uppercase font-semibold">Yield:</span>
                        <span className="text-stone-800">{recipe.yieldPortions} portions</span>
                      </div>
                    </div>

                    {/* Pantry ingredients summary chips */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipe.pantryIngredients.slice(0, 3).map((p, i) => (
                        <span key={i} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-lg border border-[#E8DFD1] text-stone-600">
                          {p.name}
                        </span>
                      ))}
                      {recipe.pantryIngredients.length > 3 && (
                        <span className="text-[10px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">
                          +{recipe.pantryIngredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#E8DFD1] flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setDetailedRecipe(recipe);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Step-by-Step Recipe</span>
                    </button>

                    <button
                      onClick={() => handleCookDish(recipe)}
                      className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1 ${
                        isSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-emerald-50 text-stone-700 border border-[#E8DFD1]'
                      }`}
                      title="Quick log dish cooking"
                    >
                      {isSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Diverted!</span>
                        </>
                      ) : (
                        <>
                          <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Cooked</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Masterclass Step-by-Step Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={detailedRecipe}
        isOpen={!!detailedRecipe}
        onClose={() => setDetailedRecipe(null)}
      />

    </div>
  );
};
