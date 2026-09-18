import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Check, 
  Filter, 
  ChefHat, 
  Layers, 
  Flame, 
  ChevronRight,
  Info
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export interface IngredientOption {
  id: string;
  name: string;
  category: 'vegetables' | 'grains' | 'proteins' | 'aromatics' | 'pantry';
  emoji: string;
  scrapTag?: string;
}

export const INGREDIENT_CATALOG: IngredientOption[] = [
  // Vegetables & Scrap Peels
  { id: 'potato_peels', name: 'Potato Peels & Skins', category: 'vegetables', emoji: '🥔', scrapTag: 'mirepoix_peels' },
  { id: 'carrot_peels', name: 'Carrot Peels & Tops', category: 'vegetables', emoji: '🥕', scrapTag: 'mirepoix_peels' },
  { id: 'onion_skins', name: 'Papery Onion Skins & Tops', category: 'vegetables', emoji: '🧅', scrapTag: 'mirepoix_peels' },
  { id: 'tomato_tops', name: 'Tomato Tops & Stems', category: 'vegetables', emoji: '🍅', scrapTag: 'vegetable_trimmings' },
  { id: 'ridge_gourd_peels', name: 'Ridge Gourd Peels (Turai)', category: 'vegetables', emoji: '🥒', scrapTag: 'ridge_gourd_peels' },
  { id: 'cauliflower_stalks', name: 'Cauliflower Stalks & Ribs', category: 'vegetables', emoji: '🥦', scrapTag: 'cauliflower_stalks' },
  { id: 'watermelon_rind', name: 'Watermelon Rind (White Flesh)', category: 'vegetables', emoji: '🍉', scrapTag: 'watermelon_rind' },
  
  // Grains, Breads & Liquids
  { id: 'leftover_rice', name: 'Leftover Cooked Rice', category: 'grains', emoji: '🍚', scrapTag: 'leftover_rice' },
  { id: 'stale_roti_bread', name: 'Day-Old Chapati / Roti', category: 'grains', emoji: '🫓', scrapTag: 'stale_roti_bread' },
  { id: 'bread_crusts', name: 'Sourdough Crusts & Ends', category: 'grains', emoji: '🍞', scrapTag: 'bread_crusts' },
  { id: 'dal_water', name: 'Dal Boiling Water / Starch', category: 'grains', emoji: '🥣', scrapTag: 'dal_water' },

  // Proteins & Bones
  { id: 'poultry_bones', name: 'Poultry Carcass & Bones', category: 'proteins', emoji: '🍗', scrapTag: 'poultry_bones' },
  { id: 'fish_frames', name: 'Fish Heads & Bones', category: 'proteins', emoji: '🐟', scrapTag: 'fish_frames' },
  
  // Aromatics, Herbs & Citrus
  { id: 'herb_stems', name: 'Coriander & Mint Stems', category: 'aromatics', emoji: '🌿', scrapTag: 'herb_stems' },
  { id: 'citrus_rinds', name: 'Squeezed Lemon / Orange Rinds', category: 'aromatics', emoji: '🍋', scrapTag: 'citrus_rinds' },
  { id: 'garlic_cloves', name: 'Garlic Cloves & Skins', category: 'aromatics', emoji: '🧄' },
  { id: 'ginger_trims', name: 'Ginger Root Trimmings', category: 'aromatics', emoji: '🫚' },

  // Pantry Staples & Seasonings
  { id: 'mustard_seeds', name: 'Mustard Seeds (Rai)', category: 'pantry', emoji: '🟡' },
  { id: 'cumin_seeds', name: 'Cumin Seeds (Jeera)', category: 'pantry', emoji: '🟤' },
  { id: 'turmeric', name: 'Turmeric Powder (Haldi)', category: 'pantry', emoji: '✨' },
  { id: 'black_peppercorns', name: 'Whole Black Peppercorns', category: 'pantry', emoji: '⚫' },
  { id: 'tamarind', name: 'Tamarind Pulp', category: 'pantry', emoji: '🟫' },
  { id: 'cooking_oil', name: 'Cooking Oil / Mustard Oil', category: 'pantry', emoji: '🫗' }
];

interface IngredientSelectorProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  matchedCount: number;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIds,
  onChange,
  matchedCount
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vegetables' | 'grains' | 'proteins' | 'aromatics' | 'pantry'>('all');

  const handleToggle = (id: string) => {
    sounds.playTap();
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClearAll = () => {
    sounds.playTap();
    onChange([]);
  };

  const handleSelectPreset = (presetIds: string[]) => {
    sounds.playTap();
    onChange(presetIds);
  };

  const categoryTabs = [
    { id: 'all', label: 'All Ingredients', count: INGREDIENT_CATALOG.length },
    { id: 'vegetables', label: 'Vegetable Peels & Scraps', count: INGREDIENT_CATALOG.filter(i => i.category === 'vegetables').length },
    { id: 'grains', label: 'Breads, Rice & Dal', count: INGREDIENT_CATALOG.filter(i => i.category === 'grains').length },
    { id: 'proteins', label: 'Bones & Poultry', count: INGREDIENT_CATALOG.filter(i => i.category === 'proteins').length },
    { id: 'aromatics', label: 'Herbs & Citrus Rinds', count: INGREDIENT_CATALOG.filter(i => i.category === 'aromatics').length },
    { id: 'pantry', label: 'Pantry Staples', count: INGREDIENT_CATALOG.filter(i => i.category === 'pantry').length },
  ];

  const filteredCatalog = activeCategory === 'all' 
    ? INGREDIENT_CATALOG 
    : INGREDIENT_CATALOG.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      
      {/* Header with Title and Live Match Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD1] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 tracking-wider">
              Smart Scrap & Pantry Matcher
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-stone-900 mt-1">
            What's in Your Kitchen Right Now?
          </h2>
          <p className="text-xs text-stone-600 font-sans mt-0.5">
            Click ingredients & trimmings you have. Our solver instantly formulates matching zero-waste recipes.
          </p>
        </div>

        {/* Live Match Counter Badge */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-2xl flex items-center space-x-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-mono font-bold text-emerald-950">
              {matchedCount} {matchedCount === 1 ? 'Recipe' : 'Recipes'} Matched
            </span>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-mono font-semibold text-stone-500 hover:text-rose-700 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Curated Kitchen Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block">
          Quick Kitchen Scenarios (1-Tap):
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: '🥕 Sunday Veggie Peels',
              ids: ['carrot_peels', 'potato_peels', 'onion_skins', 'tomato_tops']
            },
            {
              label: '🍗 Roast Bones & Herbs',
              ids: ['poultry_bones', 'herb_stems', 'garlic_cloves', 'black_peppercorns']
            },
            {
              label: '🍞 Stale Bread & Rice',
              ids: ['bread_crusts', 'stale_roti_bread', 'leftover_rice']
            },
            {
              label: '🍋 Citrus Rind & Spices',
              ids: ['citrus_rinds', 'herb_stems', 'mustard_seeds']
            }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSelectPreset(preset.ids)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-[#E8DFD1] hover:border-emerald-400 text-stone-700 text-xs font-sans transition-all shadow-xs active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playTap();
                setActiveCategory(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ingredients Grid (Clickable Chips) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filteredCatalog.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-98 ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-[#E8DFD1] hover:border-emerald-400 hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-xl shrink-0">{item.emoji}</span>
                <div className="min-w-0">
                  <span className={`text-xs font-heading font-bold block truncate ${
                    isSelected ? 'text-emerald-950' : 'text-stone-800 group-hover:text-emerald-800'
                  }`}>
                    {item.name}
                  </span>
                  {item.scrapTag && (
                    <span className="text-[9px] font-mono text-emerald-700 block uppercase font-semibold">
                      Zero-Cost Scrap
                    </span>
                  )}
                </div>
              </div>

              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-stone-300 bg-white group-hover:border-emerald-400'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selected Ingredients Tray */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-900 mr-1">
            Active Basket ({selectedIds.length}):
          </span>
          {selectedIds.map((id) => {
            const item = INGREDIENT_CATALOG.find((i) => i.id === id);
            if (!item) return null;
            return (
              <span
                key={id}
                onClick={() => handleToggle(id)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-xs font-mono font-semibold text-emerald-950 shadow-xs cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800 transition-colors"
                title="Click to remove"
              >
                <span>{item.emoji} {item.name.split(' ')[0]}</span>
                <span className="text-stone-400 hover:text-rose-600 font-bold ml-1">×</span>
              </span>
            );
          })}
        </div>
      )}

    </div>
  );
};
